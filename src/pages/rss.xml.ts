import { getRssString } from '@astrojs/rss';
import type { APIContext } from 'astro';
import type { CollectionEntry } from 'astro:content';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { getPublishedPosts } from '../utils/posts';

const parser = new MarkdownIt({ html: true, linkify: true });
const SITE_URL = 'https://andrewdunn.dev';

function getItemTitle(post: CollectionEntry<'blog'>): string {
  const series = post.data.series;
  const seriesPart = (post.data as any).series_part ?? series?.order;
  const seriesTitle = typeof series === 'string' ? series : (series?.title ?? series?.id);

  if (seriesTitle && seriesPart !== undefined) {
    return `${post.data.title} (${seriesTitle}, Part ${seriesPart})`;
  } else if (seriesTitle) {
    return `${post.data.title} (${seriesTitle})`;
  }
  return post.data.title;
}

function getExcerpt(body?: string): string {
  if (!body) return '';

  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  for (const para of paragraphs) {
    const cleaned = para
      .replace(/^#+\s+/gm, '') // headings
      .replace(/!\[.*?\]\(.*?\)/g, '') // images
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // code snippets
      .replace(/<[^>]+>/g, '') // HTML tags
      .replace(/[*_~]/g, '') // formatting
      .replace(/\s+/g, ' ') // collapse whitespace
      .trim();

    if (cleaned.length > 0) {
      if (cleaned.length <= 160) {
        return cleaned;
      }
      const truncated = cleaned.slice(0, 160);
      const lastSpace = truncated.lastIndexOf(' ');
      return (lastSpace > 120 ? truncated.slice(0, lastSpace) : truncated) + '...';
    }
  }

  return '';
}

function getItemDescription(post: CollectionEntry<'blog'>): string {
  if (post.data.description && post.data.description.trim()) {
    return post.data.description.trim();
  }
  const excerpt = getExcerpt(post.body);
  if (excerpt) {
    return excerpt;
  }
  return post.data.title;
}

function getSeriesContextHtml(post: CollectionEntry<'blog'>, siteUrl: string): string {
  const series = post.data.series;
  if (!series) return '';

  const seriesPart =
    (post.data as any).series_part ?? (typeof series === 'object' ? series.order : undefined);
  const seriesTitle = typeof series === 'string' ? series : (series.title ?? series.id);
  const seriesSlug =
    (post.data as any).series_slug ?? (typeof series === 'object' ? series.id : undefined);

  if (seriesSlug) {
    const seriesLink = `<a href="${siteUrl}/series/${seriesSlug}/">${seriesTitle}</a>`;
    if (seriesPart !== undefined) {
      return `<p><em>Part ${seriesPart} of ${seriesLink}</em></p>`;
    }
    return `<p><em>${seriesLink}</em></p>`;
  }

  if (seriesPart !== undefined) {
    return `<p><em>Part ${seriesPart} of ${seriesTitle}</em></p>`;
  }
  return `<p><em>${seriesTitle}</em></p>`;
}

function renderPostContent(post: CollectionEntry<'blog'>, siteUrl: string): string {
  let rawHtml = parser.render(post.body || '');

  // Normalize any relative or root-relative path to an absolute URL
  rawHtml = rawHtml.replace(
    /(href|src)=["'](?:\.\.\/|\.\/|\/)*([^"']+)["']/g,
    (match, attr, path) => {
      // Leave fully qualified URLs, protocols, and anchors untouched
      if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('//') ||
        path.startsWith('mailto:') ||
        path.startsWith('#')
      ) {
        return match;
      }

      // Normalize leading slashes and append to site origin
      const cleanPath = path.replace(/^\/+/, '');
      return `${attr}="${SITE_URL}/${cleanPath}"`;
    },
  );

  // Prepend series context notice if applicable
  const seriesContext = getSeriesContextHtml(post, siteUrl);
  if (seriesContext) {
    rawHtml = seriesContext + rawHtml;
  }

  // Sanitize HTML
  return sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'pre', 'code']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      code: ['class'],
    },
  });
}

function wrapCdata(content: string): string {
  const safeContent = content.replace(/\]\]>/g, ']]]]><![CDATA[>');
  return `<![CDATA[${safeContent}]]>`;
}

export async function GET(context: APIContext) {
  const allPosts = await getPublishedPosts();
  const posts = allPosts.slice(0, 20);

  const siteUrl = context.site ? context.site.href.replace(/\/$/, '') : SITE_URL;
  const feedUrl = `${siteUrl}/rss.xml`;
  const lastBuildDate = posts[0]?.data.pubDate
    ? new Date(posts[0].data.pubDate).toUTCString()
    : new Date().toUTCString();

  const renderedContents: string[] = [];

  const items = posts.map((post, index) => {
    const token = `__RSS_CONTENT_CDATA_${index}__`;
    renderedContents.push(renderPostContent(post, siteUrl));

    return {
      title: getItemTitle(post),
      pubDate: post.data.pubDate,
      description: getItemDescription(post),
      link: `/blog/${post.id}/`,
      content: token,
    };
  });

  let xmlString = await getRssString({
    title: 'Andrew Dunn',
    description: 'The mechanics of software delivery and production systems.',
    site: siteUrl,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      content: 'http://purl.org/rss/1.0/modules/content/',
    },
    customData: `<language>en-gb</language>
<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
<lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    items,
  });

  for (let i = 0; i < posts.length; i++) {
    const token = `__RSS_CONTENT_CDATA_${i}__`;
    xmlString = xmlString.replaceAll(token, wrapCdata(renderedContents[i]));
  }

  return new Response(xmlString, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
