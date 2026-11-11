import type { Place } from '../domain/types';
import { ArtScene } from './art';
import { Icon } from './icons';
import { usePassport } from '../context/PassportContext';

export interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place: p }: PlaceCardProps) {
  const { state, catalog, toggleSavePlace, openModal } = usePassport();
  const isSaved = state.saved.includes(p.id);
  const city = catalog.getCity(p.city);

  return (
    <article className="card place-card">
      <button
        type="button"
        className="place-image"
        onClick={() => openModal({ type: 'place', id: p.id })}
        aria-label={`Discover ${p.name}`}
      >
        <ArtScene type={p.art} city={p.city} />
        <span className="image-tag">{p.category}</span>
      </button>

      <button
        type="button"
        className={`bookmark ${isSaved ? 'is-saved' : ''}`.trim()}
        onClick={() => toggleSavePlace(p.id)}
        aria-label={`${isSaved ? 'Unsave' : 'Save'} ${p.name}`}
        aria-pressed={isSaved}
      >
        <Icon name="save" />
      </button>

      <div className="place-copy">
        <span className="small muted">
          <Icon name="pin" /> {p.area} · {city.name}
        </span>
        <h3>
          <button
            type="button"
            onClick={() => openModal({ type: 'place', id: p.id })}
          >
            {p.name}
          </button>
        </h3>
        <p>{p.desc}</p>
        <button
          type="button"
          className="text-btn"
          onClick={() => openModal({ type: 'place', id: p.id })}
        >
          Take a closer look <Icon name="arrow" />
        </button>
      </div>
    </article>
  );
}
