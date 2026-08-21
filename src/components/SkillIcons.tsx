import React from 'react';

export const getSkillIcon = (name: string): React.ReactNode => {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (normalized) {
    case 'python':
      return (
        <svg className="w-4 h-4 text-[#38bdf8]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.9 2C6.7 2 7 4.2 7 4.2v2.3h5v.7H4.4S2 6.9 2 12.1s2.1 4.9 2.1 4.9h1.3v-2.4s-.1-2.9 2.8-2.9h4.9s2.7.1 2.7-2.6V4.7S16.1 2 11.9 2zM9.5 3.7c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zM12.1 22c5.2 0 4.9-2.2 4.9-2.2v-2.3h-5v-.7h7.6s2.4.3 2.4-4.9-2.1-4.9-2.1-4.9h-1.3v2.4s.1 2.9-2.8 2.9h-4.9s-2.7-.1-2.7 2.6v4.4s-.3 2.7 3.9 2.7zm2.4-1.7c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z" />
        </svg>
      );
    case 'numpy':
      return (
        <svg className="w-4 h-4 text-[#38bdf8]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.8 3.8L12 11.8 5.2 8 12 4.2zM4.8 9.5l6.2 3.5v7.5l-6.2-3.5V9.5zm14.4 7.5l-6.2 3.5V13l6.2-3.5v7.5z" />
        </svg>
      );
    case 'pytorch':
      return (
        <svg className="w-4 h-4 text-[#EE4C2C]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 2.2a1 1 0 0 0-1.2.2L9.1 5.3A7.5 7.5 0 1 0 16.8 15a7.5 7.5 0 0 0-2.3-5.4l.7-.7a1 1 0 0 0-.2-1.5l-1.5-.9zm-1.5 5.5l1.6 1.6a5.5 5.5 0 1 1-2.9-1.2l1.3-.4zM16.5 4a1 1 0 1 1-1-1 1 1 0 0 1 1 1z" />
        </svg>
      );
    case 'scikitlearn':
      return (
        <svg className="w-4 h-4 text-[#F7931E]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9c3.16 0 5.95-1.63 7.54-4.11l-2.6-1.5C15.82 17.06 14.03 18 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c2.03 0 3.82.94 4.94 2.61l2.6-1.5C17.95 4.63 15.16 3 12 3z" />
        </svg>
      );
    case 'pandas':
      return (
        <svg className="w-4 h-4 text-[#818CF8]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 4h3v16H7V4zm7 3h3v13h-3V7zm-3.5 4h3v9h-3v-9zm10.5 2h-3v7h3v-7zM3.5 8h3v12h-3V8z" />
        </svg>
      );
    case 'opencv':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4" className="stroke-red-500 fill-red-500/30" />
          <circle cx="7" cy="16" r="4" className="stroke-green-500 fill-green-500/30" />
          <circle cx="17" cy="16" r="4" className="stroke-blue-500 fill-blue-500/30" />
        </svg>
      );
    case 'langchain':
      return (
        <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case 'langgraph':
      return (
        <svg className="w-4 h-4 dark:text-[#c68477] text-[#74483F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="3" fill="currentColor" />
          <circle cx="18" cy="6" r="3" fill="currentColor" />
          <circle cx="12" cy="18" r="3" fill="currentColor" />
          <line x1="8" y1="7" x2="16" y2="7" />
          <line x1="7" y1="8.5" x2="11" y2="16" />
          <line x1="17" y1="8.5" x2="13" y2="16" />
        </svg>
      );

    case 'docker':
      return (
        <svg className="w-4 h-4 text-[#2496ED]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 4h3v3h-3V4zm-4 0h3v3H9V4zM5 8h3v3H5V8zm4 0h3v3H9V8zm4 0h3v3h-3V8zm4 0h3v3h-3V8zM1 11h22c0 6-5 9-11 9-5.5 0-9.8-3.6-11-9z" />
        </svg>
      );
    case 'streamlit':
      return (
        <svg className="w-4 h-4 text-[#FF4B4B]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5L2 19.5h20L12 2.5zm0 4.2l6.8 11.3H5.2L12 6.7z" />
        </svg>
      );
    case 'aws':
      return (
        <svg className="w-4 h-4 text-[#FF9900]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.8 13.5l1.6-4.5h2.1l1.7 4.5H10.5l-.3-1H8.7l-.3 1H6.8zm2.2-2.3h1l-.5-1.5-.5 1.5zm6.5 2.3l-1.3-4.5h1.9l.8 3.2.8-3.2h1.9l-1.3 4.5h-2.8zM4 17.5c4.7 2.4 11.3 2.4 16 0 .3-.2.6.2.3.4-5 3-12 3-17 0-.2-.2.2-.5.7-.4z" />
        </svg>
      );
    case 'gcp':
    case 'googlecloud':
      return (
        <svg className="w-4 h-4 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
      );
    case 'cicd':
      return (
        <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9" />
          <polyline points="15 6 18 9 21 6" />
          <line x1="6" y1="9" x2="6" y2="15" />
        </svg>
      );

    case 'fastapi':
      return (
        <svg className="w-4 h-4 text-[#009688]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 12h6v8l10-10h-6V2z" />
        </svg>
      );
    case 'mysql':
      return (
        <svg className="w-4 h-4 text-[#4479A1]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C7 3 3 6.5 3 11c0 3.2 2.1 6 5.3 7.2l-.7 2.8 3.4-1.7c.3.1.7.1 1 .1 5 0 9-3.5 9-8s-4-8-9-8zm0 14c-4 0-7.3-2.7-7.3-6S8 5 12 5s7.3 2.7 7.3 6-3.3 6-7.3 6z" />
        </svg>
      );
    case 'uv':
      return (
        <svg className="w-4 h-4 text-[#DE5FE9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 4v8a6 6 0 0 0 12 0V4" />
        </svg>
      );

    case 'javascript':
    case 'js':
      return (
        <span className="w-4 h-4 rounded bg-[#F7DF1E]/25 border border-[#F7DF1E] flex items-center justify-center font-mono font-bold text-[9px] text-[#F7DF1E]">
          JS
        </span>
      );
    case 'typescript':
    case 'ts':
      return (
        <span className="w-4 h-4 rounded bg-[#3178C6]/25 border border-[#3178C6] flex items-center justify-center font-mono font-bold text-[9px] text-[#3178C6]">
          TS
        </span>
      );
    case 'react':
      return (
        <svg className="w-4 h-4 text-[#61DAFB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'html5':
    case 'html':
      return (
        <svg className="w-4 h-4 text-[#E34F26]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 3l1.8 20.2L12 26l8.2-2.8L22 3H2zm16 5.5h-8l.3 3.5h7.4l-.8 8.5L12 21.8l-4.9-1.3-.3-4h2.5l.2 2 2.5.7 2.5-.7.4-4.5H6.8L6 6.5h12.3l-.3 2z" />
        </svg>
      );
    case 'css3':
    case 'css':
      return (
        <svg className="w-4 h-4 text-[#1572B6]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 3l1.8 20.2L12 26l8.2-2.8L22 3H2zm16.5 5.5H7.5l.3 3.5h8.4l-.8 8.5L12 21.8l-3.4-.9-.2-2.6H6l.4 4.5L12 24l5.6-1.5 1-11.5.2-2.5z" />
        </svg>
      );
    case 'tailwindcss':
    case 'tailwind':
      return (
        <svg className="w-4 h-4 text-[#06B6D4]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
        </svg>
      );
    case 'nextjs':
    case 'next':
      return (
        <svg className="w-4 h-4 dark:text-white text-[#1c1817]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );

    case 'figma':
      return (
        <svg className="w-4 h-4 text-[#F24E1E]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 2c2.2 0 4 1.8 4 4v2H8c-2.2 0-4-1.8-4-4s1.8-4 4-4zm8 0c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V6c0-2.2 1.8-4 4-4zM8 10h4v4H8c-2.2 0-4-1.8-4-4s1.8-4 4-4zm8 0c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4v-4h4zM8 18h4v4c-2.2 0-4-1.8-4-4z" />
        </svg>
      );
    case 'adobexd':
    case 'xd':
      return (
        <span className="w-4 h-4 rounded bg-[#FF61F6]/25 border border-[#FF61F6] flex items-center justify-center font-mono font-bold text-[8px] text-[#FF61F6]">
          Xd
        </span>
      );
    case 'illustrator':
    case 'ai':
      return (
        <span className="w-4 h-4 rounded bg-[#FF9A00]/25 border border-[#FF9A00] flex items-center justify-center font-mono font-bold text-[8px] text-[#FF9A00]">
          Ai
        </span>
      );
    case 'blender':
      return (
        <svg className="w-4 h-4 text-[#E87D0D]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1.5 14.5a3.5 3.5 0 1 1 3.5-3.5 3.5 3.5 0 0 1-3.5 3.5zm-5-6a2 2 0 1 1 2-2 2 2 0 0 1-2 2z" />
        </svg>
      );
    case 'aftereffects':
    case 'ae':
      return (
        <span className="w-4 h-4 rounded bg-[#9999FF]/25 border border-[#9999FF] flex items-center justify-center font-mono font-bold text-[8px] text-[#9999FF]">
          Ae
        </span>
      );
    case 'premierepro':
    case 'pr':
      return (
        <span className="w-4 h-4 rounded bg-[#9999FF]/25 border border-[#9999FF] flex items-center justify-center font-mono font-bold text-[8px] text-[#9999FF]">
          Pr
        </span>
      );
    case 'audition':
    case 'au':
      return (
        <span className="w-4 h-4 rounded bg-[#00E4BB]/25 border border-[#00E4BB] flex items-center justify-center font-mono font-bold text-[8px] text-[#00E4BB]">
          Au
        </span>
      );
    case 'photoshop':
    case 'ps':
      return (
        <span className="w-4 h-4 rounded bg-[#31A8FF]/25 border border-[#31A8FF] flex items-center justify-center font-mono font-bold text-[8px] text-[#31A8FF]">
          Ps
        </span>
      );
    case 'sonyvegas':
    case 'vegas':
      return (
        <span className="w-4 h-4 rounded dark:bg-[#74483F]/30 bg-[#74483F]/15 border dark:border-[#c68477] border-[#74483F] flex items-center justify-center font-mono font-bold text-[8px] dark:text-[#c68477] text-[#74483F]">
          SV
        </span>
      );
    case 'davinciresolve':
    case 'resolve':
      return (
        <svg className="w-4 h-4 text-[#DE342F]" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="8" r="2" />
          <circle cx="8.5" cy="14" r="2" />
          <circle cx="15.5" cy="14" r="2" />
        </svg>
      );

    default:
      return (
        <span className="w-2 h-2 rounded-full dark:bg-[#c68477] bg-[#74483F] opacity-80" />
      );
  }
};
