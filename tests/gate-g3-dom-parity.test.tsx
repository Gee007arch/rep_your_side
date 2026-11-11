import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PassportProvider, type ModalState } from '../src/context/PassportContext';
import { AppShell } from '../src/app/AppShell';
import { ModalHost } from '../src/app/ModalHost';
import { HomePage } from '../src/features/home/HomePage';
import { PlayPage } from '../src/features/play/PlayPage';
import { DiscoverPage } from '../src/features/discover/DiscoverPage';
import { PulsePage } from '../src/features/pulse/PulsePage';
import { CirclesPage } from '../src/features/circles/CirclesPage';
import { PassportPage } from '../src/features/passport/PassportPage';
import { fresh, award } from '../src/domain/model';
import type { PilotPassportV1, StorageIssue } from '../src/domain/types';

function renderWithPassport(
  ui: React.ReactElement,
  options?: {
    state?: PilotPassportV1;
    issue?: StorageIssue;
    modal?: ModalState;
    online?: boolean;
  }
) {
  return renderToStaticMarkup(
    <PassportProvider
      initialState={options?.state ?? fresh()}
      initialIssue={options?.issue ?? null}
      initialModal={options?.modal ?? null}
      ports={{
        browserServices: {
          copyText: async () => true,
          isOnline: () => options?.online ?? true,
          subscribeOnlineStatus: () => () => {}
        }
      }}
    >
      {ui}
    </PassportProvider>
  );
}

describe('Gate G3: DOM-Structure, Copy, and CSS Selector Parity across All Views & Modals', () => {
  it('verifies AppShell DOM structure, navigation rail, skip link, banners, and footer', () => {
    const html = renderWithPassport(<AppShell />);
    expect(html).toContain('id="app"');
    expect(html).toContain('<a class="skip" href="#main">Skip to content</a>');
    expect(html).toContain('id="side-nav"');
    expect(html).toContain('aria-label="Main navigation"');
    expect(html).toContain('class="workspace"');
    expect(html).toContain('class="topbar"');
    expect(html).toContain('id="main"');
    expect(html).toContain('<footer>');
    expect(html).toContain('Private pilot · About your data');
    expect(html).toContain('Made for Lagos &amp; Abuja. With love.');
  });

  it('verifies storage issue banner (load and save) and offline banner rendering in AppShell', () => {
    const loadHtml = renderWithPassport(<AppShell />, { issue: 'load' });
    expect(loadHtml).toContain('class="banner error" role="alert"');
    expect(loadHtml).toContain('Saved progress could not be read. We have opened a fresh session without overwriting the old save.');

    const saveHtml = renderWithPassport(<AppShell />, { issue: 'save' });
    expect(saveHtml).toContain('class="banner error" role="alert"');
    expect(saveHtml).toContain('Your browser could not save progress. Your current session is still here.');

    const offlineHtml = renderWithPassport(<AppShell />, { online: false });
    expect(offlineHtml).toContain('id="offline" class="banner"');
    expect(offlineHtml).toContain('You’re offline. Loaded games still work; external source links need a connection.');
  });

  it('verifies HomePage DOM structure and child combinators (.hero-art>svg) for Lagos and Abuja', () => {
    const lagosState = fresh();
    const lagosHtml = renderWithPassport(<HomePage onNavigate={() => {}} />, { state: lagosState });
    expect(lagosHtml).toContain('class="hero"');
    expect(lagosHtml).toMatch(/<div class="hero-art"><svg viewBox="0 0 600 360"/);
    expect(lagosHtml).toContain('Eko for show!');
    expect(lagosHtml).toContain('Pick your side');
    expect(lagosHtml).toContain('Your next little adventure');
    expect(lagosHtml).toContain('Around your side');

    const abujaState = fresh();
    abujaState.city = 'abuja';
    abujaState.area = 'Wuse';
    const abujaHtml = renderWithPassport(<HomePage onNavigate={() => {}} />, { state: abujaState });
    expect(abujaHtml).toMatch(/<div class="hero-art"><svg viewBox="0 0 600 360"/);
    expect(abujaHtml).toContain('Capital energy!');
    expect(abujaHtml).toContain('WUSE, THIS IS YOUR SIDE');
    expect(abujaHtml).toContain('Wuse · Abuja');
  });

  it('verifies PlayPage DOM structure, three-cards grid, story card, and Street Sense card', () => {
    const html = renderWithPassport(<PlayPage />);
    expect(html).toContain('class="play-intro"');
    expect(html).toContain('class="three-cards"');
    expect(html).toContain('How well do you');
    expect(html).toContain('STREET SENSE');
    expect(html).toContain('The Postcard');
    expect(html).toContain('Little things. Real participation.');
  });

  it('verifies DiscoverPage DOM structure, discovery-banner art, filter row, search form, and place cards', () => {
    const html = renderWithPassport(<DiscoverPage />);
    expect(html).toContain('class="discovery-banner"');
    expect(html).toContain('id="search-form"');
    expect(html).toContain('class="filter-row"');
    expect(html).toContain('3 discoveries in Lagos');
    expect(html).toContain('Lekki Conservation Centre');
  });

  it('verifies PulsePage DOM structure, pulse-heading, filter chips, and curated pulse cards', () => {
    const html = renderWithPassport(<PulsePage />);
    expect(html).toContain('class="pulse-heading"');
    expect(html).toContain('class="pulse-list"');
    expect(html).toContain('IBILE: five divisions, one Lagos.');
    expect(html).toContain('Know the stops before you go.');
  });

  it('verifies CirclesPage DOM structure, circle cards, and community promise trigger', () => {
    const html = renderWithPassport(<CirclesPage />);
    expect(html).toContain('class="circle-hero"');
    expect(html).toContain('class="circle-grid"');
    expect(html).toContain('Through Our Lens');
    expect(html).toContain('The Slow Lane');
    expect(html).toContain('Side Hustle Society');
    expect(html).toContain('One More Chapter');
    expect(html).toContain('Read the community promise');
  });

  it('verifies PassportPage DOM structure (.passport-layout, stamps, saved places, drafts)', () => {
    const s = fresh();
    s.city = 'lagos';
    s.area = 'Yaba';
    s.nickname = 'Chidi';
    s.saved.push('lcc');
    award(s, 'discovery:lcc', 10);
    s.drafts.push({
      id: 'lcc',
      kind: 'place',
      title: 'Lekki Conservation Centre',
      text: 'Updated canopy walk schedule for rainy season.',
      date: Date.now()
    });

    const html = renderWithPassport(<PassportPage onNavigate={() => {}} />, { state: s });
    expect(html).toContain('class="passport-layout"');
    expect(html).toContain('<section class="passport">');
    expect(html).toContain('Chidi');
    expect(html).toContain('Yaba · Lagos');
    expect(html).toContain('class="stamp-shelf"');
    expect(html).toContain('class="stamps"');
    expect(html).toContain('FIRST ROUND');
    expect(html).toContain('LOCAL CURIOSITY');
    expect(html).toContain('STORY SEEKER');
    expect(html).toContain('BOTH CITIES');
    expect(html).toContain('My correction drafts');
    expect(html).toContain('Updated canopy walk schedule for rainy season.');
  });

  it('verifies all 20 modal states render cleanly with exact titles and structural classes', () => {
    const s = fresh();
    s.area = 'Ikoyi';
    const dummyRound = {
      city: 'lagos',
      type: 'city',
      key: 'lagos:city:starter-v1',
      practice: false,
      index: 0,
      selected: null,
      checked: false
    };

    const modalCases: [ModalState, string][] = [
      [{ type: 'side' }, 'Where’s your side?'],
      [{ type: 'quiz', roundType: 'city' }, 'Lagos in five'],
      [{ type: 'quiz', roundType: 'street' }, 'Street Sense'],
      [{ type: 'result', score: 4, gained: 60, round: dummyRound }, 'You showed up for your Side.'],
      [{ type: 'review', round: dummyRound }, 'Every answer is a little discovery.'],
      [{ type: 'share', round: dummyRound }, 'A little challenge for a friend.'],
      [{ type: 'story' }, 'The Postcard Trail'],
      [{ type: 'activity', id: 'lens' }, 'A little moment of participation.'],
      [{ type: 'place', id: 'lcc' }, 'Lekki Conservation Centre'],
      [{ type: 'pulse', id: 'lg-rail' }, 'Know the stops before you go.'],
      [{ type: 'circle', id: 'lens' }, 'Through Our Lens'],
      [{ type: 'community' }, 'Big love for every Side.'],
      [{ type: 'correction', id: 'lcc', kind: 'place' }, 'Help make the little details better.'],
      [{ type: 'guide' }, 'Your area. Your people. Your stories.'],
      [{ type: 'settings' }, 'Your pilot. Your progress.'],
      [{ type: 'export' }, 'Keep a little backup.'],
      [{ type: 'restore' }, 'Bring your discoveries back.'],
      [{ type: 'confirm-restore', pending: s }, 'This is the Passport we found.'],
      [{ type: 'storage' }, 'Your progress has a way back.'],
      [{ type: 'raw-save' }, 'Your previous stored save.'],
      [{ type: 'reset' }, 'Start a fresh little adventure?']
    ];

    for (const [modal, expectedTitle] of modalCases) {
      const html = renderWithPassport(<ModalHost />, { state: s, modal });
      expect(html).toContain('id="modal-title"');
      expect(html).toContain(expectedTitle);
    }
  });
});
