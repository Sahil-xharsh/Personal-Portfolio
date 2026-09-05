import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Mail, Check, X as CloseIcon, Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundFx } from '../utils/audioHaptics';
import { SpecularButton } from './SpecularButton/SpecularButton';
import { useTheme } from '../context/ThemeContext';

type SubmissionStatus = 'idle' | 'success' | 'error';

class Web3FormsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Web3FormsError';
  }
}

export const ContactSection: React.FC = () => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHandHovered, setIsHandHovered] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    contactInfo: '',
    projectDetails: ''
  });
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleCopyEmail = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    soundFx.playClick();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const resetForm = () => {
    setStatus('idle');
    setStatusMessage('');
    setIsModalOpen(false);
    setFormState({ name: '', contactInfo: '', projectDetails: '' });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name || !formState.contactInfo || !formState.projectDetails) return;

    const formData = new FormData(event.currentTarget);
    const honeypot = String(formData.get('website') ?? '');
    setIsSubmitting(true);
    setStatus('idle');
    setStatusMessage('');
    soundFx.playClick();

    try {
      if (honeypot.trim()) {
        formData.delete('website');
        await new Promise((resolve) => setTimeout(resolve, 400));
        setStatus('success');
        setStatusMessage('Thanks for reaching out! I\'ll get back to you soon.');
        event.currentTarget.reset();
        setFormState({ name: '', contactInfo: '', projectDetails: '' });
        setTimeout(resetForm, 2500);
        return;
      }

      // This cooldown is easily bypassed by clearing storage; real abuse prevention
      // should come from Web3Forms captcha or a server-side proxy.
      const lastSubmit = Number(localStorage.getItem('cf_last_submit') ?? 0);
      if (lastSubmit && Date.now() - lastSubmit < 30_000) {
        setStatus('error');
        setStatusMessage('Please wait a moment before sending another message.');
        return;
      }

      const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
      if (!accessKey) {
        throw new Web3FormsError('The contact form is temporarily unavailable.');
      }

      formData.delete('website');
      formData.append('access_key', accessKey);
      formData.append('_subject', 'New portfolio contact form submission');
      const email = String(formData.get('email') ?? '').trim();
      if (email) formData.append('_replyto', email);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      let data: { success?: boolean; message?: string };
      try {
        data = await response.json();
      } catch {
        throw new Web3FormsError('Non-JSON response from Web3Forms.');
      }

      if (!response.ok || data.success !== true) {
        throw new Web3FormsError(data.message || 'Unable to send your message.');
      }

      localStorage.setItem('cf_last_submit', String(Date.now()));
      setStatus('success');
      setStatusMessage('Thanks for reaching out! I\'ll get back to you soon.');
      event.currentTarget.reset();
      setFormState({ name: '', contactInfo: '', projectDetails: '' });
      setTimeout(resetForm, 2500);
    } catch (error) {
      setStatus('error');
      setStatusMessage(
        error instanceof Web3FormsError
          ? error.message
          : 'Network error, please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isModalOpen && (
        <div
          id="contact-modal-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-none dark:bg-[#120e0d] bg-white border dark:border-white/[0.12] border-[#DCDEDD] p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_30px_rgba(116,72,63,0.15)] z-10 my-auto"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-none dark:text-[#DCDEDD]/60 text-[#4B4643] hover:text-[#1c1817] dark:hover:text-white dark:hover:bg-white/10 hover:bg-[#4B4643]/10 transition-colors cursor-pointer"
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

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center space-y-3 text-center"
                >
                  <div className="w-12 h-12 rounded-none dark:bg-emerald-500/20 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold dark:text-white text-[#1c1817]">Message Sent Successfully</h4>
                  <p className="text-xs dark:text-[#DCDEDD]/70 text-[#4B4643]">{statusMessage}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="website"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <div>
                    <label className="block text-xs font-mono-tech dark:text-[#DCDEDD]/70 text-[#4B4643] mb-1.5">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={isSubmitting}
                      value={formState.name}
                      onChange={(event) => setFormState({ ...formState, name: event.target.value })}
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
                      name="email"
                      required
                      disabled={isSubmitting}
                      value={formState.contactInfo}
                      onChange={(event) => setFormState({ ...formState, contactInfo: event.target.value })}
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
                      name="message"
                      disabled={isSubmitting}
                      rows={3}
                      value={formState.projectDetails}
                      onChange={(event) => setFormState({ ...formState, projectDetails: event.target.value })}
                      placeholder="Describe the problem, pipeline, or AI agent you want to build..."
                      className="w-full px-4 py-2.5 rounded-none dark:bg-white/[0.04] bg-white border dark:border-white/[0.1] border-[#DCDEDD] dark:text-white text-[#1c1817] text-sm focus:outline-none dark:focus:border-[#c68477] focus:border-[#74483F] transition-colors resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p role="alert" className="text-xs text-red-500 text-center">{statusMessage}</p>
                  )}

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
  );

  return (
    <section
      id="contact"
      data-section="contact"
      className="relative min-h-[80vh] flex flex-col justify-center items-center pt-20 sm:pt-28 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 dark:bg-[#060404] bg-[#faf8f6] overflow-hidden select-none scroll-mt-20 transition-colors duration-300"
    >
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(116,72,63,0.18),transparent_80%)] bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(116,72,63,0.08),transparent_80%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center space-y-8 sm:space-y-10">

        <div className="flex items-center justify-center">
          <motion.div
            id="handshake-icon-badge"
            onMouseEnter={() => {
              setIsHandHovered(true);
              soundFx.playHover();
            }}
            onMouseLeave={() => setIsHandHovered(false)}
            className={`group relative p-4 rounded-full dark:bg-[#120e0d] bg-white border transition-all duration-300 select-none ${
              isHandHovered
                ? 'dark:border-[#c68477]/80 border-[#74483F]/80 shadow-[0_0_28px_rgba(116,72,63,0.45)] scale-110'
                : 'dark:border-[#74483F]/30 border-[#DCDEDD] shadow-[0_0_20px_rgba(116,72,63,0.15)] hover:border-[#74483F]/60'
            }`}
          >
            <motion.div
              initial={false}
              animate={
                isHandHovered
                  ? { scale: [0, 1.5, 0], opacity: [0, 0.8, 0] }
                  : { scale: 0, opacity: 0 }
              }
              transition={{ duration: 0.4 }}
              className="absolute inset-0 m-auto w-8 h-8 rounded-full dark:bg-[#c68477]/30 bg-[#74483F]/20 blur-md pointer-events-none"
            />

            <motion.div
              animate={
                isHandHovered
                  ? { scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex items-center justify-center relative z-10"
            >
              <Handshake className="w-7 h-7 sm:w-8 sm:h-8 dark:text-[#c68477] text-[#74483F] transition-colors" />
            </motion.div>
          </motion.div>
        </div>

        <div className="space-y-1">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold dark:text-white text-[#1c1817] tracking-[-0.03em] uppercase leading-[0.95] text-center font-sans">
            INTERESTED IN
          </h2>
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-[-0.03em] uppercase leading-[0.95] text-center font-sans dark:text-white text-[#1c1817]">
            WORKING <span className="dark:text-[#c68477] text-[#74483F] drop-shadow-[0_0_35px_rgba(116,72,63,0.45)]">TOGETHER?</span>
          </h2>
        </div>

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
              setIsModalOpen(true);
              setStatus('idle');
              setStatusMessage('');
            }}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold border dark:border-white/[0.18] border-[#DCDEDD] hover:dark:border-[#c68477]/80 hover:border-[#74483F]/70 hover:shadow-[0_0_20px_rgba(116,72,63,0.3)] cursor-pointer active:scale-95 transition-all"
          >
            <span className="dark:text-white text-[#1c1817] font-medium tracking-wide">Get in Touch</span>
          </SpecularButton>
        </div>

        <div className="pt-2 flex flex-col items-center">
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

      </div>

      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </section>
  );
};
