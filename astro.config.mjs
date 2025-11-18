import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import ogpGenerator from "./integrations/ogp-generator/index.js";

// https://astro.build/config
export default defineConfig({
  site: "https://ponyoxa.com",
  output: "static", // SSG モード
  // adapter: cloudflare(), // static の場合は不要

  build: {
    format: "directory", // URL を /blog/post/ の形式に
  },

  integrations: [mdx(), ogpGenerator()],
});
