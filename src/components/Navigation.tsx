import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { soundFx } from '../utils/audioHaptics';

interface NavigationProps {
  activePage: 'home' | 'blog';
  onNavigatePage: (page: 'home' | 'blog', sectionId?: string) => void;
  onOpenResume?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activePage,
  onNavigatePage,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const isClickNavigating = useRef(false);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme, toggleTheme } = useTheme();

  const updateScrollState = useCallback(() => {
    const scrollY = window.scrollY;
    setScrolled(scrollY > 20);

    if (activePage !== 'home' || isClickNavigating.current) return;

    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (windowHeight + scrollY >= docHeight - 80) {
      setActiveSection('contact');
      return;
    }

    const focalPoint = scrollY + 200;
    const sectionIds = ['hero', 'about', 'projects', 'skills', 'contact'];
    let activeId = 'hero';

    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (section) {
        if (focalPoint >= section.offsetTop) {
          activeId = id;
        }
      }
    }

    setActiveSection(activeId);
  }, [activePage]);

  useEffect(() => {
    let ticking = false;
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      if (isClickNavigating.current) {
        if (scrollEndTimer) clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
          isClickNavigating.current = false;
          updateScrollState();
        }, 150);
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };

    const onUserInterrupt = () => {
      if (isClickNavigating.current) {
        isClickNavigating.current = false;
        if (scrollEndTimer) clearTimeout(scrollEndTimer);
        updateScrollState();
      }
    };

    updateScrollState();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('wheel', onUserInterrupt, { passive: true });
    window.addEventListener('touchstart', onUserInterrupt, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', onUserInterrupt);
      window.removeEventListener('touchstart', onUserInterrupt);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, [updateScrollState]);

  const sectionNavItems = [
    { label: 'Home', sectionId: 'hero' },
    { label: 'About', sectionId: 'about' },
    { label: 'Projects', sectionId: 'projects' },
    { label: 'Skills', sectionId: 'skills' },
    { label: 'Contact', sectionId: 'contact' },
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    isClickNavigating.current = true;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = setTimeout(() => {
      isClickNavigating.current = false;
    }, 1500);

    onNavigatePage('home', sectionId);
  };

  const handleBlogClick = () => {
    onNavigatePage('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-navigation"
      className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center py-4 sm:py-5 px-3 pointer-events-none transition-all duration-200"
    >
      <nav
        id="desktop-nav-links"
        className={`pointer-events-auto flex items-center justify-center gap-1 sm:gap-2 md:gap-2.5 px-3 sm:px-4 py-2 rounded-full backdrop-blur-xl transition-all duration-200 ${scrolled
            ? 'dark:bg-[#0c0808]/90 bg-white/90 dark:border-white/[0.12] border-[#4B4643]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(116,72,63,0.15)]'
            : 'dark:bg-[#0c0808]/75 bg-white/80 dark:border-white/[0.08] border-[#4B4643]/15 shadow-[0_4px_24px_rgba(0,0,0,0.2),0_0_16px_rgba(116,72,63,0.1)]'
          }`}
      >
        <div className="flex items-center gap-0.5 sm:gap-1.5 md:gap-2">
          {sectionNavItems.map((navItem) => {
            const isCurrent = activePage === 'home' && activeSection === navItem.sectionId;

            return (
              <button
                key={navItem.label}
                id={`nav-link-${navItem.label.toLowerCase()}`}
                onClick={() => handleSectionClick(navItem.sectionId)}
                className={`relative px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-colors duration-150 cursor-pointer select-none ${isCurrent
                    ? 'dark:text-[#c68477] text-[#74483F] font-semibold'
                    : 'dark:text-[#DCDEDD]/80 text-[#4B4643] hover:text-[#74483F] dark:hover:text-white'
                  }`}
              >
                <span>{navItem.label}</span>
                {isCurrent && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 30,
                      mass: 0.6
                    }}
                    className="absolute inset-x-0 -bottom-1 pointer-events-none flex flex-col items-center justify-end z-0"
                  >
                    <div className="absolute bottom-0 w-full h-4.5 bg-gradient-to-t dark:from-[#c68477]/22 dark:via-[#74483F]/10 from-[#74483F]/15 to-transparent blur-[4px] rounded-t-full pointer-events-none -z-10" />

                    <div className="absolute -bottom-[1px] w-3/4 h-[2px] dark:bg-[#e8a598] bg-[#74483F] blur-[1.5px] rounded-full opacity-55" />

                    <div className="relative w-[calc(100%-12px)] sm:w-[calc(100%-16px)] h-[2px] dark:bg-[#e0988a] bg-[#74483F] rounded-full shadow-[0_0_8px_rgba(198,132,119,0.7),0_0_14px_rgba(116,72,63,0.4)]" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>

        <div className="w-[1px] h-3.5 dark:bg-white/[0.12] bg-[#4B4643]/20 mx-1 sm:mx-1.5" />

        <button
          id="nav-link-blog"
          onClick={() => {
            soundFx.playClick();
            handleBlogClick();
          }}
          className="huly-btn flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-[13px] font-semibold cursor-pointer select-none shadow-md"
          aria-label="Navigate to Blog & Research Logs"
        >
          <span>Blog</span>
        </button>

        <div className="w-[1px] h-3.5 dark:bg-white/[0.12] bg-[#4B4643]/20 mx-0.5 sm:mx-1" />

        <button
          id="theme-mode-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'Light Theme (White & Brown)' : 'Dark Theme (Black & Brown)'}`}
          className="relative p-1.5 sm:p-2 rounded-full dark:text-[#DCDEDD] text-[#4B4643] dark:hover:text-white hover:text-[#74483F] dark:hover:bg-white/[0.08] hover:bg-[#74483F]/10 transition-all duration-200 cursor-pointer active:scale-90"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -45, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 45, scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#e6a99e] hover:text-[#ffffff] transition-colors" />
            ) : (
              <Moon className="w-4 h-4 text-[#74483F] hover:text-[#56332c] transition-colors" />
            )}
          </motion.div>
        </button>
      </nav>
    </header>
  );
};
