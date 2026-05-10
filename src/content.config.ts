import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { fetchGoogleReviews } from './data/googleReviews';
import { z } from 'astro/zod';

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

const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: z.object({
    name: z.string(),
    shortDescription: z.string(),
    heroImage: z.string(),
    shootTypes: z.array(z.string()),
    seasons: z.array(z.string()),
    vibes: z.array(z.string()),
    access: z.array(z.string()),
    practicalInfo: z.object({
      parking: z.string(),
      transport: z.string(),
      bestTime: z.string(),
      permits: z.string().optional(),
    }),
    galleryImages: z.array(z.string()).optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })),
    nearbyLocations: z.array(z.string()),
    map: z.string().optional(),
  }),
});

export const collections = { portfolio, blog, reviews, locations };
