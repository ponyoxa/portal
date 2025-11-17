import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
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

const content = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
  }),
});

export const collections = {
  blog,
  diaries,
  content,
};
