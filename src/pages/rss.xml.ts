import rss from '@astrojs/rss';
import { getPublishedPosts } from '../utils/posts';

export async function GET(context: any) {
  const blog = await getPublishedPosts();
  return rss({
    title: 'Andrew Dunn',
    description: 'Engineering Blog',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
