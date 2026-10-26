import type { PostFrontmatter, PostHeading } from './types';

export interface ParsedMarkdown {
  frontmatter: PostFrontmatter;
  content: string;
  readingTimeMinutes: number;
  headings: PostHeading[];
}

/**
 * 100% browser-safe YAML frontmatter parser.
 * Requires zero Node.js dependencies (no Buffer, no fs, no process).
 */
export function parseFrontmatter(rawMarkdown: string): ParsedMarkdown {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawMarkdown.match(frontmatterRegex);

  let rawFrontmatter = '';
  let content = rawMarkdown;

  if (match) {
    rawFrontmatter = match[1];
    content = match[2];
  }

  const frontmatter: Partial<PostFrontmatter> = {};
  const lines = rawFrontmatter.split(/\r?\n/);
  let currentKey = '';
  let inList = false;
  let listValues: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Check for list item under currentKey
    if (inList && trimmed.startsWith('-')) {
      const val = trimmed.replace(/^-\s*/, '').replace(/^['"](.*)['"]$/, '$1').trim();
      if (val) listValues.push(val);
      continue;
    }

    // Flush previous list
    if (inList && currentKey) {
      (frontmatter as Record<string, unknown>)[currentKey] = listValues;
      inList = false;
      listValues = [];
    }

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let val = trimmed.slice(colonIdx + 1).trim();

    // Check if this starts a multiline list
    if (val === '' || val === '[]') {
      currentKey = key;
      inList = true;
      listValues = [];
      continue;
    }

    // Parse array like ["tag1", "tag2"] or [tag1, tag2]
    if (val.startsWith('[') && val.endsWith(']')) {
      try {
        const parsed = JSON.parse(val);
        (frontmatter as Record<string, unknown>)[key] = Array.isArray(parsed)
          ? parsed.map(String)
          : [];
      } catch {
        const rawItems = val
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^['"](.*)['"]$/, '$1'))
          .filter(Boolean);
        (frontmatter as Record<string, unknown>)[key] = rawItems;
      }
      continue;
    }

    // Strip quotes
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    // Number conversion
    if (/^-?\d+(\.\d+)?$/.test(val)) {
      (frontmatter as Record<string, unknown>)[key] = Number(val);
    } else if (val === 'true') {
      (frontmatter as Record<string, unknown>)[key] = true;
    } else if (val === 'false') {
      (frontmatter as Record<string, unknown>)[key] = false;
    } else {
      (frontmatter as Record<string, unknown>)[key] = val;
    }
  }

  if (inList && currentKey) {
    (frontmatter as Record<string, unknown>)[currentKey] = listValues;
  }

  // Calculate reading time
  const plainText = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`.*?`/g, ' ')
    .replace(/[#*_[\]()~>]/g, ' ')
    .trim();
  const words = plainText ? plainText.split(/\s+/).length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  // Extract headings for Table of Contents
  const headings = extractHeadings(content);

  return {
    frontmatter: {
      title: frontmatter.title || 'Untitled Note',
      series: frontmatter.series || 'general',
      section: frontmatter.section || 'General',
      order: typeof frontmatter.order === 'number' ? frontmatter.order : 1,
      description: frontmatter.description || '',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    },
    content,
    readingTimeMinutes,
    headings,
  };
}

/**
 * Extracts h2 and h3 markdown headings for Table of Contents.
 */
export function extractHeadings(markdown: string): PostHeading[] {
  const headings: PostHeading[] = [];
  const lines = markdown.split(/\r?\n/);
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2]
        .replace(/\*\*|__|[*_`]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim();
      const id = slugify(rawText);
      if (id) {
        headings.push({ id, text: rawText, level });
      }
    }
  }

  return headings;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
