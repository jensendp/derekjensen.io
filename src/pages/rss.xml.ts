import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error('Site URL must be configured in astro.config.mjs for RSS feed generation');
  }

  const blog = await getCollection('blog', ({ data }) => !data.draft);
  const sortedPosts = blog.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Derek Jensen | Blog',
    description: 'Thoughts on React Native, mobile development, and building products',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      author: post.data.author,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
