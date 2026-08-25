import React, { useEffect, useState } from 'react';
import { TRANSMISSIONS, PERSONAL_INFO } from '../data/portfolioData';
import { Transmission } from '../types';
import { loadProjects } from '../lib/content';
import { TransmissionModal } from './TransmissionModal';
import { ImageLightboxModal } from './ImageLightboxModal';
import { BorderGlow } from './BorderGlow/BorderGlow';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowUpRight,
  Terminal,
  Filter,
  CheckCircle2,
  ChevronDown,
  Layers,
  ZoomIn
} from 'lucide-react';
import { soundFx } from '../utils/audioHaptics';

const GENRES = [
  'ALL',
  'Autonomous Agents',
  'LLM Applications',
  'Computer Vision'
];

export const TransmissionsSection: React.FC = () => {
  const { theme } = useTheme();
  const [selectedTransmission, setSelectedTransmission] = useState<Transmission | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [projects, setProjects] = useState<Transmission[]>(TRANSMISSIONS);
  const isDark = theme === 'dark';

  useEffect(() => {
    let isMounted = true;

    loadProjects()
      .then((nextProjects) => {
        if (isMounted) setProjects(nextProjects);
      })
      .catch(() => {
        // Local project data remains visible if Sanity is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredTransmission = projects.find((transmission) => transmission.featured) || projects[0];

  const archiveProjects = projects.filter((transmission) => transmission.id !== featuredTransmission?.id);

  const filteredArchiveProjects = archiveProjects.filter((project) => {
    if (selectedGenre === 'ALL') return true;
    const genreLower = selectedGenre.toLowerCase();
    return (
      project.primaryDomain.toLowerCase().includes(genreLower) ||
      project.techStack.some((technology) => technology.toLowerCase().includes(genreLower)) ||
      project.title.toLowerCase().includes(genreLower)
    );
  });

  if (!featuredTransmission) return null;

  return (
    <section id="projects" data-section="projects" className="relative py-20 px-4 sm:px-6 z-10 scroll-mt-20">
      <div className="max-w-5xl mx-auto space-y-14">
        <div>
          <div className="flex items-center mb-6">
            <span className="font-mono-tech text-xs tracking-[0.25em] uppercase dark:text-[#c68477] text-[#74483F] font-semibold">
              2 FEATURED PROJECT
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r dark:from-[#74483F]/40 from-[#74483F]/30 to-transparent ml-6" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 text-left">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold dark:text-white text-[#1c1817] tracking-tight">
                Featured <span className="font-serif-accent dark:text-[#c68477] text-[#74483F] font-normal text-4xl sm:text-5xl">Project</span>
              </h2>
              {featuredTransmission.tagline && (
                <p className="text-sm sm:text-base dark:text-[#DCDEDD]/80 text-[#4B4643] mt-2 max-w-xl font-light">
                  {featuredTransmission.tagline}
                </p>
              )}
            </div>
          </div>

          <BorderGlow
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
            className="border dark:border-white/[0.08] border-[#DCDEDD] backdrop-blur-md text-left shadow-sm group"
          >
            <div
              id={`project-card-${featuredTransmission.transmissionNumber}`}
              className="p-4 sm:p-5 text-left"
            >
              <div className="flex flex-col md:flex-row items-stretch gap-5 sm:gap-6">
                {featuredTransmission.previewImage && (
                  <div className="w-full md:w-[320px] lg:w-[350px] shrink-0 flex flex-col rounded-lg overflow-hidden border dark:border-white/[0.1] border-[#DCDEDD] bg-[#0c0a09] shadow-md group-hover:border-[#74483F]/50 transition-colors duration-200">
                    <div
                      className="relative flex-1 min-h-[170px] sm:min-h-[190px] max-h-[220px] overflow-hidden bg-black/60 cursor-pointer group/img"
                      onClick={(event) => {
                        event.stopPropagation();
                        soundFx.playClick();
                        setLightboxImage({
                          src: featuredTransmission.previewImage!,
                          title: `${featuredTransmission.title} - Full Interface Screenshot (1024×639)`
                        });
                      }}
                      title="Click to view full image"
                    >
                      <img
                        src={featuredTransmission.previewImage}
                        alt={`${featuredTransmission.title} System Interface`}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono-tech">
                        <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white/90 border border-white/10 text-[9px]">
                          Multi-Agent UI
                        </span>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            soundFx.playClick();
                            setLightboxImage({
                              src: featuredTransmission.previewImage!,
                              title: `${featuredTransmission.title} - Full Interface Screenshot (1024×639)`
                            });
                          }}
                          className="px-2 py-0.5 rounded bg-[#74483F]/90 hover:bg-[#8e584d] active:scale-95 backdrop-blur-sm text-white border border-[#c68477]/50 text-[9px] flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                        >
                          <ZoomIn className="w-2.5 h-2.5" />
                          <span>Inspect ↗</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-tech text-[10px] px-2 py-0.5 rounded bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] font-semibold border dark:border-[#74483F]/30 border-[#74483F]/20 uppercase">
                          {featuredTransmission.primaryDomain}
                        </span>
                        <span className="font-mono-tech text-[10px] dark:text-[#DCDEDD]/50 text-[#4B4643]/70">
                          {featuredTransmission.period}
                        </span>
                      </div>
                      <span className="font-mono-tech text-[10px] dark:text-[#c68477] text-[#74483F] font-semibold tracking-wider uppercase">
                        #{featuredTransmission.transmissionNumber}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold dark:text-white text-[#1c1817] tracking-tight group-hover:text-[#74483F] dark:group-hover:text-[#c68477] transition-colors">
                        {featuredTransmission.title}
                      </h3>
                      {featuredTransmission.tagline && (
                        <p className="text-xs dark:text-[#DCDEDD]/90 text-[#4B4643] font-light mt-0.5">
                          {featuredTransmission.tagline}
                        </p>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm dark:text-[#DCDEDD]/75 text-[#4B4643]/95 leading-relaxed font-light line-clamp-3">
                      {featuredTransmission.summary}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {featuredTransmission.techStack.map((technology) => (
                        <span
                          key={technology}
                          className="font-mono-tech text-[10px] px-2 py-0.5 rounded dark:bg-white/[0.03] bg-[#4B4643]/10 dark:text-[#DCDEDD] text-[#4B4643] border dark:border-white/[0.06] border-[#DCDEDD]"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2.5 pt-3 border-t dark:border-white/[0.06] border-[#DCDEDD]"
                  >
                    <button
                      id={`btn-inspect-${featuredTransmission.id}`}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedTransmission(featuredTransmission);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-mono-tech dark:text-white text-[#1c1817] dark:bg-[#181110] bg-[#f0ece7] hover:bg-[#74483F]/15 dark:hover:bg-[#251a18] border dark:border-[#74483F]/40 border-[#74483F]/30 hover:border-[#74483F]/60 transition-colors duration-150 shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      <Terminal className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F]" />
                      <span>VIEW DETAILS</span>
                    </button>

                    <a
                      id={`link-github-${featuredTransmission.id}`}
                      href={featuredTransmission.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundFx.playClick()}
                      className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono-tech dark:text-[#DCDEDD]/70 text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] dark:bg-white/[0.02] bg-[#4B4643]/5 hover:bg-[#4B4643]/10 dark:hover:bg-white/[0.06] border dark:border-white/[0.06] border-[#DCDEDD] transition-colors duration-150"
                    >
                      <span>GITHUB</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </BorderGlow>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 dark:text-[#c68477] text-[#74483F]" />
              <h3 className="font-mono-tech text-xs uppercase tracking-[0.25em] dark:text-[#DCDEDD] text-[#1c1817] font-semibold">
                OTHER PROJECT REPOSITORIES
              </h3>
            </div>
          </div>

          <div className="dark:bg-[#120e0d] bg-white border dark:border-white/[0.08] border-[#DCDEDD] rounded-none p-6 sm:p-8 space-y-6 text-left">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono-tech dark:text-[#DCDEDD]/70 text-[#4B4643]">
                  All Specialized Repositories
                </span>
              </div>

              <div className="relative">
                <button
                  id="genre-filter-toggle-btn"
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono-tech dark:text-white text-[#1c1817] dark:bg-[#181110] bg-[#f0ece7] hover:bg-[#74483F]/15 dark:hover:bg-[#251a18] border dark:border-[#74483F]/40 border-[#74483F]/30 hover:border-[#74483F]/60 transition-colors duration-150 shadow-sm cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F]" />
                  <span>GENRE: <strong className="dark:text-[#c68477] text-[#74483F]">{selectedGenre}</strong></span>
                  <ChevronDown className={`w-3.5 h-3.5 dark:text-slate-400 text-slate-500 transition-transform duration-150 ${isGenreDropdownOpen ? 'rotate-180 dark:text-[#c68477] text-[#74483F]' : ''}`} />
                </button>

                {isGenreDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 p-2 rounded-none dark:bg-[#150f0e] bg-white border dark:border-[#74483F]/30 border-[#DCDEDD] shadow-2xl z-30 space-y-1 animate-fade-in font-mono-tech text-xs">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => {
                          setSelectedGenre(genre);
                          setIsGenreDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded transition-colors cursor-pointer flex items-center justify-between ${selectedGenre === genre
                          ? 'dark:bg-[#74483F]/20 bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] font-semibold border dark:border-[#74483F]/30 border-[#74483F]/20'
                          : 'dark:text-[#DCDEDD] text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] dark:hover:bg-white/[0.05] hover:bg-[#f6f3ef]'
                          }`}
                      >
                        <span>{genre}</span>
                        {selectedGenre === genre && (
                          <span className="w-1.5 h-1.5 rounded-full dark:bg-[#c68477] bg-[#74483F]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              <div className="md:col-span-4 space-y-3 font-mono-tech">
                <div className="dark:bg-[#181110] bg-[#f8f6f3] border dark:border-white/[0.06] border-[#DCDEDD] p-4 rounded-none space-y-2.5">
                  <span className="text-[10px] dark:text-[#DCDEDD]/60 text-[#4B4643]/70 tracking-wider block uppercase font-semibold">
                    DOMAIN FOCUS
                  </span>
                  <div className="space-y-2">
                    {PERSONAL_INFO.preferredDomains.map((domain, domainIndex) => (
                      <div key={domainIndex} className="flex items-center justify-between text-xs dark:text-[#DCDEDD] text-[#1c1817]">
                        <span className="truncate">{domain}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F] shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 space-y-3">
                {filteredArchiveProjects.length === 0 ? (
                  <div className="p-8 text-center dark:bg-[#181110] bg-[#f8f6f3] rounded-none dark:border-white/[0.06] border-[#DCDEDD] space-y-2">
                    <p className="text-sm dark:text-[#DCDEDD] text-[#4B4643] font-mono-tech">No projects found for genre: &quot;{selectedGenre}&quot;</p>
                    <button
                      onClick={() => setSelectedGenre('ALL')}
                      className="text-xs dark:text-[#c68477] text-[#74483F] hover:underline font-mono-tech cursor-pointer"
                    >
                      Reset filter to ALL
                    </button>
                  </div>
                ) : (
                  filteredArchiveProjects.map((project) => (
                    <div
                      key={project.id}
                      id={`archive-card-${project.id}`}
                      className="dark:bg-[#181110] bg-[#f8f6f3] border dark:border-white/[0.06] border-[#DCDEDD] p-4 rounded-none transition-colors duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group/card"
                    >
                      {project.previewImage && (
                        <div
                          className="w-full sm:w-24 md:w-28 h-20 shrink-0 rounded overflow-hidden border dark:border-white/[0.1] border-[#DCDEDD] bg-[#0c0a09] relative cursor-pointer group/thumb"
                          onClick={() => {
                            soundFx.playClick();
                            setLightboxImage({
                              src: project.previewImage!,
                              title: `${project.title} - Screenshot Preview`
                            });
                          }}
                          title="Click to view full image"
                        >
                          <img
                            src={project.previewImage}
                            alt={`${project.title} preview`}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/thumb:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover/thumb:opacity-100 transition-opacity font-mono-tech text-[9px] px-1.5 py-0.5 rounded bg-black/80 text-white border border-white/20">
                              Zoom ↗
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1 flex-1 min-w-0 text-left">
                        <h4 className="text-sm sm:text-base font-bold dark:text-white text-[#1c1817] truncate group-hover/card:text-[#74483F] dark:group-hover/card:text-[#c68477] transition-colors">
                          {project.title}
                        </h4>
                        <p className="text-xs dark:text-[#DCDEDD]/70 text-[#4B4643]/90 line-clamp-2 font-light font-sans">
                          {project.summary}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {project.techStack.map((technology) => (
                            <span
                              key={technology}
                              className="font-mono-tech text-[10px] px-2 py-0.5 rounded-none dark:bg-white/[0.03] bg-[#4B4643]/10 dark:text-[#DCDEDD] text-[#4B4643] border dark:border-white/[0.06] border-[#DCDEDD]"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                        <button
                          onClick={() => {
                            soundFx.playClick();
                            setSelectedTransmission(project);
                          }}
                          className="flex items-center gap-1.5 text-xs font-mono-tech px-3 py-1.5 rounded dark:text-white text-[#1c1817] dark:bg-[#120e0d] bg-[#f0ece7] hover:bg-[#74483F]/15 dark:hover:bg-[#251a18] border dark:border-[#74483F]/40 border-[#74483F]/30 hover:border-[#74483F]/60 transition-colors duration-150 shadow-sm cursor-pointer font-medium whitespace-nowrap"
                        >
                          <Terminal className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F]" />
                          <span>DETAILS</span>
                        </button>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => soundFx.playClick()}
                          className="flex items-center gap-1 p-2 rounded text-xs font-mono-tech dark:text-[#DCDEDD]/70 text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] dark:bg-white/[0.02] bg-[#4B4643]/5 hover:bg-[#4B4643]/10 dark:hover:bg-white/[0.06] border dark:border-white/[0.06] border-[#DCDEDD] transition-colors duration-150"
                          aria-label="GitHub Repository"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TransmissionModal
        transmission={selectedTransmission}
        onClose={() => setSelectedTransmission(null)}
      />

      <ImageLightboxModal
        isOpen={!!lightboxImage}
        imageSrc={lightboxImage?.src || null}
        title={lightboxImage?.title}
        onClose={() => setLightboxImage(null)}
      />
    </section>
  );
};
