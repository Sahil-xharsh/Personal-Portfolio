export interface PostFrontmatter {
  title: string;
  series: string;
  section: string;
  order: number;
  description: string;
  tags?: string[];
}

export interface PostSummary {
  slug: string;
  cleanSlug: string;
  title: string;
  series: string;
  seriesTitle?: string;
  section: string;
  sectionSlug: string;
  order: number;
  description: string;
  tags: string[];
  readingTimeMinutes: number;
  filePath: string;
}

export interface PostHeading {
  id: string;
  text: string;
  level: number;
}

export interface PostNavigationLink {
  title: string;
  seriesSlug: string;
  sectionSlug: string;
  slug: string;
  href: string;
}

export interface PostDetail extends PostSummary {
  content: string;
  prevPost?: PostNavigationLink | null;
  nextPost?: PostNavigationLink | null;
  headings: PostHeading[];
}

export interface SectionGroup {
  name: string;
  slug: string;
  posts: PostSummary[];
}

export interface SeriesDetail {
  slug: string;
  title: string;
  description: string;
  totalLessons: number;
  sectionsCount: number;
  sections: SectionGroup[];
  tags: string[];
}

export interface SeriesSummary {
  slug: string;
  title: string;
  description: string;
  totalLessons: number;
  sectionsCount: number;
  tags: string[];
}
