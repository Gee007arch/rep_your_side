import { useState, useEffect, useCallback } from 'react';
import type { PageRoute, CityId, RoundKind } from '../domain/types';
import { CITIES } from '../data/fixtures';
import { usePassport } from '../context/PassportContext';

const VALID_PAGES: PageRoute[] = ['home', 'play', 'discover', 'pulse', 'circles', 'passport'];

export function useHashRoute() {
  const {
    state,
    setMenuOpen,
    closeModal,
    openModal,
    resetFilters
  } = usePassport();

  const [page, setPage] = useState<PageRoute>('home');

  // Parse current location.hash
  const resolveHash = useCallback(
    (isInitial: boolean = false) => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setPage('home');
        return;
      }

      if (hash === 'main') {
        // Skip-link target, do not treat as route
        return;
      }

      const parts = hash.split('/');
      const rawRoot = parts[0];
      const rootPart = parts[0] as PageRoute;

      // Handle deep-link challenge route: #play/{city}/{kind}
      if (
        parts.length === 3 &&
        rootPart === 'play' &&
        CITIES[parts[1] as CityId] &&
        ['city', 'street'].includes(parts[2])
      ) {
        const city = parts[1] as CityId;
        const roundKind = parts[2] as RoundKind;

        if (isInitial) {
          // Direct entry sets background page to 'play'
          setPage('play');
          if (state.city !== city) {
            state.city = city;
            if (!CITIES[city].areas.includes(state.area)) {
              state.area = '';
            }
          }
          openModal({ type: 'quiz', roundType: roundKind });
        }
        return;
      }

      if (VALID_PAGES.includes(rootPart)) {
        setPage(rootPart);
      } else if (rawRoot === 'calendar' || rawRoot === 'derbies') {
        setPage('home');
        openModal({ type: 'calendar', initialFilter: parts[1] || 'all' });
      } else if (rawRoot === 'admin' || rawRoot === 'operator') {
        setPage('home');
        openModal({ type: 'operator-studio' });
      } else if (rawRoot === 'country') {
        setPage('home');
        openModal({ type: 'country' });
      } else if (rawRoot === 'login') {
        setPage('home');
        openModal({ type: 'auth', initialMode: 'login' });
      } else if (rawRoot === 'register') {
        setPage('home');
        openModal({ type: 'auth', initialMode: 'register' });
      } else if (rawRoot === 'profile') {
        setPage('home');
        openModal({ type: 'auth', initialMode: 'profile' });
      } else {
        setPage('home');
      }
    },
    [state, openModal]
  );

  useEffect(() => {
    // Initial resolution
    resolveHash(true);

    const handleHashChange = () => {
      closeModal();
      setMenuOpen(false);
      window.scrollTo(0, 0);
      resolveHash(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [resolveHash, closeModal, setMenuOpen]);

  // Explicit in-app navigation (D-07: resets filters and updates hash)
  const navigate = useCallback(
    (targetPage: PageRoute) => {
      closeModal();
      setMenuOpen(false);
      resetFilters();
      window.location.hash = targetPage;
      setPage(targetPage);
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [closeModal, setMenuOpen, resetFilters]
  );

  return {
    page,
    navigate
  };
}
