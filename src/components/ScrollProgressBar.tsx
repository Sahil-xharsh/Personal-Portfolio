import React, { useEffect, useRef } from 'react';

interface ScrollProgressBarProps {
  activePage?: 'home' | 'blog';
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ activePage = 'home' }) => {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const totalScrollableDistance = scrollHeight - clientHeight;

      if (!barRef.current) return;

      if (totalScrollableDistance <= 0) {
        barRef.current.style.transform = 'scaleX(0)';
        return;
      }

      const ratio = Math.min(Math.max(scrollY / totalScrollableDistance, 0), 1);
      barRef.current.style.transform = `scaleX(${ratio})`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    updateScrollProgress();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [activePage]);

  return (
    <div
      id="viewport-scroll-progress-container"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] w-full pointer-events-none dark:bg-white/[0.03] bg-[#4B4643]/10"
      role="progressbar"
      aria-label="Page scroll progress"
    >
      <div
        ref={barRef}
        id="viewport-scroll-progress-fill"
        className="h-full w-full origin-left bg-gradient-to-r from-[#4B4643] via-[#74483F] to-[#c68477] shadow-[0_0_12px_rgba(116,72,63,0.85),0_0_4px_rgba(220,222,221,0.95)] rounded-r-full"
        style={{
          transform: 'scaleX(0)',
          transformOrigin: '0% 50%',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
