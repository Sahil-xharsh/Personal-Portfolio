import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, FileText, Mail, Github } from 'lucide-react';
import { PERSONAL_INFO, TRANSMISSIONS, CAREER_ARC } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const modalContent = (
    <div
      id="resume-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 dark:bg-black/85 bg-black/60 backdrop-blur-sm sm:backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        id="resume-modal-dialog"
        className="relative w-full max-w-3xl dark:bg-[#120e0d] bg-white border dark:border-[#74483F]/35 border-[#DCDEDD] rounded-[10px] shadow-2xl p-6 sm:p-8 text-left my-8 dark:text-[#DCDEDD] text-[#1c1817] space-y-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b dark:border-white/[0.08] border-[#DCDEDD]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 dark:text-[#c68477] text-[#74483F]" />
            <span className="font-mono-tech text-xs dark:text-white text-[#1c1817] font-semibold tracking-wider">
              CURRICULUM_VITAE SAHIL_HARSH
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono-tech glass dark:text-[#DCDEDD] text-[#4B4643] hover:border-[#74483F]/50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F]" />
              <span>PRINT / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded dark:text-[#DCDEDD]/70 text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] glass transition-colors cursor-pointer"
              aria-label="Close resume"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold dark:text-white text-[#1c1817] tracking-tight">Sahil Harsh</h2>
          <p className="text-sm font-mono-tech dark:text-[#c68477] text-[#74483F] font-semibold">
            AI/ML Engineer | Multimodal AI, Deep Learning &amp; MLOps
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono-tech dark:text-[#DCDEDD]/70 text-[#4B4643] pt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F]" />
              {PERSONAL_INFO.email}
            </span>
            <span className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5 dark:text-[#c68477] text-[#74483F]" />
              {PERSONAL_INFO.githubHandle}
            </span>
            <span>Location: India (Remote Global)</span>
          </div>
        </div>

        <div className="p-4 rounded-lg glass dark:border-white/[0.06] border-[#DCDEDD] text-xs sm:text-sm dark:text-[#DCDEDD] text-[#1c1817] font-light leading-relaxed">
          AI/ML Engineer working with multimodal AI through model fine-tuning, RAG, agents, inference, and evaluation. Combining ML research with practical engineering, deployment, and MLOps, alongside frontend development (TypeScript, React) and motion design.
        </div>

        <div className="space-y-2">
          <h3 className="font-mono-tech text-xs uppercase tracking-wider dark:text-[#c68477] text-[#74483F] font-semibold">
            CORE COMPETENCIES
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech">
            <div className="p-2.5 dark:bg-[#070505] bg-[#faf8f6] rounded border dark:border-white/[0.04] border-[#DCDEDD]">
              <span className="dark:text-white text-[#1c1817] font-bold block mb-1">Deep Learning &amp; Multimodal AI:</span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643]">Multimodal Models, Fine-Tuning, Inference, Evaluation, PyTorch, Neural Networks</span>
            </div>
            <div className="p-2.5 dark:bg-[#070505] bg-[#faf8f6] rounded border dark:border-white/[0.04] border-[#DCDEDD]">
              <span className="dark:text-white text-[#1c1817] font-bold block mb-1">MLOps &amp; Engineering:</span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643]">FastAPI, Docker, Model Deployment, Streamlit, Pipeline CI, Git</span>
            </div>
            <div className="p-2.5 dark:bg-[#070505] bg-[#faf8f6] rounded border dark:border-white/[0.04] border-[#DCDEDD]">
              <span className="dark:text-white text-[#1c1817] font-bold block mb-1">AI Agents &amp; RAG:</span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643]">LangGraph, LangChain, RAG Systems, TOON Prompting, OpenRouter</span>
            </div>
            <div className="p-2.5 dark:bg-[#070505] bg-[#faf8f6] rounded border dark:border-white/[0.04] border-[#DCDEDD]">
              <span className="dark:text-white text-[#1c1817] font-bold block mb-1">Frontend &amp; Motion Background:</span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643]">TypeScript, Next.js, React, TailwindCSS, Video Editing (6,000+ hrs)</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-mono-tech text-xs uppercase tracking-wider dark:text-[#c68477] text-[#74483F] font-semibold">
            FEATURED PROJECTS
          </h3>
          {TRANSMISSIONS.map((proj) => (
            <div key={proj.id} className="p-3 glass rounded-lg dark:border-white/[0.06] border-[#DCDEDD] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm dark:text-white text-[#1c1817]">{proj.title}</span>
              </div>
              <p className="text-xs dark:text-[#DCDEDD]/80 text-[#4B4643] font-light">{proj.summary}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {proj.techStack.map((technology) => (
                  <span key={technology} className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded dark:bg-white/[0.04] bg-[#4B4643]/10 dark:text-[#DCDEDD] text-[#4B4643]">
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="font-mono-tech text-xs uppercase tracking-wider dark:text-[#c68477] text-[#74483F] font-semibold">
            EXPERIENCE TRAJECTORY
          </h3>
          {CAREER_ARC.map((arc) => (
            <div key={arc.era} className="text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold dark:text-white text-[#1c1817]">{arc.role}</span>
                <span className="font-mono-tech dark:text-[#DCDEDD]/60 text-[#4B4643]">{arc.era}</span>
              </div>
              <div className="dark:text-[#c68477] text-[#74483F] font-mono-tech text-[11px] font-semibold">{arc.organization} | {arc.domain}</div>
              {arc.summary && <p className="dark:text-[#DCDEDD]/70 text-[#4B4643] font-light">{arc.summary}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
