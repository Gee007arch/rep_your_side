import React, { useState, useRef } from 'react';
import type { CityId } from '../../domain/types';
import { CITIES } from '../../data/fixtures';
import { MAIN_COUNTRY_LIST } from '../../data/countries';
import { Skyline } from '../../ui/art';
import { Icon } from '../../ui/icons';
import { usePassport } from '../../context/PassportContext';

export function SideDialog() {
  const { state, updateSide, selectedCountry, setSelectedCountry } = usePassport();
  const [cityChoice, setCityChoice] = useState<CityId>(state.city);
  const [area, setArea] = useState<string>(state.city === cityChoice ? state.area : '');
  const [nickname, setNickname] = useState<string>(
    state.nickname === 'Explorer' ? '' : state.nickname
  );
  const [error, setError] = useState<string>('');
  const [areaInvalid, setAreaInvalid] = useState<boolean>(false);
  const areaSelectRef = useRef<HTMLSelectElement | null>(null);

  const handleCityChange = (newCity: CityId) => {
    setCityChoice(newCity);
    setArea(state.city === newCity ? state.area : '');
    setError('');
    setAreaInvalid(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = updateSide(cityChoice, area, nickname);
    if (!result.success) {
      if (result.areaError) {
        setError(result.areaError);
        setAreaInvalid(true);
        areaSelectRef.current?.focus();
      } else if (result.nicknameError) {
        setError(result.nicknameError);
        setAreaInvalid(false);
      }
    }
  };

  return (
    <>
      <p className="modal-lead">
        Choose a city and the area you want to represent. Roots, home or a place you love — it’s your call.
      </p>

      <div className="city-options">
        {(Object.entries(CITIES) as [CityId, (typeof CITIES)[CityId]][]).map(([id, c]) => {
          const isChosen = id === cityChoice;
          return (
            <button
              key={id}
              type="button"
              className={`city-option ${isChosen ? 'chosen' : ''}`.trim()}
              onClick={() => handleCityChange(id)}
              aria-pressed={isChosen}
            >
              <div>
                <Skyline city={id} />
              </div>
              <strong>{c.name}</strong>
              <small>{c.tag}</small>
              <span>{isChosen ? <Icon name="check" /> : '↗'}</span>
            </button>
          );
        })}
      </div>

      <div className="country-side-picker" style={{ margin: '14px 0 16px', padding: '10px 14px', background: '#f5f4ea', borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#183e35' }}>
            🌍 DIASPORA &amp; COUNTRY JURISDICTION:
          </span>
          <span style={{ fontSize: '0.78rem', color: '#666' }}>USA · Canada · UK · Nigeria · Others</span>
        </div>
        <div className="chips">
          {MAIN_COUNTRY_LIST.map((c) => (
            <button
              key={c.code}
              type="button"
              className={`chip ${selectedCountry === c.code ? 'selected' : ''}`}
              onClick={() => setSelectedCountry(c.code)}
            >
              {c.flag} {c.shortLabel}
            </button>
          ))}
        </div>
      </div>

      <form id="side-form" noValidate onSubmit={handleSubmit}>
        <label htmlFor="side-area">Pick your Side</label>
        <select
          id="side-area"
          name="area"
          ref={areaSelectRef}
          value={area}
          onChange={(e) => {
            setArea(e.target.value);
            setAreaInvalid(false);
            setError('');
          }}
          aria-invalid={areaInvalid}
        >
          <option value="">Choose an area in {CITIES[cityChoice].name}</option>
          {CITIES[cityChoice].areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <span className="field-note">
          Community names, not a map of administrative boundaries. More Sides will follow.
        </span>

        <label htmlFor="nickname">What should we call you?</label>
        <input
          id="nickname"
          name="nickname"
          maxLength={30}
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setError('');
          }}
          placeholder="Your nickname (optional)"
        />

        {error ? (
          <p id="side-error" className="field-error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="btn primary full" type="submit">
          Let’s rep {CITIES[cityChoice].name} <Icon name="arrow" />
        </button>
      </form>

      <p className="modal-footnote">
        Guest play is free. No exact location or account needed. You can change your Side and keep your progress.
      </p>
    </>
  );
}

