import { PLACES, CITIES } from '../../data/fixtures';
import { EXTENDED_PLACES } from '../../data/extendedCatalog';
import { ArtScene } from '../../ui/art';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { SourceBlock } from '../../ui/SourceBlock';
import { usePassport } from '../../context/PassportContext';

export interface PlaceDialogProps {
  id: string;
}

export function PlaceDialog({ id }: PlaceDialogProps) {
  const { state, toggleSavePlace, collectContent, openModal } = usePassport();
  const p =
    PLACES.find((item) => item.id === id) ||
    EXTENDED_PLACES.find((item) => item.id === id);

  if (!p) return null;

  const isSaved = state.saved.includes(id);
  const isCollected = state.read.includes(id);

  return (
    <>
      <div className="detail-art">
        <ArtScene type={p.art} city={p.city} />
      </div>

      <div className="card-row">
        <Pill variant="green-pill">{p.category}</Pill>
        <span className="small muted">
          {p.area} · {CITIES[p.city].name}
        </span>
      </div>

      <h3>{p.title}</h3>
      <p className="reading-text">{p.detail}</p>

      <SourceBlock sourceId={p.source} />

      <div className="stack">
        <button
          type="button"
          className="btn dark full"
          onClick={() => toggleSavePlace(id)}
        >
          {isSaved ? (
            <>
              <Icon name="check" /> Saved to my Passport
            </>
          ) : (
            <>
              <Icon name="save" /> Save this discovery
            </>
          )}
        </button>

        <button
          type="button"
          className="btn outline full"
          onClick={() => collectContent(id)}
          disabled={isCollected}
        >
          {isCollected ? 'Discovery collected ✓' : 'I learned something · collect 10 XP'}
        </button>

        <button
          type="button"
          className="text-btn"
          onClick={() => openModal({ type: 'correction', id, kind: 'place' })}
        >
          Suggest a correction
        </button>
      </div>
    </>
  );
}

