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
  const specSnippet = project.specSnippet;

  return {
    id: project.manualOverrideKey || project.slug || project._id,
    transmissionNumber: String(index + 1).padStart(2, '0'),
    title: project.title,
    accentWord: project.primaryDomain || 'project system',
    tagline: project.tagline || '',
    period: project.period || 'CURRENT',
    status: project.status || 'ACTIVE',
    primaryDomain: project.primaryDomain || techStack[0] || 'AI/ML Engineering',
    summary,
    previewImage: project.coverImage ? cloudinaryUrl(project.coverImage) : undefined,
    originStory: project.originStory,
    architectureOverview: project.architectureOverview || summary,
    buildPhases: project.buildPhases?.map((phase) => ({
      phaseNumber: phase.phaseNumber || '',
      title: phase.title || 'Build phase',
      description: phase.description || '',
    })),
    topologyFlow: project.topologyFlow?.map((step) => ({
      stepNumber: step.stepNumber || '',
      name: step.name || 'Step',
      description: step.description || '',
    })) || [],
    designDecisions: project.designDecisions?.map((decision) => ({
      question: decision.question || 'Design decision',
      answer: decision.answer || '',
    })),
    specSnippet: {
      tabTitle: specSnippet?.tabTitle || 'PROJECT NOTES',
      fileName: specSnippet?.fileName || `${project.slug || 'project'}.md`,
      language: specSnippet?.language || 'text',
      description: specSnippet?.description || 'Project details managed through Sanity.',
      codeSnippet: specSnippet?.codeSnippet || summary,
    },
    keyInnovations: project.keyInnovations || [],
    metrics: project.metrics?.map((metric) => ({
      label: metric.label || 'Metric',
      value: metric.value || '',
      context: metric.context || '',
    })) || [],
    toonNotes: project.toonNotes,
    techStack,
    githubUrl: project.githubUrl || '#',
    demoUrl: project.liveUrl,
    featured: Boolean(project.featured),
  };
};

const mergeProjects = (cmsProjects: Project[]): Transmission[] => {
  const merged = [...TRANSMISSIONS];
  const manualIndexes = new Map(merged.map((project, index) => [project.id, index]));

  cmsProjects.forEach((project) => {
    const overrideIndex = project.manualOverrideKey
      ? manualIndexes.get(project.manualOverrideKey)
      : undefined;

    if (overrideIndex === undefined) {
      merged.push(projectToTransmission(project, merged.length));
      return;
    }

    merged[overrideIndex] = projectToTransmission(project, overrideIndex);
  });

  return merged.map((project, index) => ({
    ...project,
    transmissionNumber: String(index + 1).padStart(2, '0'),
  }));
};

export const loadProjects = async (): Promise<Transmission[]> => {
  if (!isSanityConfigured) return TRANSMISSIONS;

  const projects = await fetchProjects();
  if (!projects.length) return TRANSMISSIONS;

  return mergeProjects(projects);
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
