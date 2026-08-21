import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn } from 'lucide-react';
import { soundFx } from '../utils/audioHaptics';

interface ImageLightboxModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  imageAlt?: string;
  title?: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  imageSrc,
  imageAlt = 'Project Image Preview',
  title = 'Image Preview',
  onClose
}) => {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return createPortal(
    <div
      id="image-lightbox-backdrop"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-hidden animate-fade-in select-none"
      onClick={() => {
        soundFx.playClick();
        onClose();
      }}
    >
      <div
        id="image-lightbox-dialog"
        className="relative w-fit min-w-[300px] sm:min-w-[420px] max-w-[92vw] max-h-[92vh] flex flex-col rounded-xl overflow-hidden dark:bg-[#120e0d] bg-[#1a1514] border dark:border-white/[0.12] border-white/20 shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.95)] animate-scale-in text-left mx-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 flex items-center justify-between px-3.5 py-2.5 bg-[#181110] border-b dark:border-white/[0.08] border-white/10 text-xs font-mono-tech gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <ZoomIn className="w-3.5 h-3.5 dark:text-[#c68477] text-[#c68477] shrink-0" />
            <span className="dark:text-[#DCDEDD] text-white font-medium truncate max-w-xs sm:max-w-md">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden sm:inline-block text-[10px] dark:text-[#DCDEDD]/50 text-white/50">
              ESC
            </span>
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-1 rounded-lg text-white/70 hover:text-white bg-white/5 hover:bg-white/15 transition-colors cursor-pointer"
              title="Close (ESC)"
              aria-label="Close image preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 p-1 sm:p-2 flex items-center justify-center bg-[#070505] overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-auto h-auto max-w-[88vw] max-h-[80vh] object-contain rounded select-none shadow-lg block mx-auto"
          />
        </div>
      </div>
    </div>,
    document.body
  );
};
