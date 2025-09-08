import { defineNuxtConfig } from "nuxt/config";

import fg from "fast-glob";

const mdToRoutes = (patterns: string[]) =>
  fg
    .sync(patterns, { dot: false })
    .map(
      (p) =>
        "/" +
        p
          .replace(/^content\//, "") // content配下をURLに
          .replace(/\.md$/, "") // 拡張子除去
    )
    .map((r) => (r.endsWith("/index") ? r.slice(0, -6) : r)); // /xxx/index -> /xxx

const blogRoutes = mdToRoutes(["content/blog/**/*.md"]);
const diaryRoutes = mdToRoutes(["content/diaries/**/*.md"]);

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/content"],
  experimental: {
    renderJsonPayloads: true,
  },

  routeRules: {
    "/": { prerender: true },
    "/blog": { prerender: true },
    "/blog/**": { prerender: true },
    "/diaries": { prerender: true },
    "/diaries/**": { prerender: true },
  },

  css: ["./assets/css/font.css", "github-markdown-css"],
  content: {},

  compatibilityDate: "2025-05-15",

  nitro: {
    preset: "cloudflare_module",
    cloudflare: {},
    prerender: {
      routes: ["/blog", "/diaries", ...blogRoutes, ...diaryRoutes],
      crawlLinks: true,
    },
  },

  app: {
    head: {
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=BIZ+UDPGothic&display=swap",
        },
      ],
      htmlAttrs: {
        lang: "ja",
        prefix: "og: http://ogp.me/ns#",
      },
      title: "ponyoxa portal",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          hid: "description",
          name: "description",
          content: "ponyoxa が運営するブログです",
        },
        {
          hid: "og:site_name",
          property: "og:site_name",
          content: "ponyoxa blog",
        },
        { hid: "og:type", property: "og:type", content: "website" },
        {
          hid: "og:url",
          property: "og:url",
          content: "https://ponyoxa.com/",
        },
        {
          hid: "og:title",
          property: "og:title",
          content: "ponyoxa blog",
        },
        {
          hid: "og:description",
          property: "og:description",
          content: "ponyoxa が運営するブログです",
        },
        {
          hid: "og:image",
          property: "og:image",
          content: "blog-ogp-2.png",
        },
        { name: "twitter:card", content: "summary" },
      ],
    },
  },
});
