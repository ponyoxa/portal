import { defineContentConfig, defineCollection, z } from "@nuxt/content";
import { asOgImageCollection } from "nuxt-og-image/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "**/*.md",
    }),
    blog: defineCollection(
      asOgImageCollection({
        type: "page",
        source: "blog/**/*.md",
        schema: z.object({
          title: z.string().min(1, { message: "タイトルは必須です" }),
          description: z.string().optional(),
          updatedAt: z.string().optional(),
          createdAt: z.string().optional(),
          tags: z.array(z.string()).optional(),
        }),
      })
    ),
    diaries: defineCollection(
      asOgImageCollection({
        type: "page",
        source: "diaries/**/*.md",
        schema: z.object({
          title: z.string().min(1, { message: "タイトルは必須です" }),
          description: z.string().optional(),
          updatedAt: z.string().optional(),
          createdAt: z.string().optional(),
        }),
      })
    ),
  },
});
