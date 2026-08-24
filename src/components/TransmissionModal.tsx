import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Github,
  ArrowUpRight,
  Sparkles,
  Zap,
  Terminal,
  Check,
  Cpu,
  Layers,
  FileCode2,
  CheckCircle2,
  Workflow,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Transmission } from '../types';
import { soundFx } from '../utils/audioHaptics';
import { ImageLightboxModal } from './ImageLightboxModal';

interface TransmissionModalProps {
  transmission: Transmission | null;
  onClose: () => void;
}

export const TransmissionModal: React.FC<TransmissionModalProps> = ({
  transmission,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'spec' | 'stack'>('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (transmission) {
      setActiveTab('overview');
      setCopiedPrompt(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [transmission?.id]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  useEffect(() => {
    if (transmission) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [transmission, isFullscreen, onClose]);

  if (!transmission) return null;

  const handleCopySpec = () => {
    soundFx.playClick();
    if (transmission.specSnippet?.codeSnippet) {
      navigator.clipboard.writeText(transmission.specSnippet.codeSnippet);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2200);
    }
  };

  const specSnippet = transmission.specSnippet || {
    tabTitle: 'SPEC',
    fileName: `${transmission.id}_spec.json`,
    language: 'json',
    description: 'Project configuration and interface schema.',
    codeSnippet: JSON.stringify(
      {
        project_id: transmission.id,
        title: transmission.title,
        domain: transmission.primaryDomain,
        tech_stack: transmission.techStack
      },
      null,
      2
    )
  };

  const modalContent = (
    <div
      id="transmission-modal-backdrop"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 dark:bg-black/90 backdrop-blur-md overflow-hidden select-none transition-all duration-200 ${
        isFullscreen ? 'p-0 sm:p-2 md:p-3' : 'p-3 sm:p-5 md:p-6'
      }`}
      onClick={onClose}
    >
      <div
        id="transmission-modal-dialog"
        className={`relative w-full flex flex-col dark:bg-[#120e0d] bg-white border dark:border-white/[0.12] border-[#DCDEDD] shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden text-left transition-all duration-200 rounded-none ${
          isFullscreen
            ? 'h-full w-full max-w-none max-h-none'
            : 'max-w-3xl h-[86vh] max-h-[780px]'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 p-4 sm:p-6 pb-3 border-b dark:border-white/[0.08] border-[#DCDEDD] dark:bg-[#181110] bg-[#faf8f6]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 text-left min-w-0 flex-1">
              <h3 className="text-2xl sm:text-3xl font-bold dark:text-white text-[#1c1817] tracking-tight">
                {transmission.title}
              </h3>
              {transmission.tagline && (
                <p className="text-xs sm:text-sm dark:text-[#DCDEDD]/80 text-[#4B4643] font-light leading-snug">
                  {transmission.tagline}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                id="modal-fullscreen-toggle-btn"
                onClick={() => {
                  soundFx.playClick();
                  setIsFullscreen(!isFullscreen);
                }}
                className="p-2 rounded-none dark:text-[#DCDEDD]/80 text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] dark:bg-white/[0.04] bg-[#4B4643]/5 hover:bg-[#74483F]/15 dark:hover:bg-[#74483F]/25 border dark:border-white/[0.08] border-[#DCDEDD] hover:border-[#74483F]/40 transition-colors duration-150 cursor-pointer"
                title={isFullscreen ? 'Exit Full Screen (ESC)' : 'Open Full Screen'}
                aria-label={isFullscreen ? 'Exit Full Screen' : 'Open Full Screen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              <button
                id="modal-close-btn"
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="p-2 rounded-none dark:text-[#DCDEDD]/80 text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] dark:bg-white/[0.04] bg-[#4B4643]/5 hover:bg-[#74483F]/15 dark:hover:bg-[#74483F]/25 border dark:border-white/[0.08] border-[#DCDEDD] hover:border-[#74483F]/40 transition-colors duration-150 cursor-pointer"
                title="Close (ESC)"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mt-4 pt-1 font-mono-tech text-xs w-full">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('overview');
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-none border transition-colors cursor-pointer text-center ${
                activeTab === 'overview'
                  ? 'dark:bg-[#74483F]/25 bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] dark:border-[#c68477]/40 border-[#74483F]/40 font-semibold shadow-sm'
                  : 'dark:text-[#DCDEDD]/70 text-[#4B4643] dark:bg-white/[0.02] bg-[#4B4643]/5 border dark:border-white/[0.06] border-[#DCDEDD] hover:text-[#1c1817] dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">1 OVERVIEW</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('architecture');
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-none border transition-colors cursor-pointer text-center ${
                activeTab === 'architecture'
                  ? 'dark:bg-[#74483F]/25 bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] dark:border-[#c68477]/40 border-[#74483F]/40 font-semibold shadow-sm'
                  : 'dark:text-[#DCDEDD]/70 text-[#4B4643] dark:bg-white/[0.02] bg-[#4B4643]/5 border dark:border-white/[0.06] border-[#DCDEDD] hover:text-[#1c1817] dark:hover:text-white'
              }`}
            >
              <Workflow className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">2 ARCHITECTURE</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('spec');
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-none border transition-colors cursor-pointer text-center ${
                activeTab === 'spec'
                  ? 'dark:bg-[#74483F]/25 bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] dark:border-[#c68477]/40 border-[#74483F]/40 font-semibold shadow-sm'
                  : 'dark:text-[#DCDEDD]/70 text-[#4B4643] dark:bg-white/[0.02] bg-[#4B4643]/5 border dark:border-white/[0.06] border-[#DCDEDD] hover:text-[#1c1817] dark:hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">3 SPEC CONFIG</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('stack');
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-none border transition-colors cursor-pointer text-center ${
                activeTab === 'stack'
                  ? 'dark:bg-[#74483F]/25 bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] dark:border-[#c68477]/40 border-[#74483F]/40 font-semibold shadow-sm'
                  : 'dark:text-[#DCDEDD]/70 text-[#4B4643] dark:bg-white/[0.02] bg-[#4B4643]/5 border dark:border-white/[0.06] border-[#DCDEDD] hover:text-[#1c1817] dark:hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">4 TECH STACK</span>
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 text-left space-y-6 select-text custom-scrollbar"
        >
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="dark:bg-[#181110] bg-[#f8f6f3] border dark:border-white/[0.06] border-[#DCDEDD] p-4 sm:p-5 rounded-[10px] space-y-2">
                <span className="font-mono-tech text-[10px] uppercase tracking-wider dark:text-[#c68477] text-[#74483F] font-semibold block">
                  PROJECT SUMMARY
                </span>
                <p className="dark:text-[#DCDEDD] text-[#1c1817] font-light text-sm sm:text-base leading-relaxed">
                  {transmission.summary}
                </p>
              </div>

              {transmission.previewImage && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-[10px] uppercase tracking-wider dark:text-[#c68477] text-[#74483F] font-semibold block">
                      SYSTEM INTERFACE &amp; WORKFLOW
                    </span>
                    <span className="font-mono-tech text-[10px] dark:text-[#DCDEDD]/60 text-[#4B4643]">
                      Original Dashboard &amp; Pipeline Output
                    </span>
                  </div>
                  <div
                    className={`rounded-none overflow-hidden border dark:border-white/[0.1] border-[#DCDEDD] bg-[#0c0a09] shadow-lg transition-all duration-200 w-fit mx-auto max-w-full ${
                      isFullscreen ? 'max-w-4xl' : 'max-w-2xl'
                    }`}
                  >
                    <div
                      className="relative bg-[#070505] flex items-center justify-center p-1 sm:p-2 cursor-pointer group/modalimg"
                      onClick={() => {
                        soundFx.playClick();
                        setIsImageLightboxOpen(true);
                      }}
                      title="Click to view full image in lightbox"
                    >
                      <img
                        src={transmission.previewImage}
                        alt={`${transmission.title} Interface`}
                        className={`w-auto h-auto max-w-full object-contain select-none rounded-none transition-transform duration-300 group-hover/modalimg:scale-[1.01] ${
                          isFullscreen ? 'max-h-[75vh]' : 'max-h-[520px]'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {transmission.originStory && (
                <div className="dark:bg-[#150f0e] bg-white border dark:border-[#74483F]/35 border-[#74483F]/25 p-4 sm:p-5 rounded-[10px] space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F]" />
                    <span className="font-mono-tech text-[10px] uppercase tracking-wider dark:text-[#c68477] text-[#74483F] font-semibold block">
                      INITIAL IDEA &amp; EVOLUTION
                    </span>
                  </div>
                  <p className="dark:text-[#DCDEDD]/90 text-[#1c1817] font-light text-xs sm:text-sm leading-relaxed">
                    {transmission.originStory}
                  </p>
                </div>
              )}

              <div>
                <h5 className="font-mono-tech text-xs dark:text-[#DCDEDD]/60 text-[#4B4643] uppercase tracking-wider mb-2.5 font-semibold">
                  TECHNICAL SPECIFICATIONS
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {transmission.metrics.map((metric, metricIndex) => (
                    <div
                      key={metricIndex}
                      className="dark:bg-[#181110] bg-[#f8f6f3] border dark:border-white/[0.08] border-[#DCDEDD] p-3.5 rounded-none space-y-1"
                    >
                      <div className="font-mono-tech text-[10px] dark:text-[#DCDEDD]/60 text-[#4B4643]/80 uppercase tracking-wider font-semibold">
                        {metric.label}
                      </div>
                      <div className="font-mono-tech text-base sm:text-lg dark:text-[#c68477] text-[#74483F] font-bold">
                        {metric.value}
                      </div>
                      <div className="text-[11px] dark:text-[#DCDEDD]/70 text-[#4B4643]/90 leading-tight">
                        {metric.context}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-mono-tech text-xs dark:text-[#DCDEDD]/60 text-[#4B4643] uppercase tracking-wider mb-2.5 font-semibold">
                  KEY IMPLEMENTATION HIGHLIGHTS
                </h5>
                <div className="space-y-2">
                  {transmission.keyInnovations.map((innovation, innovationIndex) => (
                    <div
                      key={innovationIndex}
                      className="flex items-start gap-2.5 p-3 rounded-none dark:bg-[#181110] bg-[#f8f6f3] border dark:border-white/[0.06] border-[#DCDEDD]"
                    >
                      <CheckCircle2 className="w-4 h-4 dark:text-[#c68477] text-[#74483F] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm dark:text-[#DCDEDD] text-[#1c1817] font-light leading-snug">
                        {innovation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6 animate-fade-in">
              <div className="dark:bg-[#181110] bg-[#f8f6f3] border dark:border-white/[0.06] border-[#DCDEDD] p-4 sm:p-5 rounded-[10px] space-y-2">
                <span className="font-mono-tech text-[10px] uppercase tracking-wider dark:text-[#c68477] text-[#74483F] font-semibold block">
                  ARCHITECTURE &amp; MULTI-AGENT WORKFLOW
                </span>
                <p className="dark:text-[#DCDEDD] text-[#1c1817] font-light text-sm sm:text-base leading-relaxed">
                  {transmission.architectureOverview}
                </p>
              </div>

              {transmission.buildPhases && transmission.buildPhases.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-mono-tech text-xs dark:text-[#DCDEDD]/60 text-[#4B4643] uppercase tracking-wider font-semibold">
                      THREE DELIBERATE BUILD PHASES
                    </h5>
                    <span className="font-mono-tech text-[10px] dark:text-[#c68477] text-[#74483F] font-medium">
                      EVOLUTIONARY ARCHITECTURE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech text-xs">
                    {transmission.buildPhases.map((phase) => (
                      <div
                        key={phase.phaseNumber}
                        className="p-3.5 sm:p-4 rounded-none dark:bg-[#181110] bg-[#f8f6f3] border dark:border-[#74483F]/35 border-[#74483F]/25 flex flex-col justify-between space-y-2"
                      >
                        <div className="space-y-1.5">
                          <span className="px-2 py-0.5 rounded-none dark:bg-[#74483F]/25 bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] font-bold inline-block">
                            PHASE {phase.phaseNumber}
                          </span>
                          <h6 className="dark:text-white text-[#1c1817] font-bold text-xs">
                            {phase.title}
                          </h6>
                        </div>
                        <p className="font-sans text-[11px] sm:text-xs dark:text-[#DCDEDD]/80 text-[#4B4643] font-light leading-relaxed">
                          {phase.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-mono-tech text-xs dark:text-[#DCDEDD]/60 text-[#4B4643] uppercase tracking-wider font-semibold">
                    EXECUTION PIPELINE FLOW
                  </h5>
                  <span className="font-mono-tech text-[10px] dark:text-[#c68477] text-[#74483F] font-medium">
                    {transmission.topologyFlow?.length || 0} STAGES
                  </span>
                </div>

                <div className="space-y-2.5 font-mono-tech text-xs">
                  {transmission.topologyFlow?.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 sm:p-4 rounded-none dark:bg-[#181110] bg-[#f8f6f3] border dark:border-white/[0.08] border-[#DCDEDD]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="px-2 py-0.5 rounded-none dark:bg-[#74483F]/25 bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] border dark:border-[#74483F]/35 border-[#74483F]/25 font-bold shrink-0">
                          STEP {step.stepNumber}
                        </span>
                        <div className="space-y-1 min-w-0 flex-1">
                          <span className="dark:text-white text-[#1c1817] font-bold block tracking-wide">
                            {step.name}
                          </span>
                          <p className="font-sans text-xs sm:text-sm dark:text-[#DCDEDD]/80 text-[#4B4643] font-light leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {transmission.designDecisions && transmission.designDecisions.length > 0 && (
                <div className="space-y-3">
                  <h5 className="font-mono-tech text-xs dark:text-[#DCDEDD]/60 text-[#4B4643] uppercase tracking-wider font-semibold">
                    DESIGN TRADEOFFS &amp; ARCHITECTURAL DECISIONS
                  </h5>
                  <div className="space-y-3">
                    {transmission.designDecisions.map((decision, dIdx) => (
                      <div
                        key={dIdx}
                        className="p-4 rounded-none dark:bg-[#150f0e] bg-white border dark:border-white/[0.08] border-[#DCDEDD] space-y-2"
                      >
                        <div className="flex items-start gap-2">
                          <span className="font-mono-tech text-xs dark:text-[#c68477] text-[#74483F] font-bold">Q:</span>
                          <h6 className="font-mono-tech text-xs dark:text-white text-[#1c1817] font-semibold">
                            {decision.question}
                          </h6>
                        </div>
                        <p className="font-sans text-xs sm:text-sm dark:text-[#DCDEDD]/85 text-[#4B4643] font-light leading-relaxed pl-5">
                          {decision.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'spec' && (
            <div className="space-y-4 animate-fade-in">
              <p className="dark:text-[#DCDEDD]/90 text-[#4B4643] text-xs sm:text-sm font-light">
                {specSnippet.description}
              </p>

              <div className="relative dark:bg-[#070505] bg-[#f8f6f3] border dark:border-[#74483F]/35 border-[#74483F]/25 rounded-[10px] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b dark:border-white/[0.08] border-[#DCDEDD] dark:bg-[#140e0d] bg-[#f0ece7] font-mono-tech text-xs">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F]" />
                    <span className="dark:text-white text-[#1c1817] font-semibold">
                      {specSnippet.fileName}
                    </span>
                  </div>

                  <button
                    onClick={handleCopySpec}
                    className="flex items-center gap-1.5 text-[11px] dark:text-[#DCDEDD] text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] dark:bg-white/[0.06] bg-[#4B4643]/10 hover:bg-[#74483F]/20 px-2.5 py-1 rounded-none transition-colors cursor-pointer border dark:border-white/[0.06] border-[#DCDEDD]"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 dark:text-[#c68477] text-[#74483F]" />
                        <span>COPY SPEC</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 font-mono-tech text-xs dark:text-[#DCDEDD] text-[#1c1817] overflow-x-auto whitespace-pre leading-relaxed max-h-80 custom-scrollbar">
                  {specSnippet.codeSnippet}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'stack' && (
            <div className="space-y-4 animate-fade-in">
              <div className="dark:bg-[#181110] bg-[#f8f6f3] border dark:border-white/[0.06] border-[#DCDEDD] p-4 rounded-[10px] space-y-1">
                <span className="font-mono-tech text-[10px] uppercase tracking-wider dark:text-[#c68477] text-[#74483F] font-semibold block">
                  TECH STACK &amp; INTEGRATIONS
                </span>
                <p className="dark:text-[#DCDEDD]/90 text-[#4B4643] text-xs sm:text-sm font-light">
                  Decoupled layers, frameworks, and APIs powering the agent graph.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {transmission.techStack.map((technology) => (
                  <div
                    key={technology}
                    className="flex items-center gap-2 font-mono-tech text-xs px-3.5 py-2 rounded-none dark:bg-[#181110] bg-[#f8f6f3] dark:text-[#DCDEDD] text-[#1c1817] border dark:border-white/[0.08] border-[#DCDEDD]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F] shrink-0" />
                    <span className="font-medium">{technology}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 p-4 sm:p-5 border-t dark:border-white/[0.08] border-[#DCDEDD] dark:bg-[#181110] bg-[#faf8f6] flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono-tech text-xs dark:text-[#DCDEDD]/70 text-[#4B4643]">
            DOMAIN: <span className="dark:text-[#c68477] text-[#74483F] font-semibold">{transmission.primaryDomain}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsFullscreen(!isFullscreen);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-none text-xs font-mono-tech dark:text-[#DCDEDD]/80 text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] dark:bg-white/[0.03] bg-[#4B4643]/5 hover:bg-[#4B4643]/10 border dark:border-white/[0.08] border-[#DCDEDD] transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>RESTORE</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>FULL_SCREEN</span>
                </>
              )}
            </button>

            <a
              href={transmission.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="flex items-center gap-2 px-4 py-2 rounded-none text-xs font-mono-tech font-semibold dark:text-white text-[#1c1817] dark:bg-[#251a18] bg-[#f0ece7] hover:bg-[#74483F]/20 dark:hover:bg-[#32221f] border dark:border-[#74483F]/50 border-[#74483F]/35 transition-colors duration-150 shadow-sm cursor-pointer"
            >
              <Github className="w-4 h-4" />
              <span>VIEW_ON_GITHUB</span>
              <ArrowUpRight className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F]" />
            </a>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-none text-xs font-mono-tech dark:text-[#DCDEDD]/80 text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] dark:bg-white/[0.03] bg-[#4B4643]/5 hover:bg-[#4B4643]/10 border dark:border-white/[0.08] border-[#DCDEDD] transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}
      <ImageLightboxModal
        isOpen={isImageLightboxOpen}
        imageSrc={transmission.previewImage || null}
        title={`${transmission.title} - Full Interface Screenshot (1024×639)`}
        onClose={() => setIsImageLightboxOpen(false)}
      />
    </>
  );
};
