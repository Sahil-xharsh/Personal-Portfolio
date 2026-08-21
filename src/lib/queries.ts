import type { Post, Project } from '../types/content';
import { sanityClient } from './sanityClient';

export const postsQuery = `
  *[
    _type == "post" &&
    defined(publishedAt) &&
    publishedAt <= now()
  ] | order(publishedAt desc) {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage,
    body,
    tags,
    seoDescription
  }
` as const;

export const postBySlugQuery = `
  *[
    _type == "post" &&
    slug.current == $slug &&
    defined(publishedAt) &&
    publishedAt <= now()
  ][0] {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage,
    body,
    tags,
    seoDescription
  }
` as const;

export const projectsQuery = `
  *[_type == "project"] | order(order asc) {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    description,
    coverImage,
    gallery,
    techStack,
    githubUrl,
    liveUrl,
    featured,
    order
  }
` as const;

export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    description,
    coverImage,
    gallery,
    techStack,
    githubUrl,
    liveUrl,
    featured,
    order
  }
` as const;

export const fetchPosts = (): Promise<Post[]> =>
  sanityClient.fetch<Post[]>(postsQuery);

export const fetchPostBySlug = (slug: string): Promise<Post | null> =>
  sanityClient.fetch<Post | null>(postBySlugQuery, { slug });

export const fetchProjects = (): Promise<Project[]> =>
  sanityClient.fetch<Project[]>(projectsQuery);

export const fetchProjectBySlug = (slug: string): Promise<Project | null> =>
  sanityClient.fetch<Project | null>(projectBySlugQuery, { slug });
