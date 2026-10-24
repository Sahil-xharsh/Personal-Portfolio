export type PortableTextChild = {
  _key?: string;
  _type?: string;
  text?: string;
  marks?: string[];
};

export type PortableTextBlock = {
  _key: string;
  _type: 'block' | string;
  style?: string;
  children?: PortableTextChild[];
  markDefs?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

export type Post = {
  _id: string;
  _createdAt?: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  mainImage?: string;
  body: PortableTextBlock[];
  tags?: string[];
  seoDescription?: string;
};

export type Project = {
  _id: string;
  _createdAt?: string;
  title: string;
  slug: string;
  manualOverrideKey?: string;
  tagline?: string;
  period?: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'TRANSMITTING';
  primaryDomain?: string;
  description?: string;
  coverImage?: string;
  gallery?: string[];
  originStory?: string;
  architectureOverview?: string;
  buildPhases?: Array<{
    phaseNumber?: string;
    title?: string;
    description?: string;
  }>;
  topologyFlow?: Array<{
    stepNumber?: string;
    name?: string;
    description?: string;
  }>;
  designDecisions?: Array<{
    question?: string;
    answer?: string;
  }>;
  specSnippet?: {
    tabTitle?: string;
    fileName?: string;
    language?: string;
    description?: string;
    codeSnippet?: string;
  };
  keyInnovations?: string[];
  metrics?: Array<{
    label?: string;
    value?: string;
    context?: string;
  }>;
  toonNotes?: string;
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  order: number;
};

