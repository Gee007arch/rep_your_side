import type { PageRoute } from '../../domain/types';
import { CITIES, PLACES } from '../../data/fixtures';
import { EXTENDED_PLACES } from '../../data/extendedCatalog';
import { xp, roundKey } from '../../domain/model';
import { Skyline } from '../../ui/art';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { MissionCard } from '../../ui/MissionCard';
import { PlaceCard } from '../../ui/PlaceCard';
import { FirstVisitFavWidget } from './FirstVisitFavWidget';
import { MajorPillarsSection } from './MajorPillarsSection';
import { LiveFeedSection } from './LiveFeedSection';
import { SideStandingsCard } from './SideStandingsCard';
import { usePassport } from '../../context/PassportContext';

export interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { state, openModal } = usePassport();
  const currentCity = CITIES[state.city];
  const score = xp(state);
  const places = [...PLACES, ...EXTENDED_PLACES]
    .filter((x) => x.city === state.city)
    .slice(0, 4);
  const storyState = state.story[state.city];
  const qKey = roundKey(state.city, 'city', 'starter-v1');

  const storyButtonText = storyState?.done
    ? 'Revisit the story'
    : storyState
    ? 'Continue your story'
    : 'Open the first chapter';

  const storyProgressWidth = storyState?.done
    ? 100
    : (storyState?.chapter || 0) * 20;

  const roundsCount = Object.keys(state.awards).filter((k) =>
    k.startsWith('round:')
  ).length;

  const nextStopLabel =
    score < 150
      ? 'NEXT STOP: 150 XP'
      : score < 350
      ? 'NEXT STOP: 350 XP'
      : 'KEEP EXPLORING';

  const progressPercent = Math.min(
    100,
    (score / (score < 150 ? 150 : 350)) * 100
  );

  const progressHint =
    score === 0
      ? 'Your first discovery is a good place to start.'
      : score < 150
      ? `${150 - score} XP to Local Explorer. No rush.`
      : 'Look at you, collecting stories.';

  const welcomeTourItems: [boolean, string, () => void][] = [
    [!!state.area, 'Pick a Side', () => openModal({ type: 'side' })],
    [
      !!state.attempts[qKey]?.done,
      'Play your first round',
      () => openModal({ type: 'quiz', roundType: 'city' })
    ],
    [state.read.length > 0, 'Discover something local', () => onNavigate('discover')]
  ];

  return (
    <div className="dashboard-grid">
      <div className="main-column">
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-label">
              <span />
              {state.area
                ? `${state.area.toUpperCase()}, THIS IS YOUR SIDE`
                : 'YOUR NEXT DISCOVERY STARTS HERE'}
            </span>
            <h2>
              Big city energy.
              <br />
              Your side of
              <br />
              <em>the story.</em>
            </h2>
            <p>
              Play a little. Learn something.
              <br />
              Find a new reason to love your city.
            </p>
            <button
              type="button"
              className="btn coral"
              onClick={() => {
                if (state.area) {
                  onNavigate('discover');
                } else {
                  openModal({ type: 'side' });
                }
              }}
            >
              {state.area ? 'Explore my side' : 'Pick your side'} <Icon name="arrow" />
            </button>
          </div>

          <div className="hero-art">
            <Skyline city={state.city} />
            <span className="city-sticker">
              {state.city === 'lagos' ? 'Eko for show!' : 'Capital energy!'} <span>↗</span>
            </span>
            <span className="art-caption">An original city-inspired illustration</span>
          </div>
          <span className="hero-spark">✳</span>
        </section>

        <FirstVisitFavWidget />

        <MajorPillarsSection />

        <div className="section-heading">
          <h2>Your next little adventure</h2>
          <a
            href="#play"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('play');
            }}
          >
            See all <Icon name="arrow" />
          </a>
        </div>

        <div className="two-cards">
          <MissionCard />

          <article className="card story-card">
            <div className="card-row">
              <Pill variant="purple-pill">THE SIDE STORIES</Pill>
              <span className="small muted">Fiction · 5 chapters</span>
            </div>
            <div className="story-envelope">
              <span>✉</span>
              <i>
                THE POSTCARD
                <br />
                TRAIL
              </i>
              <b>✦</b>
            </div>
            <h2>
              A mystery with
              <br />
              your name on it.
            </h2>
            <p>One postcard. Five clues. A city full of stories.</p>
            <button
              type="button"
              className="text-btn"
              onClick={() => openModal({ type: 'story' })}
            >
              {storyButtonText} <Icon name="arrow" />
            </button>
            <div className="story-line">
              <span style={{ width: `${storyProgressWidth}%` }} />
            </div>
          </article>
        </div>

        <div className="section-heading">
          <div>
            <h2>Around your side</h2>
            <p>Small detours. Good discoveries.</p>
          </div>
          <a
            href="#discover"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('discover');
            }}
          >
            Explore more <Icon name="arrow" />
          </a>
        </div>

        <div className="two-cards">
          {places.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>

        <LiveFeedSection />

        <div className="kind-strip">
          <Icon name="users" />
          <span>
            <b>Different sides. One good community.</b> Bring your curiosity. Leave the
            rivalry friendly.
          </span>
          <button type="button" onClick={() => onNavigate('circles')}>
            Find a Circle <Icon name="arrow" />
          </button>
        </div>
      </div>

      <aside className="right-column">
        <section className="card progress-card">
          <div className="card-row">
            <h2>
              Your side hustle?
              <br />
              Curiosity.
            </h2>
            <span className="sun-badge">✳</span>
          </div>

          <div className="mini-profile">
            <span className="avatar">
              {state.nickname.charAt(0).toUpperCase()}
            </span>
            <div>
              <b>{state.nickname}</b>
              <p>
                {state.area ? state.area : 'Visitor'} · {currentCity.name}
              </p>
            </div>
          </div>

          <div className="xp-label">
            <strong>
              {score} <small>XP collected</small>
            </strong>
            <span>{nextStopLabel}</span>
          </div>

          <div className="progress-track">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="progress-hint">{progressHint}</p>

          <div className="stats-row">
            <div>
              <b>{roundsCount}</b>
              <span>rounds</span>
            </div>
            <div>
              <b>{state.read.length}</b>
              <span>discoveries</span>
            </div>
            <div>
              <b>{state.saved.length}</b>
              <span>saved</span>
            </div>
          </div>

          <button
            type="button"
            className="full-link"
            onClick={() => onNavigate('passport')}
          >
            View my Passport <Icon name="arrow" />
          </button>
        </section>

        <SideStandingsCard />

        <section className="know-card">
          <div className="eyebrow">✧ NOW YOU KNOW</div>
          <h2>{currentCity.fact}</h2>
          <p>
            {state.city === 'lagos'
              ? 'There’s a whole state beyond your familiar route. Start with the names behind IBILE.'
              : 'Your Side is your community. An area council describes a different kind of boundary.'}
          </p>
          <button
            type="button"
            className="text-btn"
            onClick={() =>
              openModal({
                type: 'pulse',
                id: state.city === 'lagos' ? 'lg-divisions' : 'ab-councils'
              })
            }
          >
            Get the little story <Icon name="arrow" />
          </button>
          <span className="know-scribble">↝</span>
        </section>

        <section className="card checklist-card">
          <span className="eyebrow">THE WELCOME TOUR</span>
          <h3>Make yourself at home.</h3>
          {welcomeTourItems.map(([done, text, action], idx) => (
            <button
              key={idx}
              type="button"
              className={`check-item ${done ? 'done' : ''}`.trim()}
              onClick={action}
            >
              <span>{done ? <Icon name="check" /> : null}</span>
              {text}
              <Icon name="arrow" />
            </button>
          ))}
        </section>

        <div className="local-note">
          <Icon name="shield" />
          <p>
            Just you and your discoveries.
            <br />
            Progress stays on this browser. No money, rankings or public posts in
            this pilot.
          </p>
        </div>
      </aside>
    </div>
  );
}

