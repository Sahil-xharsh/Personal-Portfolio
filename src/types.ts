export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'TRANSMITTING';

export interface TopologyStep {
  stepNumber: string;
  name: string;
  description: string;
}

export interface ProjectSpec {
  tabTitle: string;
  fileName: string;
  language: string;
  codeSnippet: string;
  description: string;
}

export interface BuildPhase {
  phaseNumber: string;
  title: string;
  description: string;
}

export interface DesignDecision {
  question: string;
  answer: string;
}

export interface Transmission {
  id: string;
  transmissionNumber: string;
  title: string;
  accentWord: string;
  tagline: string;
  period: string;
  status: ProjectStatus;
  primaryDomain: string;
  summary: string;
  previewImage?: string;
  originStory?: string;
  architectureOverview: string;
  buildPhases?: BuildPhase[];
  topologyFlow: TopologyStep[];
  designDecisions?: DesignDecision[];
  specSnippet: ProjectSpec;
  keyInnovations: string[];
  techStack: string[];
  metrics: {
    label: string;
    value: string;
    context: string;
  }[];
  toonNotes?: string;
  githubUrl: string;
  demoUrl?: string;
  featured: boolean;
}

export interface CareerMilestone {
  era: string;
  role: string;
  domain: string;
  organization: string;
  summary: string;
  keyDifferentiators: string[];
  technologies: string[];
}

export interface TechItem {
  name: string;
  proficiency: 'Advanced' | 'Core' | 'Active Research';
  context: string;
  tag: string;
}

export interface TechGroup {
  id: string;
  code: string;
  title: string;
  description: string;
  skills: TechItem[];
}
