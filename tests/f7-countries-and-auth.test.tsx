import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PassportProvider } from '../src/context/PassportContext';
import { AuthDialog } from '../src/features/auth/AuthDialog';
import { SideDialog } from '../src/features/side/SideDialog';
import { AppShell } from '../src/app/AppShell';
import { ModalHost } from '../src/app/ModalHost';
import { FirstVisitFavWidget } from '../src/features/home/FirstVisitFavWidget';
import { MajorPillarsSection } from '../src/features/home/MajorPillarsSection';
import { InstitutionsDialog } from '../src/features/rivalry/InstitutionsDialog';
import { PassportPage } from '../src/features/passport/PassportPage';
import { COUNTRIES, MAIN_COUNTRY_LIST } from '../src/data/countries';
import { fresh } from '../src/domain/model';

function renderInProvider(ui: React.ReactElement, initialModal?: any) {
  return renderToStaticMarkup(
    <PassportProvider
      initialState={fresh()}
      initialModal={initialModal}
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

describe('Phase F7: Countries (USA, Canada, UK, Nigeria, Others) & Login/Registration Profiling', () => {
  it('has valid CountryConfig entries for USA, CANADA, UK, NIGERIA, and OTHERS with diaspora hubs', () => {
    expect(COUNTRIES.USA.name).toContain('United States (USA)');
    expect(COUNTRIES.USA.flag).toBe('🇺🇸');
    expect(COUNTRIES.USA.hubs).toContain('Houston, TX');
    expect(COUNTRIES.USA.hubs).toContain('Atlanta, GA');

    expect(COUNTRIES.CANADA.name).toContain('Canada');
    expect(COUNTRIES.CANADA.flag).toBe('🇨🇦');
    expect(COUNTRIES.CANADA.hubs).toContain('Toronto (GTA), ON');
    expect(COUNTRIES.CANADA.hubs).toContain('Calgary, AB');

    expect(COUNTRIES.UK.name).toContain('United Kingdom (UK)');
    expect(COUNTRIES.UK.flag).toBe('🇬🇧');
    expect(COUNTRIES.UK.hubs).toContain('South London (Peckham / Lewisham)');

    expect(COUNTRIES.NIGERIA.name).toBe('Nigeria');
    expect(COUNTRIES.NIGERIA.flag).toBe('🇳🇬');

    expect(COUNTRIES.OTHERS.name).toContain('Others (Global)');
    expect(COUNTRIES.OTHERS.flag).toBe('🌍');

    expect(MAIN_COUNTRY_LIST.length).toBe(5);
  });

  it('renders Country Switcher in AppShell topbar and sidebar navigation', () => {
    const html = renderInProvider(<AppShell />);
    // Topbar country pill
    expect(html).toContain('class="country-pill-btn"');
    expect(html).toContain('class="country-flag-icon"');
    // Topbar and sidebar auth buttons
    expect(html).toContain('Log In');
    expect(html).toContain('Log In / Register');
  });

  it('renders Country Selection chips in SideDialog so user can pick diaspora country hub', () => {
    const html = renderInProvider(<SideDialog />);
    expect(html).toContain('DIASPORA &amp; COUNTRY JURISDICTION');
    expect(html).toContain('🇺🇸 USA');
    expect(html).toContain('🇨🇦 Canada');
    expect(html).toContain('🇬🇧 UK');
    expect(html).toContain('🇳🇬 Nigeria');
    expect(html).toContain('🌍 Others');
    expect(html).toContain('id="side-form"');
  });

  it('renders Country Jurisdiction selector bar in FirstVisitFavWidget on HomePage', () => {
    const html = renderInProvider(<FirstVisitFavWidget />);
    expect(html).toContain('Repping Jurisdiction:');
    expect(html).toContain('🇺🇸 USA');
    expect(html).toContain('🇨🇦 Canada');
    expect(html).toContain('🇬🇧 UK');
    expect(html).toContain('🇳🇬 Nigeria');
    expect(html).toContain('🌍 Others');
    expect(html).toContain('Hub:');
  });

  it('renders Country Filter chips and country diaspora derbies in MajorPillarsSection', () => {
    const html = renderInProvider(<MajorPillarsSection />);
    expect(html).toContain('Filter Arena by Country:');
    expect(html).toContain('🌐 All Countries');
    expect(html).toContain('🇺🇸 USA');
    expect(html).toContain('🇨🇦 Canada');
    expect(html).toContain('🇬🇧 UK');

    // Verified diaspora derbies
    expect(html).toContain('Houston (H-Town) vs Atlanta (ATL): USA Hub Derby');
    expect(html).toContain('South London vs North &amp; East London: UK Derby');
    expect(html).toContain('Toronto (GTA / Brampton) vs Calgary &amp; Edmonton: Canada Derby');
  });

  it('renders Diaspora chapters filter in Campus & Alumni InstitutionsDialog', () => {
    const html = renderInProvider(<InstitutionsDialog initialKind="alumni" />);
    expect(html).toContain('🌐 All Chapters');
    expect(html).toContain('🇺🇸 USA');
    expect(html).toContain('🇨🇦 Canada');
    expect(html).toContain('🇬🇧 UK');
    expect(html).toContain('UNILAG Alumni North America (USA Chapter)');
    expect(html).toContain('King’s &amp; Queen’s College UK Chapter');
    expect(html).toContain('Unity Schools Alumni Canada');
  });

  it('renders dedicated in-page Country Landing Page inside ModalHost', () => {
    const html = renderInProvider(
      <ModalHost />,
      { type: 'country' }
    );
    expect(html).toContain('class="subpage-shell wide-dialog"');
    expect(html).toContain('Select Your Country &amp; Diaspora Hub');
    expect(html).toContain('class="country-landing-view"');
    expect(html).toContain('class="country-landing-grid"');
    expect(html).toContain('United States (USA)');
    expect(html).toContain('Canada');
    expect(html).toContain('United Kingdom (UK)');
    expect(html).toContain('Nigeria');
    expect(html).toContain('Others (Global)');
    expect(html).toContain('STEP 2: CHOOSE YOUR METROPOLITAN HUB');
    expect(html).toContain('FEATURED ARENA FOR');
    expect(html).toContain('Set as My Jurisdiction');
  });

  it('renders clean in-page Login mode inside AuthDialog and ModalHost without <dialog>', () => {
    const html = renderInProvider(
      <ModalHost />,
      { type: 'auth', initialMode: 'login' }
    );
    expect(html).toContain('class="subpage-shell wide-dialog"');
    expect(html).not.toContain('<dialog');
    expect(html).toContain('Log In to Rep Your Side');
    expect(html).toContain('class="auth-dialog-content"');
    expect(html).toContain('id="login-email"');
    expect(html).toContain('id="login-pass"');

    // 1-Tap Seeded Demo Logins
    expect(html).toContain('INSTANT TESTING &amp; DEMO PROFILES');
    expect(html).toContain('ToluHTX');
    expect(html).toContain('Houston, TX');
    expect(html).toContain('KemiLDN');
    expect(html).toContain('South London');
    expect(html).toContain('ChukaGTA');
    expect(html).toContain('Toronto (GTA)');
  });

  it('renders full in-page Registration & Profiling form with Country and Favs in AuthDialog', () => {
    const html = renderInProvider(
      <AuthDialog initialMode="register" />
    );
    expect(html).toContain('Create Verified Profile &amp; Start Repping');
    expect(html).toContain('id="reg-name"');
    expect(html).toContain('id="reg-nickname"');
    expect(html).toContain('id="reg-email"');
    expect(html).toContain('id="reg-password"');

    // 5 Countries Choice Grid
    expect(html).toContain('class="country-selection-grid"');
    expect(html).toContain('United States (USA)');
    expect(html).toContain('Canada');
    expect(html).toContain('United Kingdom (UK)');
    expect(html).toContain('Nigeria');
    expect(html).toContain('Others (Global)');

    // Local Hub / Area dropdown & Edition
    expect(html).toContain('id="reg-hub"');
    expect(html).toContain('id="reg-city-edition"');

    // Profiling for Football, Artist/Celeb, Campus & Bio
    expect(html).toContain('id="reg-football"');
    expect(html).toContain('id="reg-artist"');
    expect(html).toContain('id="reg-alma"');
    expect(html).toContain('id="reg-bio"');
    expect(html).toContain('Create Verified Profile &amp; Start Repping');
  });

  it('renders Country Jurisdiction and Account Status on PassportPage', () => {
    const html = renderInProvider(<PassportPage onNavigate={() => {}} />);
    expect(html).toContain('COUNTRY &amp; JURISDICTION');
    expect(html).toContain('GLOBAL VERIFICATION &amp; COUNTRY JURISDICTION');
    expect(html).toContain('GUEST SESSION');
    expect(html).toContain('Log In / Register Profile');
  });
});

