import React from 'react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { Post } from '../types/content';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
    h2: ({ children }) => <h2 className="mt-8 mb-3 text-2xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 mb-2 text-xl font-semibold">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-5 border-l-2 border-[#74483F] pl-4 italic opacity-80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-4 ml-5 list-disc space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="mb-4 ml-5 list-decimal space-y-1">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.openInNewTab ? '_blank' : undefined}
        rel={value?.openInNewTab ? 'noopener noreferrer' : undefined}
        className="text-[#74483F] underline decoration-[#c68477]/50 underline-offset-2 dark:text-[#c68477]"
      >
        {children}
      </a>
    ),
  },
  types: {
    code: ({ value }) => (
      <pre className="my-5 overflow-x-auto rounded-lg border border-[#74483F]/30 bg-black/60 p-4 text-left">
        <code className="font-mono-tech text-xs leading-6">{value?.code || ''}</code>
      </pre>
    ),
  },
};

export const PortablePostBody: React.FC<{ post: Post }> = ({ post }) => (
  <div className="text-left text-sm dark:text-[#DCDEDD]/90 text-[#4B4643]">
    {post.body?.length ? (
      <PortableText value={post.body as never} components={components} />
    ) : (
      <p>No article content is available yet.</p>
    )}
  </div>
);
