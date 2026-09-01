import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Retrieves published blog posts, filtering out future scheduled posts in production
 * while keeping them visible in local development and Cloudflare preview branch builds.
 * Results are sorted descending by pubDate (newest first).
 */
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog');

  // Detect Cloudflare Pages preview build or explicit flag
  const isCloudflarePreview =
    process.env.CF_PAGES_ENVIRONMENT === 'preview' ||
    (typeof process.env.CF_PAGES_BRANCH === 'string' && process.env.CF_PAGES_BRANCH !== 'main') ||
    process.env.SHOW_SCHEDULED_POSTS === 'true';

  // Only filter out future posts if we are in production and not in a preview environment
  const isProduction = import.meta.env.PROD && !isCloudflarePreview;
  const now = Date.now();

  return posts
    .filter((post) => {
      if (isProduction) {
        return post.data.pubDate.valueOf() <= now;
      }
      return true;
    })
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
