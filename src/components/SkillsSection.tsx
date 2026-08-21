import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { getSkillIcon } from './SkillIcons';

interface SkillItem {
  name: string;
  iconKey?: string;
}

interface SkillCategory {
  id: string;
  title: string;
  skills: SkillItem[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'ai-ml',
    title: 'AI/ML',
    skills: [
      { name: 'PYTHON', iconKey: 'python' },
      { name: 'NUMPY', iconKey: 'numpy' },
      { name: 'PYTORCH', iconKey: 'pytorch' },
      { name: 'SCIKIT-LEARN', iconKey: 'scikitlearn' },
      { name: 'PANDAS', iconKey: 'pandas' },
      { name: 'OPENCV', iconKey: 'opencv' },
      { name: 'LANGCHAIN', iconKey: 'langchain' },
      { name: 'LANGGRAPH', iconKey: 'langgraph' },
    ],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud, Deployment & MLOps',
    skills: [
      { name: 'DOCKER', iconKey: 'docker' },
      { name: 'STREAMLIT', iconKey: 'streamlit' },
      { name: 'AWS', iconKey: 'aws' },
      { name: 'GCP', iconKey: 'gcp' },
      { name: 'CI/CD', iconKey: 'cicd' },
    ],
  },
  {
    id: 'api-tools-db',
    title: 'API, Tools & Database',
    skills: [
      { name: 'FASTAPI', iconKey: 'fastapi' },
      { name: 'MYSQL', iconKey: 'mysql' },
      { name: 'UV', iconKey: 'uv' },
    ],
  },
  {
    id: 'old-stack',
    title: 'Old Stack',
    skills: [
      { name: 'JAVASCRIPT', iconKey: 'javascript' },
      { name: 'TYPESCRIPT', iconKey: 'typescript' },
      { name: 'REACT', iconKey: 'react' },
      { name: 'HTML5', iconKey: 'html5' },
      { name: 'CSS3', iconKey: 'css3' },
      { name: 'TAILWIND CSS', iconKey: 'tailwindcss' },
      { name: 'NEXT.JS', iconKey: 'nextjs' },
    ],
  },
  {
    id: 'software',
    title: 'Software',
    skills: [
      { name: 'FIGMA', iconKey: 'figma' },
      { name: 'ADOBE XD', iconKey: 'adobexd' },
      { name: 'ILLUSTRATOR', iconKey: 'illustrator' },
      { name: 'BLENDER', iconKey: 'blender' },
      { name: 'AFTER EFFECTS', iconKey: 'aftereffects' },
      { name: 'PREMIERE PRO', iconKey: 'premierepro' },
      { name: 'AUDITION', iconKey: 'audition' },
      { name: 'PHOTOSHOP', iconKey: 'photoshop' },
      { name: 'SONY VEGAS', iconKey: 'sonyvegas' },
      { name: 'DAVINCI RESOLVE', iconKey: 'davinciresolve' },
    ],
  },
];

export const SkillsSection: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'ai-ml': false,
    'cloud-devops': false,
    'api-tools-db': false,
    'old-stack': false,
    software: false,
  });

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleAll = (expand: boolean) => {
    const nextState: Record<string, boolean> = {};
    SKILL_CATEGORIES.forEach((cat) => {
      nextState[cat.id] = expand;
    });
    setExpandedCategories(nextState);
  };

  const allExpanded = SKILL_CATEGORIES.every((cat) => !!expandedCategories[cat.id]);

  return (
    <section id="skills" data-section="skills" className="relative py-20 px-4 sm:px-6 lg:px-8 z-10 optimized-section scroll-mt-20">
      <div className="max-w-5xl mx-auto text-left space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono-tech text-xs dark:text-[#c68477] text-[#74483F] tracking-[0.25em] uppercase font-semibold">
            3  SKILLS
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r dark:from-[#74483F]/40 from-[#74483F]/30 dark:via-white/[0.1] via-[#DCDEDD] to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold dark:text-white text-[#1c1817] tracking-tight">
              Skills, Languages &amp; <span className="font-serif-accent dark:text-[#c68477] text-[#74483F] font-normal text-4xl sm:text-5xl">Tools</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={() => handleToggleAll(!allExpanded)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono-tech dark:text-[#DCDEDD] text-[#4B4643] hover:text-[#1c1817] dark:hover:text-white glass dark:border-white/[0.1] border-[#DCDEDD] hover:border-[#74483F]/60 dark:hover:border-[#c68477]/60 transition-all duration-150 cursor-pointer shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F]" />
            <span>{allExpanded ? 'COLLAPSE ALL' : 'EXPAND ALL'}</span>
          </button>
        </div>

        <div className="divide-y dark:divide-white/[0.08] divide-[#DCDEDD] border-t border-b dark:border-white/[0.08] border-[#DCDEDD]">
          {SKILL_CATEGORIES.map((category) => {
            const isExpanded = !!expandedCategories[category.id];

            return (
              <div key={category.id} className="py-4 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between text-left py-1 group focus:outline-none cursor-pointer select-none"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base sm:text-lg font-bold dark:text-[#DCDEDD] text-[#1c1817] dark:group-hover:text-white group-hover:text-[#74483F] transition-colors duration-150 tracking-wide">
                      {category.title}
                    </h3>
                    <span className="font-mono-tech text-[11px] dark:text-[#DCDEDD]/70 text-[#4B4643] dark:bg-white/[0.03] bg-[#4B4643]/5 px-2 py-0.5 rounded border dark:border-white/[0.06] border-[#DCDEDD]">
                      {category.skills.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 dark:text-[#DCDEDD]/60 text-[#4B4643] dark:group-hover:text-[#c68477] group-hover:text-[#74483F] transition-colors duration-150">
                    <span className="font-mono-tech text-[11px] uppercase tracking-wider hidden sm:inline-block">
                      {isExpanded ? 'COLLAPSE' : 'EXPAND'}
                    </span>
                    <div className="w-7 h-7 rounded glass flex items-center justify-center dark:border-white/[0.06] border-[#DCDEDD] group-hover:border-[#74483F]/40 transition-colors duration-150">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 dark:text-[#DCDEDD] text-[#4B4643] dark:group-hover:text-[#c68477] group-hover:text-[#74483F]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 dark:text-[#DCDEDD] text-[#4B4643] dark:group-hover:text-[#c68477] group-hover:text-[#74483F]" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="pt-4 pb-2 pl-2 sm:pl-4 animate-fade-in">
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="group/item relative inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg dark:bg-[#140e0d] bg-white dark:hover:bg-[#1b1412] hover:bg-[#faf7f5] border dark:border-white/[0.08] border-[#DCDEDD] hover:border-[#74483F]/70 dark:hover:border-[#c68477]/70 dark:text-[#DCDEDD] text-[#1c1817] dark:hover:text-white font-mono-tech text-xs tracking-wider transition-all duration-200 cursor-pointer select-none shadow-sm hover:shadow-[0_4px_16px_rgba(116,72,63,0.18)] hover:-translate-y-0.5"
                        >
                          <span className="shrink-0 flex items-center justify-center opacity-85 group-hover/item:opacity-100 group-hover/item:scale-115 transition-all duration-200">
                            {getSkillIcon(skill.iconKey || skill.name)}
                          </span>
                          <span className="font-medium whitespace-nowrap dark:group-hover/item:text-white group-hover/item:text-[#74483F] transition-colors duration-200">
                            {skill.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
