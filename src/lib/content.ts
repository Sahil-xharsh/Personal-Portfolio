import type { Post, Project, PortableTextBlock } from '../types/content';
import type { Transmission } from '../types';
import { TRANSMISSIONS } from '../data/portfolioData';
import { fetchPosts, fetchProjects } from './queries';
import { isSanityConfigured } from './sanityClient';
import { cloudinaryUrl } from './cloudinary';

const plainText = (value: string | undefined) => value?.trim() || '';

const projectToTransmission = (project: Project, index: number): Transmission => {
  const summary = plainText(project.description) || 'Project details are being prepared.';
  const techStack = project.techStack || [];

  return {
    id: project.slug || project._id,
    transmissionNumber: String(index + 1).padStart(2, '0'),
    title: project.title,
    accentWord: 'project system',
    tagline: '',
    period: 'CURRENT',
    status: 'ACTIVE',
    primaryDomain: techStack[0] || 'AI/ML Engineering',
    summary,
    previewImage: project.coverImage ? cloudinaryUrl(project.coverImage) : undefined,
    architectureOverview: summary,
    topologyFlow: [],
    specSnippet: {
      tabTitle: 'PROJECT NOTES',
      fileName: `${project.slug || 'project'}.md`,
      language: 'text',
      description: 'Project details managed through Sanity.',
      codeSnippet: summary,
    },
    keyInnovations: [],
    metrics: [
      {
        label: 'Managed in',
        value: 'Sanity',
        context: 'Published portfolio content',
      },
    ],
    techStack,
    githubUrl: project.githubUrl || '#',
    demoUrl: project.liveUrl,
    featured: Boolean(project.featured),
  };
};

export const loadProjects = async (): Promise<Transmission[]> => {
  if (!isSanityConfigured) return TRANSMISSIONS;

  const projects = await fetchProjects();
  if (!projects.length) return TRANSMISSIONS;

  return projects.map(projectToTransmission);
};

export const loadPosts = async (): Promise<Post[]> => {
  if (!isSanityConfigured) return [];
  return fetchPosts();
};

export const portableTextToPlainText = (blocks: PortableTextBlock[] = []) =>
  blocks
    .flatMap((block) => block.children || [])
    .map((child) => child.text || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
