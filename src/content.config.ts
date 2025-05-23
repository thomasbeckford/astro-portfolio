import { z, defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
const nav = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          link: z.string(),
        }),
      ),
    }),
})

const skills = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      data: z.array(
        z.object({
          title: z.string(),
          icon: image(),
          description: z.string(),
        }),
      ),
    }),
})

const technologies = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      data: z.array(
        z.object({
          title: z.string(),
          icon: image(),
        }),
      ),
    }),
})

const projects = defineCollection({
  schema: ({ image }) =>
    z.object({
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
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      companies: z.array(
        z.object({
          name: z.string(),
          link: z.string(),
          role: z.string(),
          type: z.string(),
          duration: z.string(),
          icon: image(),
          responsabilities: z.string(),
          about: z.string(),
          technologies: z.array(z.string()),
        }),
      ),
    }),
})

const marqueeItems = defineCollection({
  loader: file('src/content/components/marquee/items.json'),
  schema: ({ image }) =>
    z.object({
      id: z.number(),
      title: z.string(),
      icon: image(),
    }),
})

export const collections = {
  technologies,
  skills,
  projects,
  companies,
  nav,
  marqueeItems,
}
