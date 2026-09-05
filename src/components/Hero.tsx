import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundFx } from '../utils/audioHaptics';
import { ShinyText } from './ShinyText/ShinyText';
import { useTheme } from '../context/ThemeContext';

interface HeroProps {
  onExploreWork?: () => void;
  onOpenConsole: () => void;
}

const ROTATING_PHRASES = [
  'Architecting & Fine-Tuning',
  'Integrating & Deploying'
];

const SOCIAL_PROFILES = [
  {
    name: 'LinkedIn',
    handle: 'sahil-harsh-598b02288',
    url: PERSONAL_INFO.linkedinUrl,
    tagline: 'Professional & Network',
    badge: 'CONNECT',
    icon: (
      <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    )
  },
  {
    name: 'GitHub',
    handle: 'Sahil-xharsh',
    url: PERSONAL_INFO.githubUrl,
    tagline: 'Repositories & Agents',
    badge: 'CODE',
    icon: (
      <svg className="w-4 h-4 dark:text-white text-[#1c1817]" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    )
  },
  {
    name: 'Hugging Face',
    handle: 'Sahil-xharsh',
    url: PERSONAL_INFO.huggingFaceUrl,
    tagline: 'Models, Spaces & Datasets',
    badge: 'MODELS',
    icon: (
      <svg className="w-4 h-4 text-[#FFD21E]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm-3.75 6.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zm7.5 0a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM12 18.25c-2.8 0-4.75-1.75-5.25-3.25h10.5c-.5 1.5-2.45 3.25-5.25 3.25z" />
      </svg>
    )
  },
  {
    name: 'Kaggle',
    handle: 'sahilxharsh',
    url: PERSONAL_INFO.kaggleUrl,
    tagline: 'Data Science & Notebooks',
    badge: 'DATA',
    icon: (
      <svg className="w-4 h-4 text-[#20BEFF]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.825 21.844h-3.956l-4.52-6.533-1.636 1.56v4.973H5.175V2.156h3.538v11.754l5.957-6.07h4.373l-6.31 6.16 6.092 7.844z" />
      </svg>
    )
  },
  {
    name: 'X (Twitter)',
    handle: 'Sahil_xharsh',
    url: PERSONAL_INFO.xUrl,
    tagline: 'AI Research Logs & Notes',
    badge: 'FEED',
    icon: (
      <svg className="w-4 h-4 dark:text-white text-[#1c1817]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }
];

export const Hero: React.FC<HeroProps> = ({ onExploreWork, onOpenConsole }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const scheduleNext = () => {
      if (timerId) clearTimeout(timerId);
      if (document.hidden) return;

      timerId = setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
        scheduleNext();
      }, 7000);
    };

    scheduleNext();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timerId) clearTimeout(timerId);
      } else {
        scheduleNext();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerId) clearTimeout(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <section
      id="hero"
      data-section="home"
      className="relative w-full min-h-screen flex flex-col justify-start pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-20 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden select-none dark:bg-[#060404] bg-[#faf8f6] scroll-mt-24 transition-colors duration-300"
    >
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[320px] dark:bg-[radial-gradient(ellipse_at_center,rgba(116,72,63,0.22),transparent_70%)] bg-[radial-gradient(ellipse_at_center,rgba(116,72,63,0.08),transparent_70%)] blur-2xl" />

        <div className="absolute top-1/3 right-[-10%] w-[500px] h-[400px] dark:bg-[radial-gradient(ellipse_at_center,rgba(171,110,98,0.12),transparent_70%)] bg-[radial-gradient(ellipse_at_center,rgba(116,72,63,0.04),transparent_70%)] blur-3xl" />

        <div
          className="absolute inset-0 dark:opacity-25 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(116, 72, 63, 0.25) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto w-full z-10 flex flex-col gap-10 sm:gap-14 my-auto mt-2 sm:mt-6 md:mt-8">

        <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-6 sm:gap-8 pt-2 sm:pt-4 text-center lg:text-left">
          <div className="space-y-4 sm:space-y-5 max-w-3xl flex flex-col items-center lg:items-start justify-between">
            <div className="inline-flex justify-center lg:justify-start">
              <div className="inline-flex items-center px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-full font-mono-tech tracking-wider backdrop-blur-md shadow-sm border dark:border-white/[0.12] border-[#DCDEDD] dark:bg-[#140e0d]/75 bg-white/95">
                <span className="dark:text-white text-[#1c1817] text-sm sm:text-base md:text-[17px] font-bold tracking-wider uppercase select-none">
                  SAHIL HARSH
                </span>
              </div>
            </div>

            <div className="space-y-2.5 sm:space-y-3 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
              <h1
                id="hero-main-heading"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] dark:text-white text-[#1c1817] leading-[1.14] flex flex-col items-center lg:items-start text-center lg:text-left w-full"
              >
                <span>AI Engineer</span>
                <span className="relative inline-block h-[1.18em] overflow-hidden text-center lg:text-left w-full">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={ROTATING_PHRASES[phraseIndex]}
                      initial={{ y: '100%', opacity: 0, filter: 'blur(3px)' }}
                      animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                      exit={{ y: '-100%', opacity: 0, filter: 'blur(3px)' }}
                      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block dark:text-[#c68477] text-[#74483F] drop-shadow-[0_0_35px_rgba(116,72,63,0.35)] whitespace-nowrap"
                    >
                      {ROTATING_PHRASES[phraseIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>

              <p
                id="hero-headline-sub"
                className="text-base sm:text-lg md:text-xl font-light max-w-2xl leading-relaxed tracking-normal text-center lg:text-left pl-0 m-0"
              >
                <ShinyText
                  text="Learning Before the Problem Arises"
                  disabled={false}
                  speed={7}
                  delay={1.2}
                  className="font-light tracking-normal"
                  color={theme === 'dark' ? '#8e8e8e' : '#736761'}
                  shineColor={theme === 'dark' ? '#ffffff' : '#c68477'}
                  spread={125}
                  yoyo={true}
                  pauseOnHover={false}
                  direction="left"
                />
              </p>
            </div>
          </div>

          <div id="hero-actions" className="flex flex-col items-center justify-between gap-4 shrink-0 pb-1 lg:pb-0">
            <div className="relative group">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-[172px] lg:h-[172px] rounded-full p-[3px] bg-gradient-to-tr from-[#74483F] via-[#c68477] to-[#e4b5a8] shadow-[0_0_35px_rgba(116,72,63,0.38)] transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_45px_rgba(198,132,119,0.55)]">
                <div className="w-full h-full rounded-full overflow-hidden dark:bg-[#140e0d] bg-white">
                  <img
                    src="/profile.jpg"
                    alt="Sahil Harsh"
                    className="w-full h-full object-cover rounded-full select-none"
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            <button
              id="hero-open-console-btn"
              onClick={() => {
                soundFx.playClick();
                onOpenConsole();
              }}
              className="huly-btn flex items-center justify-center gap-2 px-4.5 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold font-mono-tech tracking-wider cursor-pointer shadow-lg active:scale-95"
              aria-label="Open Interactive Terminal Agent"
            >
              <span className="font-bold">&gt;_</span>
              <span>TERMINAL_AGENT</span>
            </button>
          </div>
        </div>

        <div className="relative w-full mx-auto z-20">

          <div className="rounded-none dark:bg-[#0d0908]/95 bg-white border dark:border-white/[0.12] border-[#DCDEDD] shadow-[0_25px_80px_rgba(0,0,0,0.5),0_0_20px_rgba(116,72,63,0.08)] overflow-hidden backdrop-blur-2xl relative font-mono-tech">

            <div className="px-5 py-4 border-b dark:border-white/[0.08] border-[#DCDEDD] flex flex-wrap items-center justify-between gap-4 dark:bg-[#140e0d]/85 bg-[#fbf9f7]">

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 pl-2 border-l-2 dark:border-[#c68477]/70 border-[#74483F]">
                  <Globe className="w-4 h-4 dark:text-[#c68477] text-[#74483F]" />
                  <span className="font-bold dark:text-white text-[#1c1817] text-xs sm:text-sm tracking-wider uppercase">
                    SOCIAL &amp; RESEARCH PROFILES
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded dark:bg-[#74483F]/20 bg-[#74483F]/10 dark:border-[#74483F]/35 border-[#74483F]/25 dark:text-[#c68477] text-[#74483F] font-semibold tracking-wider">
                    DIRECT ACCESS
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 dark:bg-[#070505]/90 bg-[#faf8f6]">
              {SOCIAL_PROFILES.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="group relative p-4 rounded-lg dark:bg-[#150f0e] bg-white dark:hover:bg-[#1f1615] hover:bg-[#fbf9f8] dark:border-white/[0.1] border-[#DCDEDD] dark:hover:border-[#c68477]/60 hover:border-[#74483F]/60 transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer hover:shadow-[0_0_20px_rgba(116,72,63,0.18)] hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded dark:bg-[#74483F]/15 bg-[#74483F]/10 dark:border-[#74483F]/30 border-[#74483F]/20 dark:group-hover:border-[#c68477]/50 group-hover:border-[#74483F]/40 dark:group-hover:bg-[#74483F]/25 group-hover:bg-[#74483F]/15 flex items-center justify-center transition-all duration-200 dark:text-[#c68477] text-[#74483F]">
                      {social.icon}
                    </div>
                    <div className="w-7 h-7 rounded dark:bg-white/[0.05] bg-[#4B4643]/5 dark:group-hover:bg-[#74483F]/20 group-hover:bg-[#74483F]/15 flex items-center justify-center dark:text-[#DCDEDD]/70 text-[#4B4643] dark:group-hover:text-[#c68477] group-hover:text-[#74483F] transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold dark:text-white text-[#1c1817] text-xs sm:text-sm tracking-tight dark:group-hover:text-[#c68477] group-hover:text-[#74483F] transition-colors">
                        {social.name}
                      </span>
                      <span className="text-[9px] font-mono-tech px-2 py-0.5 rounded dark:bg-[#74483F]/15 bg-[#74483F]/10 dark:border-[#74483F]/30 border-[#74483F]/20 dark:text-[#c68477] text-[#74483F] font-medium">
                        {social.badge}
                      </span>
                    </div>
                    <p className="text-xs dark:text-[#DCDEDD] text-[#4B4643] font-mono-tech truncate font-medium">
                      {social.handle}
                    </p>
                    <p className="text-[10px] dark:text-[#DCDEDD]/70 text-[#4B4643]/80 dark:group-hover:text-white group-hover:text-[#1c1817] font-sans font-light line-clamp-1 leading-tight">
                      {social.tagline}
                    </p>
                  </div>
                </a>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
