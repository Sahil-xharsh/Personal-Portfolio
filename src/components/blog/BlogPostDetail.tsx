import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Menu,
  X,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Layers,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { getPost, getSeries } from '../../lib/blog/source';
import type { PostDetail, SeriesDetail } from '../../lib/blog/types';
import { useRouter } from '../../context/RouterContext';
import { MarkdownRenderer } from './MarkdownRenderer';
import { BlogTableOfContents } from './BlogTableOfContents';
import { soundFx } from '../../utils/audioHaptics';

import BranchedMenu from './BranchedMenu';

interface BlogPostDetailProps {
  seriesSlug: string;
  sectionSlug: string;
  postSlug: string;
}

export const BlogPostDetail: React.FC<BlogPostDetailProps> = ({
  seriesSlug,
  sectionSlug,
  postSlug,
}) => {
  const { navigate } = useRouter();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [series, setSeries] = useState<SeriesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 240);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      getPost(seriesSlug, sectionSlug, postSlug),
      getSeries(seriesSlug),
    ])
      .then(([postData, seriesData]) => {
        if (!mounted) return;
        setPost(postData);
        setSeries(seriesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load post detail', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [seriesSlug, sectionSlug, postSlug]);

  const handleShareLink = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto w-full py-8 space-y-6">
        <div className="h-6 w-48 rounded bg-white/[0.04] animate-pulse" />
        <div className="h-12 w-3/4 rounded bg-white/[0.04] animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-white/[0.03] animate-pulse" />
        <div className="space-y-4 pt-8">
          <div className="h-40 rounded-xl bg-white/[0.03] animate-pulse" />
          <div className="h-40 rounded-xl bg-white/[0.03] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center rounded-2xl dark:bg-[#120e0d] bg-white border dark:border-white/[0.08] border-[#DCDEDD] space-y-4">
        <BookOpen className="w-10 h-10 mx-auto dark:text-[#c68477] text-[#74483F] opacity-60" />
        <h2 className="text-xl font-bold dark:text-white text-[#1c1817]">Note Not Found</h2>
        <p className="text-xs text-[#4B4643] dark:text-[#DCDEDD]/70">
          The requested note "{postSlug}" in section "{sectionSlug}" does not exist.
        </p>
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            navigate(`/blog/${seriesSlug}`);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono-tech dark:bg-[#74483F]/20 bg-[#74483F]/10 dark:text-[#c68477] text-[#74483F] border dark:border-[#74483F]/40 border-[#74483F]/30 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO SERIES</span>
        </button>
      </div>
    );
  }

  const renderSidebarTree = (isMobile = false) => {
    if (!series) return null;

    const branchedItems = series.sections.map((sec) => ({
      label: sec.name,
      children: sec.posts.map((lesson) => ({
        value: `/blog/${series.slug}/${sec.slug}/${lesson.slug}`,
        label: lesson.title,
      })),
    }));

    const currentPostValue = `/blog/${series.slug}/${sectionSlug}/${postSlug}`;

    return (
      <div className="space-y-3 text-left">
        <div className="flex items-center justify-between pb-2 border-b dark:border-white/[0.08] border-[#DCDEDD]">
          <h3 className="text-sm font-bold dark:text-white text-[#1c1817] line-clamp-1">
            {series.title}
          </h3>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              if (isMobile) setMobileDrawerOpen(false);
              navigate(`/blog/${series.slug}`);
            }}
            title="View all sections"
            className="p-1 rounded hover:dark:bg-white/[0.05] hover:bg-[#74483F]/10 text-xs font-mono-tech dark:text-[#c68477] text-[#74483F] cursor-pointer"
          >
            All
          </button>
        </div>

        <div className="pt-1 max-h-[calc(100vh-220px)] overflow-y-auto no-scrollbar">
          <BranchedMenu
            items={branchedItems}
            defaultOpen={-1}
            defaultActive={currentPostValue}
            color="var(--blog-tree-ink)"
            accentColor="var(--blog-tree-accent)"
            lineColor="var(--blog-tree-line)"
            width={240}
            rowHeight={34}
            indent={32}
            trunk={12}
            radius={8}
            lineWidth={1.5}
            fontSize={13}
            onSelect={(value) => {
              soundFx.playClick();
              if (isMobile) setMobileDrawerOpen(false);
              navigate(value);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto text-left relative">
      {/* Top Breadcrumb & Mobile Bar */}
      <div className="flex items-center justify-between gap-3 pb-4 mb-6 border-b dark:border-white/[0.08] border-[#DCDEDD]">
        <div className="flex items-center gap-2 text-xs font-mono-tech overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              navigate('/blog');
            }}
            className="dark:text-[#DCDEDD]/70 text-[#4B4643] hover:dark:text-white hover:text-[#1c1817] shrink-0"
          >
            Blog
          </button>
          <span className="opacity-40">/</span>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              navigate(`/blog/${seriesSlug}`);
            }}
            className="dark:text-[#DCDEDD]/70 text-[#4B4643] hover:dark:text-white hover:text-[#1c1817] shrink-0"
          >
            {series?.title || seriesSlug}
          </button>
          <span className="opacity-40">/</span>
          <span className="dark:text-[#c68477] text-[#74483F] font-semibold truncate max-w-[200px] sm:max-w-sm">
            {post.title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleShareLink}
            aria-label="Share note link"
            className="p-1.5 rounded-lg text-xs font-mono-tech dark:text-[#DCDEDD] text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] dark:bg-white/[0.03] bg-[#4B4643]/5 border dark:border-white/[0.06] border-[#DCDEDD] transition-colors cursor-pointer"
            title="Copy direct URL to note"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile Drawer Trigger Button */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setMobileDrawerOpen(true);
            }}
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono-tech dark:bg-[#74483F]/20 bg-[#74483F]/10 dark:text-[#c68477] text-[#74483F] border dark:border-[#74483F]/40 border-[#74483F]/30 cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>Lessons</span>
          </button>
        </div>
      </div>

      {/* 3-Column Layout: Left Sidebar + Center Article + Right TOC */}
      <div className="relative">
        {/* Left Sidebar Navigation (Google Docs tabs style) */}
        <aside className="hidden xl:block absolute xl:-left-10 2xl:-left-24 top-0 w-64 xl:w-72 rounded-2xl dark:bg-[#120e0d]/90 bg-white border dark:border-white/[0.08] border-[#DCDEDD] p-4 shadow-sm">
          {renderSidebarTree(false)}
        </aside>

        {/* Center Main Article */}
        <main className="mx-auto w-full max-w-3xl space-y-8">
          {/* Article Header */}
          <header className="space-y-4 pb-6 border-b dark:border-white/[0.08] border-[#DCDEDD]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 font-mono-tech text-xs dark:text-[#c68477] text-[#74483F] font-semibold dark:bg-[#74483F]/15 bg-[#74483F]/10 px-2.5 py-1 rounded-md border dark:border-[#74483F]/35 border-[#74483F]/25">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTimeMinutes} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white text-[#1c1817] tracking-tight leading-tight">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-base sm:text-lg dark:text-[#DCDEDD]/85 text-[#4B4643] font-light leading-relaxed">
                {post.description}
              </p>
            )}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono-tech text-[10px] px-2 py-0.5 rounded-md dark:bg-white/[0.04] bg-[#4B4643]/5 border dark:border-white/[0.06] border-[#DCDEDD] dark:text-[#DCDEDD]/80 text-[#4B4643]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Mobile In-line TOC */}
          {post.headings.length > 0 && (
            <div className="lg:hidden p-4 rounded-xl dark:bg-[#120e0d] bg-white border dark:border-white/[0.08] border-[#DCDEDD]">
              <BlogTableOfContents headings={post.headings} />
            </div>
          )}

          {/* Article Markdown Body */}
          <article className="pt-2">
            <MarkdownRenderer content={post.content} />
          </article>

          {/* Prev / Next Lesson Navigation Cards */}
          <nav
            aria-label="Previous and Next lesson navigation"
            className="pt-10 border-t dark:border-white/[0.08] border-[#DCDEDD] grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {post.prevPost ? (
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  navigate(post.prevPost!.href);
                }}
                className="group p-4 rounded-xl text-left border dark:border-white/[0.08] border-[#DCDEDD] dark:bg-[#120e0d] bg-white hover:dark:border-[#c68477]/50 hover:border-[#74483F]/50 transition-all cursor-pointer shadow-sm space-y-1"
              >
                <div className="flex items-center gap-1 font-mono-tech text-[10px] dark:text-[#c68477] text-[#74483F] font-semibold">
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span>PREVIOUS LESSON</span>
                </div>
                <div className="text-sm font-semibold dark:text-white text-[#1c1817] line-clamp-2">
                  {post.prevPost.title}
                </div>
              </button>
            ) : (
              <div />
            )}

            {post.nextPost ? (
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  navigate(post.nextPost!.href);
                }}
                className="group p-4 rounded-xl text-right sm:text-right border dark:border-white/[0.08] border-[#DCDEDD] dark:bg-[#120e0d] bg-white hover:dark:border-[#c68477]/50 hover:border-[#74483F]/50 transition-all cursor-pointer shadow-sm space-y-1 sm:ml-auto w-full"
              >
                <div className="flex items-center justify-end gap-1 font-mono-tech text-[10px] dark:text-[#c68477] text-[#74483F] font-semibold">
                  <span>NEXT LESSON</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-sm font-semibold dark:text-white text-[#1c1817] line-clamp-2">
                  {post.nextPost.title}
                </div>
              </button>
            ) : (
              <div />
            )}
          </nav>
        </main>

      </div>

      {post.headings.length > 0 && (
        <aside className="hidden xl:block fixed right-[-3px] top-0 bottom-6 z-30 w-72 xl:w-80 overflow-y-auto no-scrollbar border-l dark:border-white/[0.08] border-[#DCDEDD] pl-6 pr-6 pt-[11rem]">
          <BlogTableOfContents headings={post.headings} />
        </aside>
      )}

      {showBackToTop && (
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full dark:bg-[#120e0d]/95 bg-white/95 dark:text-[#c68477] text-[#74483F] border dark:border-white/[0.12] border-[#DCDEDD] shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(116,72,63,0.3)] cursor-pointer"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {/* Mobile Drawer (Slide-over) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full dark:bg-[#0c0808] bg-white border-r dark:border-white/[0.1] border-[#DCDEDD] p-5 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b dark:border-white/[0.08] border-[#DCDEDD]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 dark:text-[#c68477] text-[#74483F]" />
                  <span className="font-mono-tech text-xs font-semibold dark:text-white text-[#1c1817]">
                    Curriculum Navigation
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-md text-[#4B4643] dark:text-[#DCDEDD] hover:dark:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {renderSidebarTree(true)}
            </div>

            <div className="pt-6 border-t dark:border-white/[0.08] border-[#DCDEDD] mt-6">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setMobileDrawerOpen(false);
                  navigate('/blog');
                }}
                className="w-full py-2 px-3 rounded-lg text-xs font-mono-tech dark:bg-white/[0.04] bg-[#4B4643]/5 text-center dark:text-[#DCDEDD] text-[#4B4643] border dark:border-white/[0.08] border-[#DCDEDD]"
              >
                ← All Series Tracks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
