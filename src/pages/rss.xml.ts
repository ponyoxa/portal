import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { nowJST, compareDatesJST, toJST } from "../utils/date";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const blogs = await getCollection("blog", ({ data }) => {
    const now = nowJST();
    const createdAt = toJST(data.createdAt);
    return createdAt <= now;
  });

  const sortedBlogs = blogs.sort((a, b) => {
    return -compareDatesJST(a.data.createdAt, b.data.createdAt);
  });

  return rss({
    title: "ponyoxa portal",
    description:
      "主にバックエンドをやっているエンジニアのブログ - 技術、イベント、コミュニティ活動など",
    site: context.site || "https://ponyoxa.com",
    items: sortedBlogs.map((post) => ({
      title: post.data.title,
      description: post.data.description || "",
      pubDate: post.data.createdAt,
      link: `/blog/${post.slug}/`,
      categories: post.data.tags,
    })),
    customData: "<language>ja</language>",
  });
}
