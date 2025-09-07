import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/content"],

  routeRules: {
    "/": { prerender: true },
  },

  css: ["./assets/css/font.css", "github-markdown-css"],
  content: {},

  compatibilityDate: "2025-05-15",

  nitro: {
    preset: "cloudflare_module",
    cloudflare: {},
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
