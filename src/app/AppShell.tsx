import { useState, useEffect } from 'react';
import type { PageRoute } from '../domain/types';
import { CITIES } from '../data/fixtures';
import { COUNTRIES } from '../data/countries';
import { Icon } from '../ui/icons';
import { usePassport } from '../context/PassportContext';
import { useHashRoute } from './useHashRoute';
import { ModalHost } from './ModalHost';
import { ToastHost } from './ToastHost';
import { HomePage } from '../features/home/HomePage';
import { PlayPage } from '../features/play/PlayPage';
import { DiscoverPage } from '../features/discover/DiscoverPage';
import { PulsePage } from '../features/pulse/PulsePage';
import { CirclesPage } from '../features/circles/CirclesPage';
import { PassportPage } from '../features/passport/PassportPage';

export function AppShell() {
  const {
    state,
    storageIssue,
    activeModal,
    menuOpen,
    setMenuOpen,
    isOffline,
    openModal,
    currentUser,
    selectedCountry
  } = usePassport();

  const { page, navigate } = useHashRoute();
  const currentCity = CITIES[state.city];

  const [isNarrowScreen, setIsNarrowScreen] = useState(
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-width: 720px)').matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(max-width: 720px)');
    const onChange = (e: MediaQueryListEvent) => setIsNarrowScreen(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const navItems: [PageRoute, string, string][] = [
    ['home', 'home', 'My Side'],
    ['play', 'play', 'Play & progress'],
    ['discover', 'compass', 'Discover'],
    ['pulse', 'pulse', 'City Pulse'],
    ['circles', 'users', 'Circles'],
    ['passport', 'passport', 'My Passport']
  ];

  const pageHeadings: Record<PageRoute, string> = {
    home: '',
    play: 'Ready, set, rep.',
    discover: 'Go a little off-script.',
    pulse: 'Know your city.',
    circles: 'Good company starts here.',
    passport: 'Your Side Passport.'
  };

  const pageSubtitles: Record<PageRoute, string> = {
    home: 'Your daily dose of local',
    play: 'A little play. A lot of discovery.',
    discover: 'There’s more on your side.',
    pulse: 'A little context goes a long way.',
    circles: 'Find your kind of people.',
    passport: 'Every discovery tells a story.'
  };

  return (
    <div id="app">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <aside
        id="side-nav"
        className={`sidebar ${menuOpen ? 'open' : ''}`.trim()}
        inert={isNarrowScreen && !menuOpen}
      >
        <button
          type="button"
          className="icon-btn close-menu"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        >
          <Icon name="close" />
        </button>

        <a
          href="#home"
          className="brand"
          aria-label="Rep Your Side home"
          onClick={(e) => {
            e.preventDefault();
            navigate('home');
          }}
        >
          <span className="brand-mark">
            R<span>↗</span>
          </span>
          <span>
            rep your
            <br />
            <b>
              side<span className="orange">.</span>
            </b>
          </span>
        </a>

        <div className="sidebar-label">YOUR LITTLE CORNER OF THE CITY</div>

        <nav aria-label="Main navigation">
          {navItems.map(([p, iconName, label]) => {
            const isActive = page === p;
            return (
              <a
                key={p}
                href={`#${p}`}
                className={`nav-item ${isActive ? 'active' : ''}`.trim()}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(p);
                }}
              >
                <Icon name={iconName} />
                <span>{label}</span>
                {p === 'play' ? <span className="nav-dot" /> : null}
              </a>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="side-note">
            <span className="little-sun">✳</span>
            <strong>
              Big love for
              <br />
              every side.
            </strong>
            <p>
              Curiosity brings us together.
              <br />
              Keep the banter kind.
            </p>
          </div>

          <button
            type="button"
            className="nav-item"
            onClick={() => openModal({ type: 'calendar' })}
          >
            <Icon name="clock" /> Public Calendar
          </button>
          <button
            type="button"
            className="nav-item"
            onClick={() => openModal({ type: 'country' })}
          >
            <span>{COUNTRIES[selectedCountry]?.flag || '🌍'}</span> Country ({COUNTRIES[selectedCountry]?.shortLabel || selectedCountry})
          </button>
          <button
            type="button"
            className="nav-item"
            onClick={() => openModal({ type: 'auth', initialMode: currentUser ? 'profile' : 'login' })}
          >
            <Icon name="users" /> {currentUser ? `${currentUser.nickname} (Profile)` : 'Log In / Register'}
          </button>
          <button
            type="button"
            className="nav-item"
            onClick={() => openModal({ type: 'guide' })}
          >
            <Icon name="help" /> How it works
          </button>
          <button
            type="button"
            className="nav-item"
            onClick={() => openModal({ type: 'settings' })}
          >
            <Icon name="settings" /> Pilot & privacy
          </button>

          <div className="private-label">
            <Icon name="shield" /> PRIVATE PILOT <span>01</span>
          </div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="top-left">
            <button
              type="button"
              className="icon-btn mobile-menu"
              aria-label="Toggle navigation"
              aria-controls="side-nav"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <Icon name="menu" />
            </button>

            <button
              type="button"
              className="location-button"
              onClick={() => openModal({ type: 'side' })}
            >
              <Icon name="pin" />
              <span>
                {currentCity.name}
                <b>{state.area ? state.area : 'Choose your side'}</b>
              </span>
              <Icon name="chevron" />
            </button>
            <button
              type="button"
              className="country-pill-btn"
              title="Choose Country & Hub (USA, Canada, UK, Nigeria, Others)"
              onClick={() => openModal({ type: 'country' })}
            >
              <span className="country-flag-icon">{COUNTRIES[selectedCountry]?.flag || '🌍'}</span>
              <span className="country-code-text">{COUNTRIES[selectedCountry]?.shortLabel || selectedCountry}</span>
            </button>
            <span className="edition-label">LAGOS + ABUJA EDITIONS</span>
          </div>

          <div className="top-right">
            <button
              type="button"
              className="help-btn auth-nav-btn"
              aria-label={currentUser ? 'My Profile' : 'Log In or Register'}
              onClick={() => openModal({ type: 'auth', initialMode: currentUser ? 'profile' : 'login' })}
            >
              <Icon name="users" />
              <span>{currentUser ? currentUser.nickname : 'Log In'}</span>
            </button>

            <button
              type="button"
              className="help-btn"
              aria-label="Public Calendar"
              onClick={() => openModal({ type: 'calendar' })}
            >
              <Icon name="clock" />
              <span>Calendar</span>
            </button>

            <button
              type="button"
              className="help-btn"
              aria-label="How to play"
              onClick={() => openModal({ type: 'guide' })}
            >
              <Icon name="help" />
              <span>How to play</span>
            </button>

            <button
              type="button"
              className="profile-dot"
              aria-label="Open my Passport"
              onClick={() => navigate('passport')}
            >
              {state.nickname.charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        <main id="main" tabIndex={-1}>
          {storageIssue ? (
            <div className="banner error" role="alert">
              <Icon name="refresh" />
              <span>
                {storageIssue === 'load'
                  ? 'Saved progress could not be read. We have opened a fresh session without overwriting the old save.'
                  : 'Your browser could not save progress. Your current session is still here.'}
              </span>
              <button
                type="button"
                onClick={() => openModal({ type: 'storage' })}
              >
                Recovery options
              </button>
            </div>
          ) : null}

          <div id="offline" className={`banner ${isOffline ? '' : 'hidden'}`.trim()}>
            <Icon name="help" /> You’re offline. Loaded games still work; external source links need a connection.
          </div>

          {activeModal ? (
            <ModalHost currentPage={page} onNavigate={navigate} />
          ) : (
            <>
              <div className="page-top">
                <div>
                  <div className="eyebrow">
                    {currentCity.name.toUpperCase()} EDITION <span className="dot-sep">/</span> PILOT SEASON 01
                  </div>
                  <h1>
                    {page === 'home' ? (
                      <>
                        What’s good, {state.nickname}? <span className="wave">✹</span>
                      </>
                    ) : (
                      pageHeadings[page]
                    )}
                  </h1>
                  <p>{pageSubtitles[page]}</p>
                </div>
                <div className="date-chip">
                  <Icon name="spark" /> A little more local, every day
                </div>
              </div>

              {page === 'home' ? (
                <HomePage onNavigate={navigate} />
              ) : page === 'play' ? (
                <PlayPage />
              ) : page === 'discover' ? (
                <DiscoverPage />
              ) : page === 'pulse' ? (
                <PulsePage />
              ) : page === 'circles' ? (
                <CirclesPage />
              ) : (
                <PassportPage onNavigate={navigate} />
              )}

              <ModalHost currentPage={page} onNavigate={navigate} />
            </>
          )}

          <footer>
            <span>
              <b>rep your side.</b> Your area. Your people. Your stories.
            </span>
            <button
              type="button"
              onClick={() => openModal({ type: 'settings' })}
            >
              Private pilot · About your data
            </button>
            <span>Made for Lagos & Abuja. With love.</span>
          </footer>
        </main>
      </div>

      <ToastHost />
    </div>
  );
}
