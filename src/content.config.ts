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

const companies = defineCollection({
  schema: z.object({
    title: z.string(),
    companies: z.array(
      z.object({
        name: z.string(),
        link: z.string(),
        role: z.string(),
        type: z.string(),
        duration: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
      }),
    ),
  }),
})

export const collections = { experience, projects, companies }
