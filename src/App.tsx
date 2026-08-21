import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { TransmissionsSection } from './components/TransmissionsSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { BlogPage } from './components/BlogPage';
import { ResumeModal } from './components/ResumeModal';
import { AgentConsoleModal } from './components/AgentConsoleModal';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'blog'>('home');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const handleNavigatePage = (page: 'home' | 'blog', sectionId?: string) => {
    const isAlreadyOnHome = currentPage === 'home';
    setCurrentPage(page);

    if (page === 'home') {
      const doScroll = () => {
        if (sectionId) {
          const targetSection = document.getElementById(sectionId);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          } else if (sectionId === 'hero' || sectionId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };

      if (isAlreadyOnHome) {
        doScroll();
      } else {
        setTimeout(doScroll, 50);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExploreWork = () => {
    const projectSection = document.getElementById('projects') || document.getElementById('transmissions');
    projectSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen dark:bg-[#060404] bg-[#faf8f6] dark:text-[#f9f9fa] text-[#1c1817] overflow-x-hidden transition-colors duration-300">
      <ScrollProgressBar activePage={currentPage} />

      <Navigation
        activePage={currentPage}
        onNavigatePage={handleNavigatePage}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      <main className="relative z-10">
        {currentPage === 'home' ? (
          <>
            <Hero
              onExploreWork={handleExploreWork}
              onOpenConsole={() => setIsConsoleOpen(true)}
            />
            <AboutSection />
            <TransmissionsSection />
            <SkillsSection />
            <ContactSection />
          </>
        ) : (
          <BlogPage
            onNavigateHome={() => handleNavigatePage('home')}
            onNavigateSection={(sec) => handleNavigatePage('home', sec)}
          />
        )}
      </main>

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      <AgentConsoleModal
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
