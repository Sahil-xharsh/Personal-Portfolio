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
  description?: string;
  coverImage?: string;
  gallery?: string[];
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  order: number;
};

