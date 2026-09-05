import React, { useState } from 'react';
import { CAREER_ARC } from '../data/portfolioData';
import { Film, Code2, Brain, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { BorderGlow } from './BorderGlow/BorderGlow';

export const AboutSection: React.FC = () => {
  const { theme } = useTheme();
  const defaultPhaseIndex = CAREER_ARC.findIndex((milestone) => milestone.era.includes('3'));
  const [activeTab, setActiveTab] = useState(defaultPhaseIndex !== -1 ? defaultPhaseIndex : 2);
  const isDark = theme === 'dark';

  const getPhaseIcon = (phaseIndex: number) => {
    switch (phaseIndex) {
      case 0:
        return <Film className="w-4 h-4 dark:text-[#c68477] text-[#74483F]" />;
      case 1:
        return <Code2 className="w-4 h-4 dark:text-[#c68477] text-[#74483F]" />;
      case 2:
      default:
        return <Brain className="w-4 h-4 dark:text-[#c68477] text-[#74483F]" />;
    }
  };

  return (
    <section id="about" className="relative pt-12 sm:pt-16 pb-20 px-4 sm:px-6 z-10 scroll-mt-20 overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[650px] h-[160px] bg-gradient-to-b dark:from-[#74483F]/15 dark:via-[#ab6e62]/8 from-[#74483F]/10 via-[#DCDEDD]/30 to-transparent blur-[90px] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono-tech text-xs dark:text-[#c68477] text-[#74483F] tracking-[0.25em] uppercase font-semibold">
            1 ABOUT &amp; BACKGROUND
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r dark:from-[#74483F]/40 from-[#74483F]/30 dark:via-white/[0.1] via-[#DCDEDD] to-transparent" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold dark:text-white text-[#1c1817] tracking-tight">
              About <span className="font-serif-accent dark:text-[#c68477] text-[#74483F] font-normal text-4xl sm:text-5xl">Me</span>
            </h2>
          </div>
        </div>

        <div className="mb-12 rounded-[10px] dark:bg-[#120e0d] bg-white border dark:border-white/[0.08] border-[#DCDEDD] shadow-sm backdrop-blur-md overflow-hidden">
          <div className="p-6 sm:p-8 space-y-4 dark:text-[#DCDEDD]/90 text-[#1c1817] font-light text-base sm:text-lg leading-relaxed text-left">
            <p>
              I am <span className="dark:text-white text-[#1c1817] font-medium">Sahil Harsh</span>, an AI/ML Engineer building depth in the LLM and multimodal space through model fine-tuning, RAG, agents, inference, and evaluation. Basically combining ML research with engineering, deployment and MLOps and I'm continuously sharpening my skills across deep learning and applied AI systems.
            </p>
            <p>
              Unlike conventional paths into machine learning, my foundation was built behind the editing console and component trees. Years in editing, motion design and frontend development trained me to obsess over timing, smoothness and how small details affect the final experience. The same instincts I now bring to how a model behaves rather than just how it performs on a benchmark.
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-16">
          <div className="flex items-center justify-between">
            <h3 className="font-mono-tech text-xs uppercase tracking-[0.25em] dark:text-[#DCDEDD]/60 text-[#4B4643]/70">
              CAREER JOURNEY &amp; PROGRESSION
            </h3>
            <span className="font-mono-tech text-xs dark:text-[#c68477] text-[#74483F] tracking-wider font-semibold">
              SELECT PHASE TO VIEW
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CAREER_ARC.map((milestone, phaseIndex) => {
              const isSelected = activeTab === phaseIndex;
              return (
                <button
                  key={milestone.era}
                  id={`career-phase-tab-${phaseIndex}`}
                  onClick={() => setActiveTab(phaseIndex)}
                  className={`text-left p-5 rounded-none border transition-colors duration-150 cursor-pointer flex flex-col justify-between ${isSelected
                    ? 'dark:bg-[#1a1210] bg-[#f5f1ed] dark:border-[#c68477]/50 border-[#74483F]/50 shadow-md ring-1 dark:ring-[#c68477]/40 ring-[#74483F]/40'
                    : 'dark:bg-[#120e0d] bg-white border dark:border-white/[0.08] border-[#DCDEDD] hover:border-[#74483F]/40 dark:hover:border-white/[0.2]'
                    }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`font-mono-tech text-xs px-2 py-0.5 rounded-none ${isSelected
                          ? 'dark:bg-[#74483F]/25 bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] border dark:border-[#74483F]/35 border-[#74483F]/30 font-semibold'
                          : 'dark:bg-white/[0.04] bg-[#4B4643]/10 dark:text-[#DCDEDD]/70 text-[#4B4643]'
                          }`}
                      >
                        {milestone.era}
                      </span>
                      {getPhaseIcon(phaseIndex)}
                    </div>
                    <h4 className="font-semibold dark:text-white text-[#1c1817] text-base mb-1">
                      {milestone.role}
                    </h4>
                    <p className="text-xs dark:text-[#DCDEDD]/60 text-[#4B4643]/80 font-mono-tech">
                      {milestone.organization}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t dark:border-white/[0.06] border-[#DCDEDD] flex items-center justify-between text-xs dark:text-[#DCDEDD]/60 text-[#4B4643]">
                    <span className="truncate">{milestone.domain}</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${isSelected ? 'dark:text-[#c68477] text-[#74483F] translate-x-1' : 'dark:text-[#DCDEDD]/60 text-[#4B4643]'
                        }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <BorderGlow
            key={activeTab}
            borderRadius={10}
            borderWidth={2}
            edgeSensitivity={160}
            coneSpread={4}
            animated={true}
            backgroundColor={isDark ? '#120e0d' : '#ffffff'}
            colors={
              isDark
                ? ['#a56c5fff', '#75463cff', '#693d34ff', '#683c34ff', '#4d2c25ff']
                : ['#875045ff', '#7d463bff', '#6f3d34ff', '#5b332bff', '#442621ff']
            }
            glowFilter={
              isDark
                ? 'drop-shadow(0 0 3.5px rgba(198, 132, 119, 0.95)) drop-shadow(0 0 8px rgba(116, 72, 63, 0.85))'
                : 'drop-shadow(0 0 3.5px rgba(171, 110, 98, 0.95)) drop-shadow(0 0 7px rgba(116, 72, 63, 0.7))'
            }
            className="border dark:border-white/[0.08] border-[#DCDEDD] backdrop-blur-md text-left"
          >
            <div className="p-6 sm:p-7 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b dark:border-white/[0.08] border-[#DCDEDD]">
                <div>
                  <h4 className="text-xl font-bold dark:text-white text-[#1c1817]">
                    {CAREER_ARC[activeTab].role}
                  </h4>
                </div>
                <span className="font-mono-tech text-xs dark:text-[#DCDEDD] text-[#4B4643] dark:bg-white/[0.04] bg-[#4B4643]/10 px-3 py-1 rounded-full border dark:border-white/[0.06] border-[#DCDEDD] self-start sm:self-auto">
                  {CAREER_ARC[activeTab].organization}
                </span>
              </div>

              {CAREER_ARC[activeTab].summary && (
                <p className="dark:text-[#DCDEDD]/90 text-[#1c1817] text-sm sm:text-base leading-relaxed mb-6 font-light">
                  {CAREER_ARC[activeTab].summary}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-mono-tech text-xs dark:text-[#DCDEDD]/60 text-[#4B4643] uppercase tracking-wider mb-3 font-semibold">
                    Key Differentiators
                  </h5>
                  <ul className="space-y-2">
                    {CAREER_ARC[activeTab].keyDifferentiators.map((differentiator, differentiatorIndex) => (
                      <li key={differentiatorIndex} className="flex items-start gap-2 text-xs sm:text-sm dark:text-[#DCDEDD]/90 text-[#1c1817]">
                        <CheckCircle2 className="w-4 h-4 dark:text-[#c68477] text-[#74483F] shrink-0 mt-0.5" />
                        <span>{differentiator}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-mono-tech text-xs dark:text-[#DCDEDD]/60 text-[#4B4643] uppercase tracking-wider mb-3 font-semibold">
                    Applied Tooling &amp; Standards
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {CAREER_ARC[activeTab].technologies.map((technology) => (
                      <span
                        key={technology}
                        className="font-mono-tech text-xs px-2.5 py-1 rounded-md dark:bg-white/[0.04] bg-[#4B4643]/10 dark:text-[#DCDEDD] text-[#4B4643] border dark:border-white/[0.08] border-[#DCDEDD]"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </BorderGlow>
        </div>
      </div>
    </section>
  );
};
