import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PassportProvider } from '../src/context/PassportContext';
import { AppShell } from '../src/app/AppShell';
import { HomePage } from '../src/features/home/HomePage';
import { CirclesPage } from '../src/features/circles/CirclesPage';
import { CircleDialog } from '../src/features/circles/CircleDialog';
import { INITIAL_COMMUNITY_FEED, SIDE_STANDINGS, CIRCLE_SOCIAL_STATS } from '../src/data/community';
import { fresh, award } from '../src/domain/model';

describe('Live Community Feed, User Engagement, Side Metrics & In-Page Views', () => {
  it('renders Live on your side feed, city participation metrics, and Side standings on HomePage for Lagos', () => {
    const state = fresh();
    state.city = 'lagos';
    state.area = 'Surulere';
    state.nickname = 'Ayo';
    award(state, 'round:lagos:city:starter-v1', 70);

    const html = renderToStaticMarkup(
      <PassportProvider initialState={state}>
        <HomePage onNavigate={() => {}} />
      </PassportProvider>
    );

    expect(html).toContain('Live on your side');
    expect(html).toContain('ACTIVE IN LAGOS');
    expect(html).toContain('ACTIVE EXPLORERS');
    expect(html).toContain('COLLECTIVE SIDE XP');
    expect(html).toContain('DISCOVERIES LOGGED');
    expect(html).toContain('COMMUNITY VIBES');
    expect(html).toContain('Most active Sides in Lagos');
    expect(html).toContain('YOUR SIDE');
    expect(html).toContain('Tunde A.');
    expect(html).toContain('Kemi O.');
    expect(html).toContain('Show love');
    expect(html).toContain('Rep Side');
  });

  it('renders Abuja live feed and Abuja Side standings when switched to Abuja edition', () => {
    const state = fresh();
    state.city = 'abuja';
    state.area = 'Wuse';
    state.nickname = 'Amina';

    const html = renderToStaticMarkup(
      <PassportProvider initialState={state}>
        <HomePage onNavigate={() => {}} />
      </PassportProvider>
    );

    expect(html).toContain('ACTIVE IN ABUJA');
    expect(html).toContain('Most active Sides in Abuja');
    expect(html).toContain('Amina K.');
    expect(html).toContain('Ibrahim D.');
    expect(html).toContain('Ushafa Pottery Centre');
  });

  it('renders Circle member counts, avatar stacks, and shared reflections in CirclesPage and CircleDialog', () => {
    const state = fresh();
    state.city = 'lagos';
    state.interests = ['lens'];

    const circlesHtml = renderToStaticMarkup(
      <PassportProvider initialState={state}>
        <CirclesPage />
      </PassportProvider>
    );
    expect(circlesHtml).toContain('circle-member-strip');
    expect(circlesHtml).toContain('reflections');

    const dialogHtml = renderToStaticMarkup(
      <PassportProvider initialState={state}>
        <CircleDialog id="lens" />
      </PassportProvider>
    );
    expect(dialogHtml).toContain('Recent neighbour reflections');
    expect(dialogHtml).toContain('Kemi O.');
    expect(dialogHtml).toContain('Show love');
  });

  it('renders Place, Pulse, and Circle details as normal in-page subpages inside <main> instead of <dialog> popups', () => {
    const state = fresh();
    state.city = 'lagos';

    const placePageHtml = renderToStaticMarkup(
      <PassportProvider initialState={state} initialModal={{ type: 'place', id: 'lcc' }}>
        <AppShell />
      </PassportProvider>
    );
    expect(placePageHtml).not.toContain('<dialog');
    expect(placePageHtml).toContain('class="subpage-shell wide-dialog"');
    expect(placePageHtml).toContain('Back to My Side');
    expect(placePageHtml).toContain('Lekki Conservation Centre');
  });

  it('provides complete seeded standings and social stats for all cities and circles', () => {
    expect(SIDE_STANDINGS.lagos.length).toBeGreaterThanOrEqual(8);
    expect(SIDE_STANDINGS.abuja.length).toBeGreaterThanOrEqual(8);
    expect(INITIAL_COMMUNITY_FEED.length).toBeGreaterThanOrEqual(10);
    expect(Object.keys(CIRCLE_SOCIAL_STATS)).toEqual(['lens', 'green', 'makers', 'books']);
  });
});
