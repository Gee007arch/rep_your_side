import { CITIES, CIRCLES } from '../../data/fixtures';
import { CIRCLE_SOCIAL_STATS } from '../../data/community';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { usePassport } from '../../context/PassportContext';

export function CirclesPage() {
  const { state, openModal, toggleCircleInterest } = usePassport();
  const currentCity = CITIES[state.city];

  return (
    <>
      <div className="circle-hero">
        <div>
          <span className="eyebrow">A SHARED INTEREST IS A GOOD START</span>
          <h2>
            Different sides.
            <br />
            <em>Your kind of people.</em>
          </h2>
          <p>Discover the Circles you would like to see in {currentCity.name}.</p>
        </div>
        <div className="circle-faces">
          <span>✳</span>
          <span>☺</span>
          <span>✦</span>
          <span>↗</span>
        </div>
      </div>

      <div className="banner">
        <Icon name="users" />
        <span>
          <b>Help shape the pilot.</b> Save your interests to your Passport. Live
          membership, meet-ups and group chat have not opened.
        </span>
      </div>

      <div className="circle-grid">
        {CIRCLES.map((c) => {
          const isInterested = state.interests.includes(c.id);
          const social = CIRCLE_SOCIAL_STATS[c.id];
          const memberCount =
            (state.city === 'lagos' ? social.lagosMembers : social.abujaMembers) +
            (isInterested ? 1 : 0);

          return (
            <article key={c.id} className="card circle-card">
              <div className="card-row">
                <span className={`circle-icon ${c.colour}`}>
                  <Icon name={c.icon} />
                </span>
                <Pill>{c.tag}</Pill>
              </div>

              <h2>{c.name}</h2>
              <p>{c.desc}</p>

              <div className="circle-member-strip">
                <div className="circle-avatar-stack">
                  {social.recentMembers.map((m, idx) => (
                    <span
                      key={idx}
                      className="stack-avatar"
                      style={{ backgroundColor: m.bg, color: m.color }}
                      title={`${m.name} (${m.area})`}
                    >
                      {m.initials}
                    </span>
                  ))}
                </div>
                <span className="small muted">
                  <b>{memberCount}</b> in {currentCity.name} ·{' '}
                  <b>{social.weeklyReflections}</b> reflections
                </span>
              </div>

              <div className="card-row">
                <span className="small muted">
                  {currentCity.name} edition · Interest preview
                </span>
                <button
                  type="button"
                  className="text-btn"
                  onClick={() => openModal({ type: 'circle', id: c.id })}
                >
                  Meet the Circle <Icon name="arrow" />
                </button>
              </div>

              <button
                type="button"
                className={`btn ${isInterested ? 'interest-selected' : 'outline'} full`}
                onClick={() => toggleCircleInterest(c.id)}
                aria-pressed={isInterested}
              >
                {isInterested ? (
                  <>
                    <Icon name="check" /> Interest saved
                  </>
                ) : (
                  <>
                    This is my kind of thing <Icon name="users" />
                  </>
                )}
              </button>
            </article>
          );
        })}
      </div>

      <div className="kind-strip">
        <Icon name="shield" />
        <span>
          <b>Good vibes need good ground rules.</b> Respect every Side. Ask permission.
          Protect private details.
        </span>
        <button type="button" onClick={() => openModal({ type: 'community' })}>
          Read the community promise <Icon name="arrow" />
        </button>
      </div>
    </>
  );
}

