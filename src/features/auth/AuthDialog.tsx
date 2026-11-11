import React, { useState } from 'react';
import { usePassport } from '../../context/PassportContext';
import {
  type CountryCode,
  COUNTRIES,
  MAIN_COUNTRY_LIST,
  type UserProfileAccount
} from '../../data/countries';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';

export interface AuthDialogProps {
  initialMode?: 'login' | 'register' | 'profile';
}

export function AuthDialog({ initialMode = 'login' }: AuthDialogProps) {
  const {
    currentUser,
    selectedCountry,
    selectedCountryHub,
    demoAccounts,
    setSelectedCountry,
    loginAccount,
    registerAccount,
    updateProfileAccount,
    logoutAccount,
    closeModal
  } = usePassport();

  const [mode, setMode] = useState<'login' | 'register' | 'profile'>(() => {
    if (currentUser) return 'profile';
    return initialMode;
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration form state
  const [regFullName, setRegFullName] = useState('');
  const [regNickname, setRegNickname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regCountry, setRegCountry] = useState<CountryCode>(selectedCountry || 'USA');
  const [regCustomCountry, setRegCustomCountry] = useState('');
  const [regHub, setRegHub] = useState(() => selectedCountryHub || COUNTRIES[selectedCountry]?.hubs[0] || 'Houston, TX');
  const [regCityEdition, setRegCityEdition] = useState<'lagos' | 'abuja'>('lagos');
  const [regFavFootball, setRegFavFootball] = useState('');
  const [regFavArtist, setRegFavArtist] = useState('');
  const [regAlmaMater, setRegAlmaMater] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  // Profile editing state
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editNickname, setEditNickname] = useState(currentUser?.nickname || '');
  const [editBio, setEditBio] = useState(currentUser?.bioNote || '');

  const handleCountryPick = (code: CountryCode) => {
    setRegCountry(code);
    const hubs = COUNTRIES[code].hubs;
    if (hubs && hubs.length > 0) {
      setRegHub(hubs[0]);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address.');
      return;
    }
    const res = loginAccount(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Failed to log in.');
    } else {
      setMode('profile');
    }
  };

  const handleQuickLogin = (demo: UserProfileAccount) => {
    setLoginError(null);
    const res = loginAccount(demo.email, 'demo123');
    if (res.success) {
      setMode('profile');
    } else {
      setLoginError(res.error || 'Demo login failed');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (!regFullName.trim()) {
      setRegError('Please provide your full name.');
      return;
    }
    if (!regNickname.trim()) {
      setRegError('Please choose a public callsign / nickname.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please enter a valid email address.');
      return;
    }
    if (regCountry === 'OTHERS' && !regCustomCountry.trim()) {
      setRegError('Please specify your country of residence.');
      return;
    }

    const payload: Omit<UserProfileAccount, 'id' | 'createdAt' | 'isVerified'> = {
      fullName: regFullName.trim(),
      nickname: regNickname.trim(),
      email: regEmail.trim(),
      country: regCountry,
      customCountryName: regCountry === 'OTHERS' ? regCustomCountry.trim() : undefined,
      hubOrArea: regHub.trim() || `${regCountry} Hub`,
      cityEdition: regCityEdition,
      favFootballerOrClub: regFavFootball.trim() || 'Victor Osimhen · Super Eagles',
      favArtistOrCeleb: regFavArtist.trim() || 'Burna Boy · Afrobeats',
      campusOrAlmaMater: regAlmaMater.trim() || 'UNILAG Alumni',
      bioNote: regBio.trim() || `Repping ${regCountry} & ${regCityEdition === 'lagos' ? 'Lagos' : 'Abuja'} roots.`
    };

    const res = registerAccount(payload);
    if (!res.success) {
      setRegError(res.error || 'Failed to register account.');
    } else {
      setMode('profile');
    }
  };

  const handleSaveProfileUpdates = () => {
    updateProfileAccount({
      nickname: editNickname.trim() || currentUser?.nickname,
      bioNote: editBio.trim() || currentUser?.bioNote
    });
    setIsEditingBio(false);
  };

  return (
    <div className="auth-dialog-content">
      {/* Sleek Segmented Switcher Bar */}
      <div className="auth-segmented-nav" role="tablist" aria-label="Account Access Options">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          className={`auth-seg-pill ${mode === 'login' ? 'active' : ''}`}
          onClick={() => setMode('login')}
        >
          <Icon name="passport" className="seg-icon" />
          <span>Sign In</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === 'register'}
          className={`auth-seg-pill ${mode === 'register' ? 'active' : ''}`}
          onClick={() => setMode('register')}
        >
          <Icon name="spark" className="seg-icon" />
          <span>Create Account</span>
        </button>

        {currentUser && (
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'profile'}
            className={`auth-seg-pill ${mode === 'profile' ? 'active' : ''}`}
            onClick={() => setMode('profile')}
          >
            <Icon name="shield" className="seg-icon" />
            <span>My Passport</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. LOGIN MODE */}
      {/* ========================================================================= */}
      {mode === 'login' && (
        <div className="auth-pro-shell">
          <div className="auth-card-panel">
            <div className="auth-panel-header">
              <span className="eyebrow" style={{ color: '#183e35' }}>
                VERIFIED ACCESS · MULTI-EDITION PASSPORT
              </span>
              <p className="auth-lead-text">
                Sign in to defend your diaspora jurisdiction, post verified banter in rivalry rooms, and preserve your competition receipts.
              </p>
            </div>

            {loginError && (
              <div className="auth-alert-error" role="alert">
                <span className="alert-badge">Error</span> {loginError}
              </div>
            )}

            <form className="auth-fields-stack" onSubmit={handleLoginSubmit}>
              <div className="form-group-field">
                <label htmlFor="login-email" className="field-label">
                  Email Address <span className="req-star">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="field-prefix-icon">✉</span>
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. tolu@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group-field">
                <div className="field-label-row">
                  <label htmlFor="login-pass" className="field-label">
                    Password <span className="req-star">*</span>
                  </label>
                  <button
                    type="button"
                    className="toggle-pass-btn"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                  >
                    {showLoginPassword ? 'Hide password' : 'Show password'}
                  </button>
                </div>
                <div className="input-with-icon">
                  <span className="field-prefix-icon">🔒</span>
                  <input
                    id="login-pass"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password (demo accounts use: demo123)"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn">
                <span>Sign In to My Passport</span>
                <span className="btn-arrow">→</span>
              </button>

              <div className="auth-switch-prompt">
                <span>Don’t have a verified account yet?</span>
                <button
                  type="button"
                  className="switch-action-link"
                  onClick={() => setMode('register')}
                >
                  Create an account in 1 min
                </button>
              </div>
            </form>
          </div>

          {/* Quick 1-Click Demo Testing Shelf */}
          <div className="auth-demo-shelf">
            <div className="demo-shelf-top">
              <div>
                <span className="eyebrow" style={{ color: '#8c6b2c' }}>
                  INSTANT TESTING &amp; DEMO PROFILES
                </span>
                <h4 style={{ margin: '3px 0 0', fontFamily: 'Outfit, sans-serif' }}>
                  Preview as a Verified Diaspora Supporter
                </h4>
              </div>
              <Pill variant="orange-pill">1-TAP LOGIN</Pill>
            </div>
            <p className="demo-shelf-desc">
              Test immediately with a pre-configured diaspora profile representing USA, UK, or Canada:
            </p>

            <div className="demo-accounts-grid">
              {demoAccounts.map((demo) => {
                const config = COUNTRIES[demo.country];
                return (
                  <div key={demo.id} className="demo-pro-card">
                    <div className="demo-pro-header">
                      <div className="demo-avatar-flag">{config?.flag || '🌍'}</div>
                      <div className="demo-meta">
                        <div className="demo-name-line">
                          <strong>{demo.fullName}</strong>
                          <span className="demo-handle">@{demo.nickname}</span>
                        </div>
                        <div className="demo-jurisdiction-tag">
                          {config?.shortLabel} · {demo.hubOrArea}
                        </div>
                      </div>
                    </div>

                    <div className="demo-affils-snippet">
                      <div className="affil-item">
                        <span className="affil-k">⚽ Fav:</span> {demo.favFootballerOrClub}
                      </div>
                      <div className="affil-item">
                        <span className="affil-k">🎵 Music:</span> {demo.favArtistOrCeleb}
                      </div>
                      <div className="affil-item">
                        <span className="affil-k">🎓 Alma:</span> {demo.campusOrAlmaMater}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="demo-select-btn"
                      onClick={() => handleQuickLogin(demo)}
                    >
                      Sign In as {demo.nickname} →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. REGISTRATION & PROFILING MODE */}
      {/* ========================================================================= */}
      {mode === 'register' && (
        <div className="auth-pro-shell">
          <div className="auth-card-panel">
            <div className="auth-panel-header">
              <span className="eyebrow" style={{ color: '#183e35' }}>
                JOIN THE PLATFORM · PERMANENT SUPPORTER CREDENTIAL
              </span>
              <p className="auth-lead-text">
                Hold multiple affiliations across Countries, Cities, Clubs &amp; Schools under one verified Passport. Complete all 3 sections below to start repping.
              </p>
            </div>

            {regError && (
              <div className="auth-alert-error" role="alert">
                <span className="alert-badge">Error</span> {regError}
              </div>
            )}

            <form className="auth-fields-stack" onSubmit={handleRegisterSubmit}>
              {/* SECTION 1: ACCOUNT CREDENTIALS */}
              <div className="wizard-step-pane" style={{ marginBottom: '24px' }}>
                <div className="pane-section-lead">
                  <h4>1. Account Identity</h4>
                  <p>Enter your full name and choose your public callsign for leaderboards and rivalry banter.</p>
                </div>

                <div className="two-cards" style={{ marginBottom: '14px' }}>
                  <div className="form-group-field">
                    <label htmlFor="reg-name" className="field-label">
                      Full Name <span className="req-star">*</span>
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Tolu Adeyemi"
                      required
                    />
                  </div>

                  <div className="form-group-field">
                    <label htmlFor="reg-nickname" className="field-label">
                      Public Callsign / Nickname <span className="req-star">*</span>
                    </label>
                    <input
                      id="reg-nickname"
                      type="text"
                      value={regNickname}
                      onChange={(e) => setRegNickname(e.target.value)}
                      placeholder="e.g. ToluHTX"
                      required
                    />
                    <span className="field-hint">Max 30 chars. Displayed on public banter &amp; receipts.</span>
                  </div>
                </div>

                <div className="two-cards" style={{ marginBottom: '18px' }}>
                  <div className="form-group-field">
                    <label htmlFor="reg-email" className="field-label">
                      Email Address <span className="req-star">*</span>
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. tolu@example.com"
                      required
                    />
                  </div>

                  <div className="form-group-field">
                    <div className="field-label-row">
                      <label htmlFor="reg-password" className="field-label">
                        Password
                      </label>
                      <button
                        type="button"
                        className="toggle-pass-btn"
                        onClick={() => setShowRegPassword((prev) => !prev)}
                      >
                        {showRegPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <input
                      id="reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a secure password"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: COUNTRY & DIASPORA HUB */}
              <div className="wizard-step-pane" style={{ marginBottom: '24px', paddingTop: '18px', borderTop: '1px solid #eee7da' }}>
                <div className="pane-section-lead">
                  <h4>2. Country Residence &amp; Diaspora Hub</h4>
                  <p>Select your country of residence to participate in diaspora derbies and hub community banter.</p>
                </div>

                <div className="country-selection-grid">
                  {MAIN_COUNTRY_LIST.map((c) => {
                    const isSelected = regCountry === c.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        className={`country-card-choice ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleCountryPick(c.code)}
                      >
                        <div className="country-card-flag">{c.flag}</div>
                        <div className="country-card-info">
                          <div className="country-card-title">{c.name}</div>
                          <div className="country-card-tag">{c.tagline}</div>
                        </div>
                        {isSelected && <span className="country-card-check">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {regCountry === 'OTHERS' && (
                  <div className="form-group-field" style={{ marginTop: '12px' }}>
                    <label htmlFor="reg-custom-country" className="field-label">
                      Specify Your Country Name <span className="req-star">*</span>
                    </label>
                    <input
                      id="reg-custom-country"
                      type="text"
                      value={regCustomCountry}
                      onChange={(e) => setRegCustomCountry(e.target.value)}
                      placeholder="e.g. South Africa, Ghana, Ireland, Germany, UAE, Australia"
                      required
                    />
                  </div>
                )}

                <div className="two-cards" style={{ marginTop: '14px', marginBottom: '18px' }}>
                  <div className="form-group-field">
                    <label htmlFor="reg-hub" className="field-label">
                      Local Metropolitan Hub / Area
                    </label>
                    <select
                      id="reg-hub"
                      value={regHub}
                      onChange={(e) => setRegHub(e.target.value)}
                    >
                      {COUNTRIES[regCountry].hubs.map((hub) => (
                        <option key={hub} value={hub}>
                          {hub}
                        </option>
                      ))}
                      <option value="Other Area">Other Hub / Surrounding Area</option>
                    </select>
                  </div>

                  <div className="form-group-field">
                    <label htmlFor="reg-city-edition" className="field-label">
                      Home Roots Edition
                    </label>
                    <select
                      id="reg-city-edition"
                      value={regCityEdition}
                      onChange={(e) => setRegCityEdition(e.target.value as 'lagos' | 'abuja')}
                    >
                      <option value="lagos">🌊 Lagos Edition (Eko)</option>
                      <option value="abuja">⛰️ Abuja Edition (Capital FCT)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: FAN PASSIONS & RECEIPTS */}
              <div className="wizard-step-pane" style={{ marginBottom: '24px', paddingTop: '18px', borderTop: '1px solid #eee7da' }}>
                <div className="pane-section-lead">
                  <h4>3. Fan Passions &amp; Alma Mater Affiliations</h4>
                  <p>Profile your allegiances across Football, Music &amp; Education. You can change these anytime.</p>
                </div>

                <div className="form-group-field" style={{ marginBottom: '14px' }}>
                  <label htmlFor="reg-football" className="field-label">
                    Favourite Football Club or Baller
                  </label>
                  <input
                    id="reg-football"
                    type="text"
                    value={regFavFootball}
                    onChange={(e) => setRegFavFootball(e.target.value)}
                    placeholder="e.g. Victor Osimhen · Arsenal FC / Bukayo Saka / Chelsea FC"
                  />
                  <div className="field-tags-suggestions">
                    <span className="sugg-label">Quick picks:</span>
                    {['Osimhen (Napoli/Gala)', 'Bukayo Saka (Arsenal)', 'Lookman (Atalanta)', 'Chelsea FC', 'Man United'].map((pick) => (
                      <button
                        key={pick}
                        type="button"
                        className="sugg-chip"
                        onClick={() => setRegFavFootball(pick)}
                      >
                        {pick}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="two-cards" style={{ marginBottom: '14px' }}>
                  <div className="form-group-field">
                    <label htmlFor="reg-artist" className="field-label">
                      Favourite Music Artist or Creator
                    </label>
                    <input
                      id="reg-artist"
                      type="text"
                      value={regFavArtist}
                      onChange={(e) => setRegFavArtist(e.target.value)}
                      placeholder="e.g. Burna Boy (Outsiders) / Wizkid FC / Davido (30BG)"
                    />
                  </div>

                  <div className="form-group-field">
                    <label htmlFor="reg-alma" className="field-label">
                      Higher Institution or Secondary School
                    </label>
                    <input
                      id="reg-alma"
                      type="text"
                      value={regAlmaMater}
                      onChange={(e) => setRegAlmaMater(e.target.value)}
                      placeholder="e.g. UNILAG / King’s College / Loyola Jesuit / UI"
                    />
                  </div>
                </div>

                <div className="form-group-field" style={{ marginBottom: '18px' }}>
                  <label htmlFor="reg-bio" className="field-label">
                    Personal Bio or Banter Motto
                  </label>
                  <textarea
                    id="reg-bio"
                    rows={2}
                    value={regBio}
                    onChange={(e) => setRegBio(e.target.value)}
                    placeholder="e.g. Repping Houston TX &amp; Surulere roots. Banter safe, receipts backed!"
                  />
                </div>

                <div className="wizard-step-actions" style={{ justifyContent: 'center' }}>
                  <button type="submit" className="auth-submit-btn" style={{ maxWidth: '420px' }}>
                    <span>Create Verified Profile &amp; Start Repping</span>
                    <span className="btn-arrow">🚀</span>
                  </button>
                </div>
              </div>

              <div className="auth-switch-prompt" style={{ marginTop: '20px' }}>
                <span>Already have a verified account?</span>
                <button
                  type="button"
                  className="switch-action-link"
                  onClick={() => setMode('login')}
                >
                  Log In directly
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PROFILE DASHBOARD MODE (WHEN LOGGED IN) */}
      {/* ========================================================================= */}
      {mode === 'profile' && currentUser && (
        <div className="auth-pro-shell">
          <div className="auth-card-panel">
            <div className="profile-pro-badge">
              <div className="profile-avatar-circle">
                {COUNTRIES[currentUser.country]?.flag || '🌍'}
              </div>
              <div className="profile-header-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem' }}>
                    {currentUser.fullName}
                  </h3>
                  <Pill variant="green-pill">VERIFIED SUPPORTER</Pill>
                </div>
                <div style={{ color: '#555', fontSize: '0.92rem', marginTop: '3px' }}>
                  <strong>@{currentUser.nickname}</strong> · {currentUser.email}
                </div>
              </div>
            </div>

            <div className="profile-key-details-grid">
              <div className="profile-stat-box">
                <span className="profile-stat-label">Country Jurisdiction</span>
                <strong>
                  {COUNTRIES[currentUser.country]?.flag} {COUNTRIES[currentUser.country]?.name || currentUser.country}
                </strong>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">Local Hub / Chapter</span>
                <strong>{currentUser.hubOrArea}</strong>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">Home Roots Edition</span>
                <strong>{currentUser.cityEdition === 'lagos' ? '🌊 Lagos (Eko)' : '⛰️ Abuja (Capital)'}</strong>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">Member Since</span>
                <strong>{currentUser.createdAt}</strong>
              </div>
            </div>

            {/* Quick Country Switcher */}
            <div className="profile-country-changer">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#183e35' }}>
                  Switch Active Country Jurisdiction:
                </span>
                <span style={{ fontSize: '0.78rem', color: '#666' }}>Updates your local fixtures &amp; hubs</span>
              </div>
              <div className="chips" style={{ margin: 0 }}>
                {MAIN_COUNTRY_LIST.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={`chip ${currentUser.country === c.code ? 'selected' : ''}`}
                    onClick={() => {
                      updateProfileAccount({ country: c.code, hubOrArea: c.hubs[0] || `${c.name} Hub` });
                      setSelectedCountry(c.code, c.hubs[0]);
                    }}
                  >
                    {c.flag} {c.shortLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Affiliations Cards */}
            <div className="auth-section-divider" style={{ marginTop: '24px' }}>
              <span>ACTIVE AFFILIATIONS &amp; THE RECEIPTS</span>
            </div>

            <div className="two-cards" style={{ marginBottom: '14px' }}>
              <div className="profile-affil-card">
                <div className="affil-icon">⚽</div>
                <div>
                  <span className="eyebrow" style={{ color: '#8c6b2c' }}>FOOTBALL FAV</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {currentUser.favFootballerOrClub || 'Super Eagles'}
                  </div>
                </div>
              </div>

              <div className="profile-affil-card">
                <div className="affil-icon">🎵</div>
                <div>
                  <span className="eyebrow" style={{ color: '#6d567e' }}>ARTIST / CELEB</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {currentUser.favArtistOrCeleb || 'Afrobeats'}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-affil-card" style={{ marginBottom: '16px' }}>
              <div className="affil-icon">🎓</div>
              <div>
                <span className="eyebrow" style={{ color: '#183e35' }}>CAMPUS / ALMA MATER</span>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {currentUser.campusOrAlmaMater || 'Diaspora Alumni'}
                </div>
              </div>
            </div>

            {/* Editable Bio Section */}
            {isEditingBio ? (
              <div className="profile-bio-editor">
                <div className="form-group-field" style={{ marginBottom: '10px' }}>
                  <label htmlFor="edit-callsign" className="field-label">Nickname / Callsign</label>
                  <input
                    id="edit-callsign"
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                  />
                </div>
                <div className="form-group-field" style={{ marginBottom: '12px' }}>
                  <label htmlFor="edit-bionote" className="field-label">Bio Note</label>
                  <textarea
                    id="edit-bionote"
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn primary" onClick={handleSaveProfileUpdates}>
                    Save Changes
                  </button>
                  <button type="button" className="btn outline" onClick={() => setIsEditingBio(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-bio-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="eyebrow" style={{ color: '#777' }}>BIO &amp; MOTTO</span>
                  <button
                    type="button"
                    className="link-btn"
                    style={{ fontSize: '0.8rem', color: '#183e35', fontWeight: 600, textDecoration: 'underline' }}
                    onClick={() => {
                      setEditNickname(currentUser.nickname);
                      setEditBio(currentUser.bioNote);
                      setIsEditingBio(true);
                    }}
                  >
                    Edit Bio
                  </button>
                </div>
                <p style={{ margin: '6px 0 0', fontStyle: 'italic', color: '#2d3748', fontSize: '0.95rem' }}>
                  "{currentUser.bioNote || 'No bio note set yet.'}"
                </p>
              </div>
            )}

            <div className="profile-card-footer">
              <button
                type="button"
                className="btn outline"
                onClick={() => {
                  logoutAccount();
                  setMode('login');
                }}
              >
                Sign Out (Switch to Guest)
              </button>
              <button type="button" className="btn primary" onClick={closeModal}>
                Done &amp; Return to Platform
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
