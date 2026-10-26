import React, { useEffect, useState } from 'react';
import type { PostHeading } from '../../lib/blog/types';
import { soundFx } from '../../utils/audioHaptics';
import { LineSidebar } from './LineSidebar';

interface BlogTableOfContentsProps {
  headings: PostHeading[];
}

export const BlogTableOfContents: React.FC<BlogTableOfContentsProps> = ({ headings }) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const foundIndex = headings.findIndex((h) => h.id === entry.target.id);
            if (foundIndex !== -1) {
              setActiveIdx(foundIndex);
            }
          }
        }
      },
      {
        rootMargin: '-80px 0% -60% 0%',
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const handleItemClick = (index: number) => {
    soundFx.playClick();
    const targetHeading = headings[index];
    if (targetHeading) {
      const el = document.getElementById(targetHeading.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', `#${targetHeading.id}`);
        setActiveIdx(index);
      }
    }
  };

  const labels = headings.map((h) => h.text);

  return (
    <div className="w-full text-left" aria-label="Table of contents">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b dark:border-white/[0.08] border-[#DCDEDD]">
        <span className="font-mono-tech text-[10px] uppercase tracking-[0.25em] font-bold dark:text-[#c68477] text-[#74483F]">
          ON THIS PAGE
        </span>
      </div>

      <LineSidebar
        items={labels}
        accentColor="#c68477"
        textColor="#8c827d"
        markerColor="#443c39"
        showIndex={false}
        showMarker={true}
        proximityRadius={90}
        maxShift={18}
        falloff="smooth"
        markerLength={24}
        markerGap={4}
        tickScale={0.5}
        scaleTick={true}
        itemGap={14}
        fontSize={0.82}
        smoothing={90}
        activeIndex={activeIdx}
        onItemClick={handleItemClick}
      />
    </div>
  );
};
