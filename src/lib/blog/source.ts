import { parseFrontmatter } from './frontmatter';
import type {
  PostDetail,
  PostNavigationLink,
  PostSummary,
  SectionGroup,
  SeriesDetail,
  SeriesSummary,
} from './types';

/**
 * Lazy markdown module imports via Vite.
 * CRITICAL: Never eager-import. Files are fetched on-demand.
 */
const markdownModules = import.meta.glob('/src/content/blog/*/*/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

interface ParsedFileCache {
  summary: PostSummary;
  content: string;
  headings: PostDetail['headings'];
}

const fileCache = new Map<string, Promise<ParsedFileCache>>();

interface PathInfo {
  key: string;
  seriesSlug: string;
  sectionSlug: string;
  fileSlug: string;
  cleanSlug: string;
}

function parseModulePath(filePath: string): PathInfo | null {
  const normalized = filePath.replace(/\\/g, '/');
  const match = normalized.match(
    /\/src\/content\/blog\/([^/]+)\/([^/]+)\/([^/]+)\.md$/
  );
  if (!match) return null;

  const seriesSlug = match[1];
  const sectionSlug = match[2];
  const fileSlug = match[3];
  const cleanSlug = fileSlug.replace(/^\d+-/, '');

  return {
    key: filePath,
    seriesSlug,
    sectionSlug,
    fileSlug,
    cleanSlug,
  };
}

async function loadAndParseFile(info: PathInfo): Promise<ParsedFileCache> {
  const loader = markdownModules[info.key];
  if (!loader) {
    throw new Error(`Markdown file not found in registry: ${info.key}`);
  }

  const rawMarkdown = await loader();
  const parsed = parseFrontmatter(rawMarkdown);

  const summary: PostSummary = {
    slug: info.fileSlug,
    cleanSlug: info.cleanSlug,
    title: parsed.frontmatter.title,
    series: info.seriesSlug,
    seriesTitle: parsed.frontmatter.series,
    section: parsed.frontmatter.section || info.sectionSlug,
    sectionSlug: info.sectionSlug,
    order: parsed.frontmatter.order,
    description: parsed.frontmatter.description,
    tags: parsed.frontmatter.tags || [],
    readingTimeMinutes: parsed.readingTimeMinutes,
    filePath: info.key,
  };

  return {
    summary,
    content: parsed.content,
    headings: parsed.headings,
  };
}

function getOrLoadFile(info: PathInfo): Promise<ParsedFileCache> {
  const cached = fileCache.get(info.key);
  if (cached) return cached;

  const promise = loadAndParseFile(info);
  fileCache.set(info.key, promise);
  return promise;
}

function humanize(slug: string): string {
  if (slug === 'ml-foundations') {
    return 'Foundations of Machine Learning Mathematics';
  }
  if (slug === 'linear-algebra') {
    return 'Linear Algebra';
  }
  if (slug === 'calculus') {
    return 'Calculus';
  }
  if (slug === 'probability-and-statistics' || slug === 'probability-stats') {
    return 'Probability & Statistics';
  }
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const SERIES_METADATA: Record<string, { title: string; description: string }> = {
  'ml-foundations': {
    title: 'Foundations of Machine Learning Mathematics',
    description:
      'A collection of notes on the math and ideas behind machine learning from calculus, probability, and linear algebra.',
  },
};

/**
 * Returns all series summaries for the /blog overview.
 */
export async function getSeriesList(): Promise<SeriesSummary[]> {
  const paths = Object.keys(markdownModules)
    .map(parseModulePath)
    .filter((p): p is PathInfo => p !== null);

  const seriesMap = new Map<string, PathInfo[]>();
  for (const path of paths) {
    const list = seriesMap.get(path.seriesSlug) || [];
    list.push(path);
    seriesMap.set(path.seriesSlug, list);
  }

  const seriesList: SeriesSummary[] = [];

  for (const [seriesSlug, filePaths] of seriesMap.entries()) {
    // Lazily load the first file to get metadata about the series
    const firstFile = await getOrLoadFile(filePaths[0]);
    const seriesMeta = SERIES_METADATA[seriesSlug];
    const seriesTitle =
      seriesMeta?.title ||
      (firstFile.summary.seriesTitle && firstFile.summary.seriesTitle !== 'general'
        ? humanize(firstFile.summary.seriesTitle)
        : humanize(seriesSlug));

    const seriesDescription =
      seriesMeta?.description ||
      `Collection of ${filePaths.length} structured notes, derivations and engineering insights.`;

    const sections = new Set<string>();
    const allTags = new Set<string>();

    for (const fp of filePaths) {
      sections.add(fp.sectionSlug);
      // Try to read tags if file is already loaded
      const cached = fileCache.get(fp.key);
      if (cached) {
        const resolved = await cached;
        resolved.summary.tags.forEach((t) => allTags.add(t));
      }
    }

    firstFile.summary.tags.forEach((t) => allTags.add(t));

    seriesList.push({
      slug: seriesSlug,
      title: seriesTitle,
      description: seriesDescription,
      totalLessons: filePaths.length,
      sectionsCount: sections.size,
      tags: Array.from(allTags),
    });
  }

  return seriesList.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Returns detailed series with sections and ordered lessons for /blog/:series.
 */
export async function getSeries(seriesSlug: string): Promise<SeriesDetail | null> {
  const paths = Object.keys(markdownModules)
    .map(parseModulePath)
    .filter((p): p is PathInfo => p !== null && p.seriesSlug === seriesSlug);

  if (paths.length === 0) {
    return null;
  }

  // Load all posts for this series
  const loadedFiles = await Promise.all(paths.map((p) => getOrLoadFile(p)));
  const posts = loadedFiles.map((f) => f.summary);

  // Group by section
  const sectionMap = new Map<string, { name: string; slug: string; posts: PostSummary[] }>();

  for (const post of posts) {
    const sSlug = post.sectionSlug;
    if (!sectionMap.has(sSlug)) {
      sectionMap.set(sSlug, {
        slug: sSlug,
        name: humanize(sSlug),
        posts: [],
      });
    }
    sectionMap.get(sSlug)!.posts.push(post);
  }

  // Explicit priority order for the 3 sections:
  // 1: Linear Algebra, 2: Calculus, 3: Probability & Statistics
  const sectionPriority: Record<string, number> = {
    'linear-algebra': 1,
    'calculus': 2,
    'probability-and-statistics': 3,
  };

  // Sort posts in each section by order
  const sections: SectionGroup[] = Array.from(sectionMap.values()).map((section) => ({
    name: section.name,
    slug: section.slug,
    posts: section.posts.sort((a, b) => a.order - b.order),
  }));

  // Sort sections by priority
  sections.sort((a, b) => {
    const pA = sectionPriority[a.slug] ?? 99;
    const pB = sectionPriority[b.slug] ?? 99;
    return pA - pB;
  });

  const seriesMeta = SERIES_METADATA[seriesSlug];
  const seriesTitle = seriesMeta?.title || humanize(seriesSlug);
  const seriesDescription =
    seriesMeta?.description || `Structured curriculum and notes for ${seriesTitle}.`;

  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return {
    slug: seriesSlug,
    title: seriesTitle,
    description: seriesDescription,
    totalLessons: posts.length,
    sectionsCount: sections.length,
    sections,
    tags,
  };
}

/**
 * Returns a specific post with markdown content, prev/next navigation, and TOC headings.
 * Supports /blog/:series/:section/:slug (with or without numeric prefix in slug).
 */
export async function getPost(
  series: string,
  section: string,
  slug: string
): Promise<PostDetail | null> {
  const paths = Object.keys(markdownModules)
    .map(parseModulePath)
    .filter((p): p is PathInfo => p !== null && p.seriesSlug === series);

  if (paths.length === 0) return null;

  // Find target post
  const targetInfo = paths.find(
    (p) =>
      p.sectionSlug === section &&
      (p.fileSlug === slug || p.cleanSlug === slug)
  );

  if (!targetInfo) return null;

  // Load all posts in series to establish sequence for prev/next
  const seriesDetail = await getSeries(series);
  if (!seriesDetail) return null;

  const allOrderedPosts: PostSummary[] = [];
  for (const s of seriesDetail.sections) {
    allOrderedPosts.push(...s.posts);
  }

  const targetFile = await getOrLoadFile(targetInfo);
  const currentIndex = allOrderedPosts.findIndex(
    (p) =>
      p.sectionSlug === targetInfo.sectionSlug &&
      (p.slug === targetInfo.fileSlug || p.cleanSlug === targetInfo.cleanSlug)
  );

  let prevPost: PostNavigationLink | null = null;
  let nextPost: PostNavigationLink | null = null;

  if (currentIndex > 0) {
    const prev = allOrderedPosts[currentIndex - 1];
    prevPost = {
      title: prev.title,
      seriesSlug: prev.series,
      sectionSlug: prev.sectionSlug,
      slug: prev.slug,
      href: `/blog/${prev.series}/${prev.sectionSlug}/${prev.slug}`,
    };
  }

  if (currentIndex >= 0 && currentIndex < allOrderedPosts.length - 1) {
    const next = allOrderedPosts[currentIndex + 1];
    nextPost = {
      title: next.title,
      seriesSlug: next.series,
      sectionSlug: next.sectionSlug,
      slug: next.slug,
      href: `/blog/${next.series}/${next.sectionSlug}/${next.slug}`,
    };
  }

  return {
    ...targetFile.summary,
    content: targetFile.content,
    headings: targetFile.headings,
    prevPost,
    nextPost,
  };
}
