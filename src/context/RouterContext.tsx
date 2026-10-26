import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

export type RouteInfo =
  | { type: 'home'; sectionId?: string }
  | { type: 'blog-series-list' }
  | { type: 'blog-series'; seriesSlug: string }
  | { type: 'blog-post'; seriesSlug: string; sectionSlug: string; postSlug: string };

interface RouterContextValue {
  path: string;
  route: RouteInfo;
  navigate: (to: string, options?: { replace?: boolean; scroll?: boolean }) => void;
  navigateToSection: (sectionId: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function parsePath(pathname: string): RouteInfo {
  // Normalize path
  const clean = pathname.replace(/\/+$/, '') || '/';

  if (clean === '/') {
    return { type: 'home' };
  }

  if (clean === '/blog') {
    return { type: 'blog-series-list' };
  }

  const parts = clean.split('/').filter(Boolean);
  // parts: ['blog', ...rest]
  if (parts[0] === 'blog') {
    if (parts.length === 2) {
      return { type: 'blog-series', seriesSlug: parts[1] };
    }
    if (parts.length >= 4) {
      return {
        type: 'blog-post',
        seriesSlug: parts[1],
        sectionSlug: parts[2],
        postSlug: parts[3],
      };
    }
  }

  // Fallback to home for any unknown path
  return { type: 'home' };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean; scroll?: boolean }) => {
      const scroll = options?.scroll ?? true;

      if (options?.replace) {
        window.history.replaceState(null, '', to);
      } else {
        window.history.pushState(null, '', to);
      }

      setPath(to.split('#')[0] || '/');

      if (scroll) {
        const hash = to.includes('#') ? to.split('#')[1] : null;
        if (hash) {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    []
  );

  const navigateToSection = useCallback(
    (sectionId: string) => {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
        setPath('/');
        setTimeout(() => {
          const target = document.getElementById(sectionId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          } else if (sectionId === 'hero' || sectionId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 80);
      } else {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        } else if (sectionId === 'hero' || sectionId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    },
    []
  );

  const route = useMemo(() => parsePath(path), [path]);

  const value = useMemo(
    () => ({
      path,
      route,
      navigate,
      navigateToSection,
    }),
    [path, route, navigate, navigateToSection]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
}
