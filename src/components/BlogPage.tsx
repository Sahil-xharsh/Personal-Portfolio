import React, { useState } from 'react';
import { Mail, Check, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundFx } from '../utils/audioHaptics';
import { SpecularButton } from './SpecularButton/SpecularButton';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from '../context/RouterContext';
import { BlogSeriesList } from './blog/BlogSeriesList';
import { BlogSeriesDetail } from './blog/BlogSeriesDetail';
import { BlogPostDetail } from './blog/BlogPostDetail';

interface BlogPageProps {
  onNavigateHome?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = () => {
  const { theme } = useTheme();
  const { route } = useRouter();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    contactInfo: '',
    projectDetails: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    soundFx.playClick();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.name || !formState.contactInfo || !formState.projectDetails) return;

    setIsSubmitting(true);
    soundFx.playClick();

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsContactModalOpen(false);
        setFormState({ name: '', contactInfo: '', projectDetails: '' });
      }, 2500);
    }, 600);
  };

  return (
    <div
      id="blog-page-container"
      className="relative min-h-screen pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 z-10 flex flex-col justify-start"
    >
      {/* Route Views */}
      <div className="w-full">
        {route.type === 'blog-series-list' && <BlogSeriesList />}
        {route.type === 'blog-series' && (
          <BlogSeriesDetail seriesSlug={route.seriesSlug} />
        )}
        {route.type === 'blog-post' && (
          <BlogPostDetail
            seriesSlug={route.seriesSlug}
            sectionSlug={route.sectionSlug}
            postSlug={route.postSlug}
          />
        )}
      </div>

      {/* Persistent Bottom Contact Bar */}
      <div className="pt-16 pb-6 flex flex-col items-center space-y-4 max-w-2xl mx-auto w-full">
        <div>
          <SpecularButton
            radius={999}
            size="md"
            tint={theme === 'dark' ? '#150f0e' : '#ffffff'}
            tintOpacity={theme === 'dark' ? 0.9 : 0.98}
            blur={8}
            textColor={theme === 'dark' ? '#ffffff' : '#1c1817'}
            lineColor={theme === 'dark' ? '#c68477' : '#74483F'}
            baseColor={theme === 'dark' ? '#4a322d' : '#d0c8c4'}
            intensity={1.2}
            thickness={1.1}
            speed={0.35}
            followMouse={true}
            proximity={70}
            autoAnimate={false}
            onClick={() => {
              soundFx.playClick();
              setIsContactModalOpen(true);
            }}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold border dark:border-white/[0.18] border-[#DCDEDD] hover:dark:border-[#c68477]/80 hover:border-[#74483F]/70 hover:shadow-[0_0_20px_rgba(116,72,63,0.3)] cursor-pointer active:scale-95 transition-all"
          >
            <span className="dark:text-white text-[#1c1817] font-medium tracking-wide">
              Get in Touch
            </span>
          </SpecularButton>
        </div>

        <div className="flex items-center gap-1.5 p-1 pl-3.5 rounded-full dark:bg-[#120e0d]/90 bg-white border dark:border-white/[0.1] border-[#DCDEDD] shadow-sm backdrop-blur-md">
          <Mail className="w-4 h-4 dark:text-[#c68477] text-[#74483F] shrink-0" />
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            onClick={() => soundFx.playClick()}
            className="dark:text-[#DCDEDD] text-[#1c1817] hover:text-[#74483F] dark:hover:text-white text-xs sm:text-sm font-mono-tech transition-colors px-1"
          >
            {PERSONAL_INFO.email}
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="text-[11px] font-mono-tech font-medium px-3 py-1.5 rounded-full dark:bg-white/[0.06] bg-[#4B4643]/10 dark:text-[#DCDEDD] text-[#4B4643] hover:dark:bg-white/[0.12] hover:bg-[#4B4643]/15 dark:hover:text-white hover:text-[#1c1817] border dark:border-white/[0.08] border-[#DCDEDD] transition-colors duration-150 cursor-pointer active:scale-95 select-none shrink-0"
            title="Copy email to clipboard"
            aria-label="Copy email address"
          >
            <div className="flex items-center gap-1">
              {copiedEmail ? (
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> COPIED
                </span>
              ) : (
                'COPY'
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg rounded-none dark:bg-[#120e0d] bg-white border dark:border-white/[0.12] border-[#DCDEDD] p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_30px_rgba(116,72,63,0.15)] z-10"
            >
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-none dark:text-[#DCDEDD]/60 text-[#4B4643] hover:text-[#1c1817] dark:hover:text-white dark:hover:bg-white/10 hover:bg-[#4B4643]/10 transition-colors"
                aria-label="Close dialog"
              >
                <CloseIcon className="w-5 h-5" />
              </button>

              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-2xl font-bold dark:text-white text-[#1c1817] font-sans">
                    Let&apos;s Build Together
                  </h3>
                  <p className="text-sm dark:text-[#DCDEDD]/70 text-[#4B4643] mt-1 font-sans">
                    Drop your contact details and vision below. I&apos;ll respond within 24 hours.
                  </p>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 flex flex-col items-center justify-center space-y-3 text-center"
                  >
                    <div className="w-12 h-12 rounded-none dark:bg-emerald-500/20 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold dark:text-white text-[#1c1817]">
                      Message Sent Successfully
                    </h4>
                    <p className="text-xs dark:text-[#DCDEDD]/70 text-[#4B4643]">
                      Thanks for reaching out! I&apos;ll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono-tech dark:text-[#DCDEDD]/70 text-[#4B4643] mb-1.5">
                        YOUR NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(event) =>
                          setFormState({ ...formState, name: event.target.value })
                        }
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-none dark:bg-white/[0.04] bg-white border dark:border-white/[0.1] border-[#DCDEDD] dark:text-white text-[#1c1817] text-sm focus:outline-none dark:focus:border-[#c68477] focus:border-[#74483F] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tech dark:text-[#DCDEDD]/70 text-[#4B4643] mb-1.5">
                        EMAIL OR TELEGRAM HANDLE
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.contactInfo}
                        onChange={(event) =>
                          setFormState({ ...formState, contactInfo: event.target.value })
                        }
                        placeholder="john@example.com or @handle"
                        className="w-full px-4 py-2.5 rounded-none dark:bg-white/[0.04] bg-white border dark:border-white/[0.1] border-[#DCDEDD] dark:text-white text-[#1c1817] text-sm focus:outline-none dark:focus:border-[#c68477] focus:border-[#74483F] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tech dark:text-[#DCDEDD]/70 text-[#4B4643] mb-1.5">
                        PROJECT VISION OR MESSAGE
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formState.projectDetails}
                        onChange={(event) =>
                          setFormState({ ...formState, projectDetails: event.target.value })
                        }
                        placeholder="Describe the problem, pipeline, or AI agent you want to build..."
                        className="w-full px-4 py-2.5 rounded-none dark:bg-white/[0.04] bg-white border dark:border-white/[0.1] border-[#DCDEDD] dark:text-white text-[#1c1817] text-sm focus:outline-none dark:focus:border-[#c68477] focus:border-[#74483F] transition-colors resize-none"
                      />
                    </div>

                    <div className="flex justify-center pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-2.5 rounded-full dark:bg-[#74483F] bg-[#74483F] hover:bg-[#56332c] dark:hover:bg-[#8b554b] text-white text-xs sm:text-sm font-semibold tracking-wider transition-all shadow-[0_0_20px_rgba(116,72,63,0.3)] hover:shadow-[0_0_28px_rgba(116,72,63,0.5)] cursor-pointer disabled:opacity-50 active:scale-95"
                      >
                        {isSubmitting ? 'TRANSMITTING...' : 'SEND MESSAGE'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
