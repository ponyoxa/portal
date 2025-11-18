import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).optional().default([]),
  }),
});

const diaries = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
});

const root = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
  }),
});

export const collections = {
  blog,
  diaries,
  root,
};
