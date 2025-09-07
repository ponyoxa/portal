import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "**/*.md",
    }),
    blog: defineCollection({
      type: "page",
      source: "blog/**/*.md",
      schema: z.object({
        title: z.string().min(1, { message: "タイトルは必須です" }),
        description: z.string().optional(),
        updatedAt: z.string().optional(),
        createdAt: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
    diaries: defineCollection({
      type: "page",
      source: "diaries/**/*.md",
      schema: z.object({
        title: z.string().min(1, { message: "タイトルは必須です" }),
        description: z.string().optional(),
        updatedAt: z.string().optional(),
        createdAt: z.string().optional(),
      }),
    }),
  },
});
