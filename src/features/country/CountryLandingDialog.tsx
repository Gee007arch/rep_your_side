import { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import {
  type CountryCode,
  COUNTRIES,
  MAIN_COUNTRY_LIST
} from '../../data/countries';
import { INITIAL_DERBY_FIXTURES } from '../../data/rivalryData';
import { Pill } from '../../ui/Pill';

const COUNTRY_PARTICIPATION_STATS: Record<CountryCode, { count: string; highlight: string; culturalFavs: string; alumniChapter: string }> = {
  USA: {
    count: '14,200+ Repping',
    highlight: 'Houston vs Atlanta (Naija Bowl)',
    culturalFavs: 'Osimhen · Burna Boy · Arsenal FC',
    alumniChapter: 'UNILAG Alumni North America (USA Chapter)'
  },
  CANADA: {
    count: '8,600+ Repping',
    highlight: 'Toronto GTA vs Calgary Derby',
    culturalFavs: 'Lookman · Asake · Man United',
    alumniChapter: 'Unity Schools Alumni Canada'
  },
  UK: {
    count: '19,500+ Repping',
    highlight: 'South London vs North & East Derby',
    culturalFavs: 'Bukayo Saka · Wizkid · Chelsea FC',
    alumniChapter: 'King’s & Queen’s College UK Chapter'
  },
  NIGERIA: {
    count: '52,800+ Repping',
    highlight: 'Abuja Unity vs Lagos City Derby',
    culturalFavs: 'Osimhen · Davido · Enyimba FC',
    alumniChapter: 'All Federal Universities & Secondary Schools'
  },
  OTHERS: {
    count: '6,400+ Repping',
    highlight: 'Global Diaspora Cross-Border Arena',
    culturalFavs: 'Asake · Tems · Real Madrid',
    alumniChapter: 'Worldwide Alumni Chapters Network'
  }
};

const POPULAR_OTHER_COUNTRIES = [
  'South Africa',
  'Ghana',
  'UAE (Dubai)',
  'Germany',
  'Ireland',
  'Kenya',
  'Australia'
];

export function CountryLandingDialog() {
  const {
    selectedCountry,
    selectedCountryHub,
    setSelectedCountry,
    openModal,
    closeModal,
    currentUser
  } = usePassport();

  const [activeCountry, setActiveCountry] = useState<CountryCode>(selectedCountry || 'USA');
  const [activeHub, setActiveHub] = useState<string>(
    () => selectedCountryHub || COUNTRIES[selectedCountry]?.hubs[0] || 'Houston, TX'
  );
  const [customCountryInput, setCustomCountryInput] = useState('');
  const [justApplied, setJustApplied] = useState(false);

  const currentConfig = COUNTRIES[activeCountry];
  const currentStats = COUNTRY_PARTICIPATION_STATS[activeCountry];

  const handleCountryPick = (code: CountryCode) => {
    setActiveCountry(code);
    const hubs = COUNTRIES[code].hubs;
    if (hubs && hubs.length > 0) {
      setActiveHub(hubs[0]);
    }
  };

  const handleOtherCountryChip = (countryName: string) => {
    setCustomCountryInput(countryName);
    setActiveHub(`${countryName} Metro`);
  };

  const handleApply = () => {
    const hubToSet = activeCountry === 'OTHERS' && customCountryInput.trim()
      ? `${customCountryInput.trim()} Metro`
      : activeHub;
    setSelectedCountry(activeCountry, hubToSet);
    setJustApplied(true);
    setTimeout(() => {
      closeModal();
    }, 400);
  };

  const handleRegisterWithCountry = () => {
    const hubToSet = activeCountry === 'OTHERS' && customCountryInput.trim()
      ? `${customCountryInput.trim()} Metro`
      : activeHub;
    setSelectedCountry(activeCountry, hubToSet);
    openModal({ type: 'auth', initialMode: 'register' });
  };

  // Find country's featured derby
  const featuredDerby =
    INITIAL_DERBY_FIXTURES.find((d) => {
      if (activeCountry === 'NIGERIA') return d.id === 'derby-abuja-vs-lagos';
      return d.countryCode === activeCountry;
    }) || INITIAL_DERBY_FIXTURES[0];

  return (
    <div className="country-landing-view">
      {/* Intro & Current Active Status */}
      <div className="country-intro-card">
        <div className="country-intro-header">
          <div className="country-intro-pills">
            <Pill variant="green-pill">GLOBAL EDITIONS &amp; DIASPORA JURISDICTIONS</Pill>
            <span className="country-live-status-pill">
              Active: {COUNTRIES[selectedCountry]?.flag} {COUNTRIES[selectedCountry]?.shortLabel} ({selectedCountryHub})
            </span>
          </div>
          <span className="country-total-counter">
            🌍 101.5k Supporters Worldwide
          </span>
        </div>

        <p className="country-lead-text">
          Represent your country of residence or diaspora community. Each jurisdiction connects you
          directly to live head-to-head derbies, regional alumni chapters, and hyper-local banter
          while preserving your home roots in Lagos or Abuja.
        </p>
      </div>

      {/* Main 5 Jurisdictions Cards Grid */}
      <div className="country-landing-grid">
        {MAIN_COUNTRY_LIST.map((country) => {
          const isSelected = activeCountry === country.code;
          const stats = COUNTRY_PARTICIPATION_STATS[country.code];

          return (
            <button
              key={country.code}
              type="button"
              className={`country-landing-card ${isSelected ? 'active' : ''}`}
              onClick={() => handleCountryPick(country.code)}
              aria-pressed={isSelected}
            >
              <div className="card-top-row">
                <span className="card-flag-badge">{country.flag}</span>
                <span className="card-stats-pill">{stats.count}</span>
              </div>

              <div className="card-title-group">
                <h3>{country.name}</h3>
                <span className="card-tagline">{country.tagline}</span>
              </div>

              <div className="card-hubs-preview">
                <strong>Key Hubs:</strong> {country.hubs.slice(0, 3).join(' · ')}
                {country.hubs.length > 3 ? ` +${country.hubs.length - 3} more` : ''}
              </div>

              <div className="card-derby-highlight">
                <span className="derby-icon">🏆</span>
                <span className="derby-text">{stats.highlight}</span>
              </div>

              {isSelected && (
                <div className="country-active-indicator">
                  <span className="dot" /> SELECTED JURISDICTION
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Country Specification when OTHERS is active */}
      {activeCountry === 'OTHERS' && (
        <div className="custom-country-box">
          <label htmlFor="custom-country-text" className="custom-country-label">
            Specify Your Country of Residence:
          </label>
          <input
            id="custom-country-text"
            type="text"
            value={customCountryInput}
            onChange={(e) => setCustomCountryInput(e.target.value)}
            placeholder="e.g. South Africa, Ghana, Ireland, Germany, UAE, Australia"
          />
          <div className="popular-others-row">
            <span className="popular-label">Popular diaspora picks:</span>
            {POPULAR_OTHER_COUNTRIES.map((cName) => (
              <button
                key={cName}
                type="button"
                className="sugg-chip"
                onClick={() => handleOtherCountryChip(cName)}
              >
                {cName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Choose Metropolitan Hub */}
      <div className="country-hubs-container">
        <div className="hubs-header">
          <div>
            <span className="eyebrow" style={{ color: '#183e35' }}>
              STEP 2: CHOOSE YOUR METROPOLITAN HUB
            </span>
            <h4 style={{ margin: '4px 0 0', fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', color: '#183e35' }}>
              {currentConfig.flag} {currentConfig.name} Cities &amp; Hubs
            </h4>
          </div>
          <span className="hubs-header-hint">
            Sets your local live feed, derby matches &amp; community banter
          </span>
        </div>

        <div className="chips hubs-chips-list">
          {currentConfig.hubs.map((hub) => {
            const isHubActive = activeHub === hub;
            return (
              <button
                key={hub}
                type="button"
                className={`chip ${isHubActive ? 'selected' : ''}`}
                onClick={() => setActiveHub(hub)}
              >
                {hub} {isHubActive ? '✓' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 3: What Opens Up For Your Chosen Country */}
      <div className="country-pillars-showcase">
        <div className="country-featured-box">
          <div className="featured-meta">
            <span className="eyebrow" style={{ color: '#8c6b2c' }}>
              FEATURED ARENA FOR {currentConfig.shortLabel.toUpperCase()}
            </span>
            <h4 style={{ margin: '4px 0 2px', fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', color: '#183e35' }}>
              {featuredDerby.title}
            </h4>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#555' }}>
              {featuredDerby.subtitle}
            </p>
          </div>
          <button
            type="button"
            className="btn outline"
            onClick={() => {
              setSelectedCountry(activeCountry, activeHub);
              openModal({ type: 'derby', derbyId: featuredDerby.id });
            }}
          >
            Open Fixture →
          </button>
        </div>

        <div className="country-secondary-features-grid">
          <div className="feature-subcard">
            <div className="feature-subcard-icon">🎓</div>
            <div className="feature-subcard-info">
              <span className="subcard-eyebrow">REGIONAL ALUMNI NETWORK</span>
              <strong>{currentStats.alumniChapter}</strong>
              <p>Connect with fellow alumni in {currentConfig.shortLabel} and vote in campus leagues.</p>
            </div>
            <button
              type="button"
              className="text-btn subcard-link"
              onClick={() => {
                setSelectedCountry(activeCountry, activeHub);
                openModal({ type: 'institutions', initialKind: 'alumni' });
              }}
            >
              Explore Chapters →
            </button>
          </div>

          <div className="feature-subcard">
            <div className="feature-subcard-icon">🔥</div>
            <div className="feature-subcard-info">
              <span className="subcard-eyebrow">POPULAR IN THIS JURISDICTION</span>
              <strong>{currentStats.culturalFavs}</strong>
              <p>Top repped ballers, creators &amp; clubs trending in {activeHub}.</p>
            </div>
            <button
              type="button"
              className="text-btn subcard-link"
              onClick={() => {
                setSelectedCountry(activeCountry, activeHub);
                openModal({ type: 'auth', initialMode: 'register' });
              }}
            >
              Profile Your Favs →
            </button>
          </div>
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="country-action-footer">
        <button
          type="button"
          className="btn primary country-set-btn"
          onClick={handleApply}
        >
          {justApplied
            ? '✓ Jurisdiction Applied!'
            : `Set as My Jurisdiction (${currentConfig.flag} ${currentConfig.shortLabel})`}
        </button>

        {!currentUser ? (
          <button
            type="button"
            className="btn outline"
            onClick={handleRegisterWithCountry}
          >
            Create Permanent Account for {currentConfig.shortLabel} 🚀
          </button>
        ) : (
          <button
            type="button"
            className="btn outline"
            onClick={() => openModal({ type: 'auth', initialMode: 'profile' })}
          >
            Manage Verified Profile (@{currentUser.nickname})
          </button>
        )}
      </div>
    </div>
  );
}
