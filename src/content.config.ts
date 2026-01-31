import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { fetchGoogleReviews } from './data/googleReviews';

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['family', 'maternity', 'love', 'children', 'events']),
    description: z.string(),
    image: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    image: z.string(),
    published: z.boolean().default(true),
  }),
});

const reviews = defineCollection({
  loader: async () => {
    const data = await fetchGoogleReviews();
    return data.reviews.map((review, index) => ({
      id: String(index),
      ...review,
    }));
  },
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    rating: z.number(),
  }),
});

export const collections = { portfolio, blog, reviews };
