import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Layers, ArrowRight, Sparkles, Search } from 'lucide-react';
import { getSeriesList } from '../../lib/blog/source';
import type { SeriesSummary } from '../../lib/blog/types';
import { useRouter } from '../../context/RouterContext';
import { soundFx } from '../../utils/audioHaptics';

export const BlogSeriesList: React.FC = () => {
  const { navigate, navigateToSection } = useRouter();
  const [seriesList, setSeriesList] = useState<SeriesSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    getSeriesList()
      .then((data) => {
        if (mounted) {
          setSeriesList(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load series list', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredSeries = seriesList.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b dark:border-white/[0.08] border-[#DCDEDD]">
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            navigateToSection('hero');
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono-tech dark:text-[#DCDEDD] text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] dark:bg-white/[0.03] bg-[#4B4643]/5 hover:bg-[#74483F]/10 border dark:border-white/[0.06] border-[#DCDEDD] hover:border-[#74483F]/40 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 dark:text-[#c68477] text-[#74483F] group-hover:-translate-x-0.5 transition-transform" />
          <span>RETURN TO PORTFOLIO</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono-tech dark:text-[#c68477] text-[#74483F]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TECHNICAL CURRICULUM</span>
        </div>
      </div>

      {/* Hero Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="font-mono-tech text-xs dark:text-[#c68477] text-[#74483F] tracking-[0.25em] uppercase font-semibold">
            WRITING &amp; RESEARCH NOTES
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r dark:from-[#74483F]/40 from-[#74483F]/30 dark:via-white/[0.1] via-[#DCDEDD] to-transparent" />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white text-[#1c1817] tracking-tight leading-tight">
          Technical Notes, Guides &amp; <span className="font-serif-accent dark:text-[#c68477] text-[#74483F] font-normal text-4xl sm:text-5xl">Blogs</span>
        </h1>
        <p className="text-sm sm:text-base dark:text-[#DCDEDD]/80 text-[#4B4643] max-w-2xl font-light leading-relaxed">
          Blogs and notes on what I'm learning with guides to the concepts that helped me understand things better.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74483F] dark:text-[#c68477]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter series by topic, keyword, or tag..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans dark:bg-[#120e0d] bg-white border dark:border-white/[0.1] border-[#DCDEDD] dark:text-white text-[#1c1817] placeholder-[#4B4643]/60 dark:placeholder-[#DCDEDD]/40 focus:outline-none focus:border-[#74483F] dark:focus:border-[#c68477] transition-colors shadow-sm"
        />
      </div>

      {/* Series Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl dark:bg-white/[0.03] bg-[#4B4643]/5 border dark:border-white/[0.08] border-[#DCDEDD] animate-pulse"
            />
          ))}
        </div>
      ) : filteredSeries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl dark:bg-[#120e0d] bg-white border dark:border-white/[0.08] border-[#DCDEDD] space-y-3">
          <BookOpen className="w-8 h-8 mx-auto dark:text-[#c68477] text-[#74483F] opacity-60" />
          <h3 className="text-base font-semibold dark:text-white text-[#1c1817]">No series found</h3>
          <p className="text-xs text-[#4B4643] dark:text-[#DCDEDD]/70">
            No notes match your filter query. Try searching for a different keyword.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {filteredSeries.map((series) => (
            <article
              key={series.slug}
              onClick={() => {
                soundFx.playClick();
                navigate(`/blog/${series.slug}`);
              }}
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl dark:bg-[#120e0d]/90 bg-white border dark:border-white/[0.08] border-[#DCDEDD] hover:dark:border-[#c68477]/50 hover:border-[#74483F]/50 transition-all duration-300 shadow-sm hover:shadow-[0_10px_30px_rgba(116,72,63,0.15)] cursor-pointer overflow-hidden"
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br dark:from-[#74483F]/15 dark:to-transparent from-[#74483F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg dark:bg-[#74483F]/20 bg-[#74483F]/10 border dark:border-[#74483F]/40 border-[#74483F]/20 dark:text-[#c68477] text-[#74483F]">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <span className="font-mono-tech text-[11px] uppercase tracking-wider dark:text-[#c68477] text-[#74483F] font-semibold">
                      SERIES TRACK
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono-tech text-[11px] dark:text-[#DCDEDD]/60 text-[#4B4643]/70">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      {series.sectionsCount} Sections
                    </span>
                    <span>•</span>
                    <span>{series.totalLessons} Lessons</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold dark:text-white text-[#1c1817] group-hover:dark:text-[#e8a598] group-hover:text-[#74483F] transition-colors tracking-tight">
                    {series.title}
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed dark:text-[#DCDEDD]/75 text-[#4B4643] line-clamp-3 font-light">
                    {series.description}
                  </p>
                </div>

                {series.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {series.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md font-mono-tech text-[10px] dark:bg-white/[0.04] bg-[#4B4643]/5 border dark:border-white/[0.06] border-[#DCDEDD] dark:text-[#DCDEDD]/80 text-[#4B4643]"
                      >
                        {tag}
                      </span>
                    ))}
                    {series.tags.length > 4 && (
                      <span className="px-1.5 py-0.5 font-mono-tech text-[10px] dark:text-[#c68477] text-[#74483F]">
                        +{series.tags.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="relative pt-6 mt-4 border-t dark:border-white/[0.06] border-[#DCDEDD] flex items-center justify-between text-xs font-mono-tech font-semibold dark:text-[#c68477] text-[#74483F]">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
