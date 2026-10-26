import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Clock,
  Layers,
  FileText,
  ArrowRight,
  Tag,
} from 'lucide-react';
import { getSeries } from '../../lib/blog/source';
import type { SeriesDetail } from '../../lib/blog/types';
import { useRouter } from '../../context/RouterContext';
import { soundFx } from '../../utils/audioHaptics';

interface BlogSeriesDetailProps {
  seriesSlug: string;
}

export const BlogSeriesDetail: React.FC<BlogSeriesDetailProps> = ({ seriesSlug }) => {
  const { navigate } = useRouter();
  const [series, setSeries] = useState<SeriesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getSeries(seriesSlug)
      .then((data) => {
        if (!mounted) return;
        setSeries(data);
        if (data) {
          // Sections start collapsed by default
          setOpenSections({});
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load series', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [seriesSlug]);

  const toggleSection = (slug: string) => {
    soundFx.playClick();
    setOpenSections((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto w-full space-y-6 pt-2">
        <div className="h-6 w-32 rounded bg-white/[0.04] animate-pulse" />
        <div className="h-12 w-3/4 rounded bg-white/[0.04] animate-pulse" />
        <div className="space-y-4 pt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center rounded-2xl dark:bg-[#120e0d] bg-white border dark:border-white/[0.08] border-[#DCDEDD] space-y-4">
        <BookOpen className="w-10 h-10 mx-auto dark:text-[#c68477] text-[#74483F] opacity-60" />
        <h2 className="text-xl font-bold dark:text-white text-[#1c1817]">Series Not Found</h2>
        <p className="text-xs text-[#4B4643] dark:text-[#DCDEDD]/70">
          The requested series "{seriesSlug}" could not be found.
        </p>
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            navigate('/blog');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono-tech dark:bg-[#74483F]/20 bg-[#74483F]/10 dark:text-[#c68477] text-[#74483F] border dark:border-[#74483F]/40 border-[#74483F]/30 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO ALL SERIES</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto w-full">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b dark:border-white/[0.08] border-[#DCDEDD]">
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            navigate('/blog');
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-tech dark:text-[#DCDEDD] text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] dark:bg-white/[0.03] bg-[#4B4643]/5 hover:bg-[#74483F]/10 border dark:border-white/[0.06] border-[#DCDEDD] hover:border-[#74483F]/40 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F] group-hover:-translate-x-0.5 transition-transform" />
          <span>ALL SERIES</span>
        </button>

        <div className="flex items-center gap-3 font-mono-tech text-[11px] dark:text-[#DCDEDD]/60 text-[#4B4643]/70">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            {series.sectionsCount} Sections
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {series.totalLessons} Lessons
          </span>
        </div>
      </div>

      {/* Series Header */}
      <div className="space-y-3.5">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white text-[#1c1817] tracking-tight leading-tight">
          {series.title}
        </h1>

        <p className="text-sm sm:text-base dark:text-[#DCDEDD]/80 text-[#4B4643] font-light leading-relaxed max-w-3xl">
          {series.description}
        </p>

        {series.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Tag className="w-3 h-3 dark:text-[#c68477] text-[#74483F] mr-1" />
            {series.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded font-mono-tech text-[10px] dark:bg-white/[0.04] bg-[#4B4643]/5 border dark:border-white/[0.06] border-[#DCDEDD] dark:text-[#DCDEDD]/80 text-[#4B4643]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Collapsible Section Groups */}
      <div className="space-y-5 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono-tech uppercase tracking-[0.2em] font-semibold dark:text-[#c68477] text-[#74483F]">
            Sections &amp; Lessons
          </h2>
        </div>

        {series.sections.map((section, sectionIdx) => {
          const isOpen = !!openSections[section.slug];

          return (
            <div
              key={section.slug}
              className="rounded-2xl border dark:border-white/[0.08] border-[#DCDEDD] dark:bg-[#120e0d] bg-white overflow-hidden shadow-sm transition-all"
            >
              {/* Section Header Accordion Trigger */}
              <button
                type="button"
                onClick={() => toggleSection(section.slug)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer hover:dark:bg-white/[0.02] hover:bg-[#4B4643]/5 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg dark:bg-white/[0.04] bg-[#4B4643]/10 font-mono-tech text-xs font-semibold dark:text-[#c68477] text-[#74483F]">
                    {String(sectionIdx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold dark:text-white text-[#1c1817]">
                      {section.name}
                    </h3>
                    <p className="text-[11px] font-mono-tech dark:text-[#DCDEDD]/60 text-[#4B4643]/70">
                      {section.posts.length} {section.posts.length === 1 ? 'lesson' : 'lessons'}
                    </p>
                  </div>
                </div>

                <div className="p-1 rounded-lg dark:bg-white/[0.04] bg-[#4B4643]/10 dark:text-[#DCDEDD] text-[#4B4643]">
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Collapsible Content */}
              {isOpen && (
                <div className="border-t dark:border-white/[0.06] border-[#DCDEDD] divide-y dark:divide-white/[0.04] divide-[#DCDEDD]/60">
                  {section.posts.map((post) => (
                    <article
                      key={post.slug}
                      onClick={() => {
                        soundFx.playClick();
                        navigate(`/blog/${series.slug}/${section.slug}/${post.slug}`);
                      }}
                      className="group p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:dark:bg-white/[0.02] hover:bg-[#74483F]/5 transition-colors cursor-pointer"
                    >
                      <div className="space-y-1.5 flex-1 pr-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded dark:bg-[#74483F]/20 bg-[#74483F]/10 dark:text-[#c68477] text-[#74483F] font-semibold">
                            PART {String(post.order).padStart(2, '0')}
                          </span>
                          <span className="flex items-center gap-1 font-mono-tech text-[10px] dark:text-[#DCDEDD]/60 text-[#4B4643]/70">
                            <Clock className="w-3 h-3" />
                            {post.readingTimeMinutes} min read
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-semibold dark:text-white text-[#1c1817] group-hover:dark:text-[#e8a598] group-hover:text-[#74483F] transition-colors">
                          {post.title}
                        </h4>

                        {post.description && (
                          <p className="text-xs dark:text-[#DCDEDD]/75 text-[#4B4643] line-clamp-2 font-light">
                            {post.description}
                          </p>
                        )}

                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="font-mono-tech text-[9px] px-1.5 py-0.5 rounded dark:bg-white/[0.03] bg-[#4B4643]/5 dark:text-[#DCDEDD]/70 text-[#4B4643]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-mono-tech font-semibold dark:text-[#c68477] text-[#74483F] shrink-0 self-end sm:self-center">
                        <span className="hidden sm:inline">READ NOTE</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
