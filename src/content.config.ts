import { z, defineCollection } from 'astro:content'

const experience = defineCollection({
  schema: z.object({
    title: z.string(),
    skills: z.array(
      z.object({
        title: z.string(),
        icon: z.string(),
        description: z.string(),
      }),
    ),
  }),
})

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    apps: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        link: z.string(),
        tools: z.array(z.string()),
      }),
    ),
  }),
})

export const collections = { experience, projects }
