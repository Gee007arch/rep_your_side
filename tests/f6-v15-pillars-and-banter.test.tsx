import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PassportProvider, type ModalState } from '../src/context/PassportContext';
import { HomePage } from '../src/features/home/HomePage';
import { DiscoverPage } from '../src/features/discover/DiscoverPage';
import { PulsePage } from '../src/features/pulse/PulsePage';
import { ModalHost } from '../src/app/ModalHost';
import { fresh } from '../src/domain/model';
import {
  INITIAL_FAV_ASSESSMENTS,
  INITIAL_RIVALRY_ROOMS,
  INITIAL_DERBY_FIXTURES,
  INITIAL_INSTITUTIONS
} from '../src/data/rivalryData';

function renderView(ui: React.ReactElement, modal: ModalState = null) {
  return renderToStaticMarkup(
    <PassportProvider
      initialState={fresh()}
      initialModal={modal}
      ports={{
        browserServices: {
          copyText: async () => true,
          isOnline: () => true,
          subscribeOnlineStatus: () => () => {}
        }
      }}
    >
      {ui}
    </PassportProvider>
  );
}

describe('Phase F6: v1.5 Major Pillars, First-Visit Fav Assessments, Players/Celebs Banter & Derbies', () => {
  it('seeds abundant data across Fav Assessments, Rivalry Rooms, Derbies, and Campus/Alumni', () => {
    expect(INITIAL_FAV_ASSESSMENTS.length).toBeGreaterThanOrEqual(4);
    expect(INITIAL_RIVALRY_ROOMS.length).toBeGreaterThanOrEqual(6);
    expect(INITIAL_DERBY_FIXTURES.length).toBeGreaterThanOrEqual(4);
    expect(INITIAL_INSTITUTIONS.length).toBeGreaterThanOrEqual(14);
  });

  it('predominantly renders First-Visit "Your Feel About Your Fav" and all Major Pillars on HomePage', () => {
    const html = renderView(<HomePage onNavigate={() => {}} />);

    // First-Visit Instant Play widget
    expect(html).toContain('FIRST-VISIT INSTANT PLAY · YOUR FEEL ABOUT YOUR FAV');
    expect(html).toContain('Pick your Fav, rate the vibe &amp; claim your Receipt.');
    expect(html).toContain('Victor Osimhen');
    expect(html).toContain('Ademola Lookman');
    expect(html).toContain('Bukayo Saka');
    expect(html).toContain('Cole Palmer');

    // Pillar 1: Flagship & Neighbourhood Derbies
    expect(html).toContain('Flagship Abuja vs Lagos &amp; Neighbourhood Derbies');
    expect(html).toContain('Abuja vs Lagos: The Flagship Inter-City Derby');
    expect(html).toContain('Yaba vs Surulere: Mainland Classic Derby');
    expect(html).toContain('Gwarinpa vs Wuse: Capital Heavyweights Derby');

    // Pillar 2: Football Clubs & Players Banter
    expect(html).toContain('Matchday Rivalry Rooms &amp; Players Banter');
    expect(html).toContain('Arsenal vs Chelsea: London Rivalry Room');

    // Pillar 3: Artists, Celebrities & Culture
    expect(html).toContain('Afrobeats Royalty, Box Office Queens &amp; Creator Icons');
    expect(html).toContain('Wizkid FC vs 30BG vs Outsiders');
    expect(html).toContain('Tems &amp; Ayra Starr vs Rema &amp; Asake');
    expect(html).toContain('Funke Akindele &amp; Toyin Abraham vs Sabinus &amp; Mr Macaroni');

    // Pillar 4: Nationwide Campus & Secondary School Alumni
    expect(html).toContain('Represent Your Campus or Former Secondary School');
    expect(html).toContain('UNILAG');
    expect(html).toContain('King’s College');
    expect(html).toContain('Queen’s College');
    expect(html).toContain('Loyola Jesuit');
  });

  it('renders In-Page Rivalry Rooms for Players Banter and Artists/Celebrities inside subpage-shell', () => {
    const playersHtml = renderView(<ModalHost />, {
      type: 'rivalry-room',
      roomId: 'room-osimhen-lookman'
    });
    expect(playersHtml).toContain('class="subpage-shell wide-dialog"');
    expect(playersHtml).toContain('Victor Osimhen vs Ademola Lookman');
    expect(playersHtml).toContain('VO9 Brigade');
    expect(playersHtml).toContain('Mola Nation');
    expect(playersHtml).toContain('BANTER OF THE MATCH');
    expect(playersHtml).toContain('Call Out a Rival');

    const artistsHtml = renderView(<ModalHost />, {
      type: 'rivalry-room',
      roomId: 'room-big3-afrobeats'
    });
    expect(artistsHtml).toContain('Wizkid FC vs 30BG vs Outsiders');
    expect(artistsHtml).toContain('Wizkid FC');
    expect(artistsHtml).toContain('30BG');
    expect(artistsHtml).toContain('Outsiders');
  });

  it('renders In-Page Derby Match view with accuracy scoreboard and Side locking', () => {
    const derbyHtml = renderView(<ModalHost />, {
      type: 'derby',
      derbyId: 'derby-abuja-vs-lagos'
    });
    expect(derbyHtml).toContain('Abuja vs Lagos: The Flagship Inter-City Derby');
    expect(derbyHtml).toContain('OFFICIAL QUALIFYING DERBY');
    expect(derbyHtml).toContain('Team Lagos (Eko)');
    expect(derbyHtml).toContain('Team Abuja (Capital)');
    expect(derbyHtml).toContain('STEP 1 · CHOOSE &amp; LOCK YOUR ELIGIBLE SIDE');
  });

  it('renders In-Page Campus & Secondary School Alumni directory and extended Discover/Pulse items', () => {
    const campusHtml = renderView(<ModalHost />, {
      type: 'institutions',
      initialKind: 'campus'
    });
    expect(campusHtml).toContain('NATIONWIDE CAMPUS EDITION');
    expect(campusHtml).toContain('University of Lagos (UNILAG)');
    expect(campusHtml).toContain('University of Ibadan (UI)');
    expect(campusHtml).toContain('Obafemi Awolowo University (OAU)');
    expect(campusHtml).toContain('Ahmadu Bello University (ABU)');

    const discoverHtml = renderView(<DiscoverPage />);
    expect(discoverHtml).toContain('Nike Art Gallery &amp; Cultural Centre');
    expect(discoverHtml).toContain('Kalakuta Republic Museum');
    expect(discoverHtml).toContain('Tarkwa Bay Waterfront');

    const pulseHtml = renderView(<PulsePage />);
    expect(pulseHtml).toContain('How Yaba bridged campuses and code.');
    expect(pulseHtml).toContain('The geometry and stories dyed into Adire.');
  });
});

