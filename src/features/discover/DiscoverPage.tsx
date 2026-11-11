import React, { useState } from 'react';
import { CITIES, PLACES } from '../../data/fixtures';
import { EXTENDED_PLACES } from '../../data/extendedCatalog';
import { ArtScene } from '../../ui/art';
import { Icon } from '../../ui/icons';
import { PlaceCard } from '../../ui/PlaceCard';
import { usePassport } from '../../context/PassportContext';

export function DiscoverPage() {
  const { state, filter, setFilter, search, setSearch } = usePassport();
  const currentCity = CITIES[state.city];
  const [searchInput, setSearchInput] = useState(search);

  const categories = ['All', 'Nature', 'Culture', 'Move', 'Saved'] as const;

  const filterPlace = (p: (typeof PLACES)[number]) => {
    if (p.city !== state.city) return false;

    if (filter === 'All') {
      // no category filter
    } else if (filter === 'Saved') {
      if (!state.saved.includes(p.id)) return false;
    } else if (p.category !== filter) {
      return false;
    }

    if (search) {
      const target = `${p.name} ${p.area} ${p.category}`.toLowerCase();
      if (!target.includes(search.toLowerCase())) return false;
    }

    return true;
  };

  const list = PLACES.filter(filterPlace);
  const extendedList = EXTENDED_PLACES.filter(filterPlace);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleClearFilter = () => {
    setFilter('All');
    setSearch('');
    setSearchInput('');
  };

  return (
    <>
      <div className="discovery-banner">
        <div>
          <span className="eyebrow">{currentCity.name.toUpperCase()}, WITH FRESH EYES</span>
          <h2>
            Same city.
            <br />
            <em>New little discoveries.</em>
          </h2>
          <p>Nature, culture and practical ways to get to know your city.</p>
        </div>
        <div>
          <ArtScene type={state.city === 'lagos' ? 'train' : 'forest'} />
        </div>
      </div>

      <div className="filter-row">
        <div className="chips" role="group" aria-label="Discovery category">
          {categories.map((t) => {
            const isSelected = filter === t;
            return (
              <button
                key={t}
                type="button"
                className={`chip ${isSelected ? 'selected' : ''}`.trim()}
                onClick={() => setFilter(t)}
                aria-pressed={isSelected}
              >
                {t === 'Saved' ? <Icon name="save" /> : null}
                {t}
              </button>
            );
          })}
        </div>

        <form id="search-form" className="searchbox" onSubmit={handleSearchSubmit}>
          <label htmlFor="discover-search" className="sr-only">
            Search discoveries
          </label>
          <Icon name="search" />
          <input
            id="discover-search"
            name="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search a place or area"
          />
          <button aria-label="Search" type="submit">
            ↵
          </button>
        </form>
      </div>

      <div className="results-label">
        {list.length} {list.length === 1 ? 'discovery' : 'discoveries'} in {currentCity.name}{' '}
        {state.area ? '· representing ' + state.area : ''}
      </div>

      {list.length || extendedList.length ? (
        <>
          <div className="three-cards">
            {[...list, ...extendedList].map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <Icon name="compass" />
          <h2>
            {filter === 'Saved'
              ? 'Your little collection starts here.'
              : 'No discoveries found. Yet.'}
          </h2>
          <p>
            {filter === 'Saved'
              ? 'Tap the bookmark on any discovery to keep it here.'
              : 'Try another category or a broader search. Pilot coverage is limited.'}
          </p>
          <button
            type="button"
            className="btn dark"
            onClick={handleClearFilter}
          >
            Show all discoveries
          </button>
        </div>
      )}

      <div className="info-strip">
        <Icon name="clock" />
        <p>
          Discovery information checked on 21 October 2026. Current opening times,
          prices and accessibility need confirmation with the operator. Illustrations
          are city-inspired artwork. No booking is made here.
        </p>
      </div>
    </>
  );
}

