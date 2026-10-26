import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy } from 'lucide-react';
import { slugify } from '../../lib/blog/frontmatter';
import { soundFx } from '../../utils/audioHaptics';

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'code'>) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const isInline = !match && !codeString.includes('\n');

  if (isInline) {
    return (
      <code
        className="px-1.5 py-0.5 mx-0.5 rounded font-mono-tech text-[12px] dark:bg-white/[0.08] bg-[#4B4643]/10 dark:text-[#e8a598] text-[#74483F] border dark:border-white/[0.08] border-[#DCDEDD]"
        {...props}
      >
        {children}
      </code>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    soundFx.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-xl border dark:border-white/[0.08] border-[#DCDEDD] dark:bg-[#0c0808] bg-[#1a1413] text-[#f9f9fa] overflow-hidden shadow-lg group">
      <div className="flex items-center justify-between px-4 py-2 border-b dark:border-white/[0.08] border-white/[0.1] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 inline-block" />
          {language && (
            <span className="ml-2 font-mono-tech text-[11px] uppercase tracking-wider text-white/50">
              {language}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono-tech text-white/70 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto text-[13px] font-mono-tech leading-relaxed scrollbar-thin">
        <pre className="!bg-transparent !p-0 !m-0">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
}

function getNodeText(node: unknown): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (typeof node === 'object' && node !== null && 'props' in node) {
    return getNodeText((node as { props: { children?: unknown } }).props.children);
  }
  return '';
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-body max-w-none prose dark:prose-invert text-left">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          h2({ children, ...props }) {
            const text = getNodeText(children);
            const id = slugify(text);
            return (
              <h2
                id={id}
                className="scroll-mt-24 text-2xl sm:text-3xl font-bold dark:text-white text-[#1c1817] mt-10 mb-4 pb-2 border-b dark:border-white/[0.08] border-[#DCDEDD] flex items-center group"
                {...props}
              >
                <span>{children}</span>
                {id && (
                  <a
                    href={`#${id}`}
                    className="ml-2.5 opacity-0 group-hover:opacity-100 text-xs font-mono-tech dark:text-[#c68477] text-[#74483F] transition-opacity"
                    aria-label={`Direct link to ${text}`}
                  >
                    #
                  </a>
                )}
              </h2>
            );
          },
          h3({ children, ...props }) {
            const text = getNodeText(children);
            const id = slugify(text);
            return (
              <h3
                id={id}
                className="scroll-mt-24 text-xl sm:text-2xl font-semibold dark:text-white text-[#1c1817] mt-8 mb-3 flex items-center group"
                {...props}
              >
                <span>{children}</span>
                {id && (
                  <a
                    href={`#${id}`}
                    className="ml-2.5 opacity-0 group-hover:opacity-100 text-xs font-mono-tech dark:text-[#c68477] text-[#74483F] transition-opacity"
                    aria-label={`Direct link to ${text}`}
                  >
                    #
                  </a>
                )}
              </h3>
            );
          },
          p({ children, ...props }) {
            return (
              <p
                className="my-4 text-sm sm:text-base leading-relaxed dark:text-[#DCDEDD]/90 text-[#3a3533]"
                {...props}
              >
                {children}
              </p>
            );
          },
          ul({ children, ...props }) {
            return (
              <ul className="my-4 space-y-2.5 list-disc pl-5 dark:text-[#DCDEDD]/90 text-[#3a3533]" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }) {
            return (
              <ol className="my-4 space-y-2.5 list-decimal pl-5 dark:text-[#DCDEDD]/90 text-[#3a3533]" {...props}>
                {children}
              </ol>
            );
          },
          li({ children, ...props }) {
            return (
              <li className="text-sm sm:text-base leading-relaxed pl-1" {...props}>
                <div className="overflow-x-auto no-scrollbar max-w-full">
                  {children}
                </div>
              </li>
            );
          },
          table({ children, ...props }) {
            return (
              <div className="w-full my-6 overflow-x-auto rounded-xl border dark:border-white/[0.08] border-[#DCDEDD] shadow-sm bg-white dark:bg-[#0c0808]/70">
                <table className="w-full min-w-[600px] border-collapse text-left text-xs sm:text-sm" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          thead({ children, ...props }) {
            return (
              <thead
                className="border-b dark:border-white/[0.08] border-[#DCDEDD] bg-[#74483F]/10 dark:bg-white/[0.04] font-mono-tech uppercase text-[11px] tracking-wider dark:text-[#c68477] text-[#74483F]"
                {...props}
              >
                {children}
              </thead>
            );
          },
          th({ children, ...props }) {
            return (
              <th className="px-4 py-3 font-semibold whitespace-nowrap" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }) {
            return (
              <td
                className="px-4 py-3 border-b dark:border-white/[0.04] border-[#DCDEDD]/60 dark:text-[#DCDEDD]/85 text-[#3a3533] leading-normal"
                {...props}
              >
                {children}
              </td>
            );
          },
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="my-5 border-l-3 dark:border-[#c68477] border-[#74483F] pl-4 py-2.5 rounded-r-lg dark:bg-[#74483F]/10 bg-[#74483F]/5 text-xs sm:text-sm italic dark:text-[#DCDEDD] text-[#3a3533]"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          a({ children, href, ...props }) {
            return (
              <a
                href={href}
                className="font-medium dark:text-[#c68477] text-[#74483F] hover:underline underline-offset-4 decoration-[#74483F]/50 dark:decoration-[#c68477]/50 transition-colors"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
          code: CodeBlock,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
