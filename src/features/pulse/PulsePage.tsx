import { CITIES, PULSE, SOURCES } from '../../data/fixtures';
import { EXTENDED_PULSE } from '../../data/extendedCatalog';
import { ArtScene } from '../../ui/art';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { usePassport } from '../../context/PassportContext';

export function PulsePage() {
  const { state, pulseFilter, setPulseFilter, openModal } = usePassport();
  const currentCity = CITIES[state.city];

  const topics = ['All', 'Community', 'Transport', 'Environment', 'Culture'] as const;

  const list = [...PULSE, ...EXTENDED_PULSE].filter(
    (p) => p.city === state.city && (pulseFilter === 'All' || p.topic === pulseFilter)
  );

  return (
    <>
      <section className="pulse-heading">
        <span className="pulse-ring">
          <Icon name="pulse" />
        </span>
        <div>
          <h2>{currentCity.pulseTitle}</h2>
          <p>A small, sourced reading shelf. Useful context, without the endless scroll.</p>
        </div>
        <Pill variant="green-pill">CURATED BACKGROUND</Pill>
      </section>

      <div className="filter-row">
        <div className="chips" role="group" aria-label="Pulse topics">
          {topics.map((t) => {
            const isSelected = pulseFilter === t;
            return (
              <button
                key={t}
                type="button"
                className={`chip ${isSelected ? 'selected' : ''}`.trim()}
                onClick={() => setPulseFilter(t)}
                aria-pressed={isSelected}
              >
                {t}
              </button>
            );
          })}
        </div>
        <span className="small muted">Last checked · 21 Oct 2026</span>
      </div>

      {list.length ? (
        <div className="pulse-list">
          {list.map((p) => (
            <article key={p.id} className="card pulse-card">
              <button
                type="button"
                className="pulse-art"
                onClick={() => openModal({ type: 'pulse', id: p.id })}
                aria-label={`Read ${p.title}`}
              >
                <ArtScene type={p.art} city={p.city} />
              </button>
              <div className="pulse-copy">
                <div className="card-row">
                  <Pill variant="green-pill">{p.tag}</Pill>
                  <span className="small muted">{p.area}</span>
                </div>
                <h2>
                  <button
                    type="button"
                    onClick={() => openModal({ type: 'pulse', id: p.id })}
                  >
                    {p.title}
                  </button>
                </h2>
                <p>{p.summary}</p>
                <div className="card-row">
                  <span className="small muted">
                    {SOURCES[p.source]?.name} · 2 min read
                  </span>
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => openModal({ type: 'pulse', id: p.id })}
                  >
                    Read the story <Icon name="arrow" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name="pulse" />
          <h2>No {pulseFilter.toLowerCase()} item in this edition yet.</h2>
          <p>We only show what is in the sourced pilot collection.</p>
          <button
            type="button"
            className="btn dark"
            onClick={() => setPulseFilter('All')}
          >
            Show all topics
          </button>
        </div>
      )}

      <div className="info-strip">
        <Icon name="shield" />
        <p>
          <b>Context, with the source attached.</b> These are evergreen learning items,
          not a live news feed. Suggestions and corrections can be saved as local drafts
          from each story.
        </p>
      </div>
    </>
  );
}

