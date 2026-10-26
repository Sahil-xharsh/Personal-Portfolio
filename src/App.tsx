import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { RouterProvider, useRouter } from './context/RouterContext';
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
  const { route, navigate, navigateToSection } = useRouter();
  const currentPage = route.type === 'home' ? 'home' : 'blog';
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const handleNavigatePage = (page: 'home' | 'blog', sectionId?: string) => {
    if (page === 'home') {
      navigateToSection(sectionId || 'hero');
    } else {
      navigate('/blog');
    }
  };

  const handleExploreWork = () => {
    navigateToSection('projects');
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
            onNavigateHome={() => navigateToSection('hero')}
            onNavigateSection={(sec) => navigateToSection(sec)}
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
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </ThemeProvider>
  );
}
