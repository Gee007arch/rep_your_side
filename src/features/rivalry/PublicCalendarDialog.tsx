import { useState } from 'react';
import {
  INITIAL_DERBY_FIXTURES,
  INITIAL_RIVALRY_ROOMS
} from '../../data/rivalryData';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { usePassport } from '../../context/PassportContext';

export interface PublicCalendarDialogProps {
  initialFilter?: string;
}

export function PublicCalendarDialog({ initialFilter = 'all' }: PublicCalendarDialogProps) {
  const { openModal, showToast, browserServices } = usePassport();
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);

  const filterChips = [
    { id: 'all', label: '📅 All Fixtures' },
    { id: 'inter-city', label: '🏆 Flagship Abuja vs Lagos' },
    { id: 'communities', label: '🏙️ City Derbies' },
    { id: 'football', label: '⚽ Football & Players' },
    { id: 'artists', label: '🎤 Artists & Celebs' },
    { id: 'institutions', label: '🎓 Campus & Alumni' }
  ];

  const handleShareEvent = async (title: string, slug: string) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://rep-your-side.vercel.app'}/#calendar/${slug}`;
    const text = `🏆 Check out "${title}" on the Rep Your Side Public Calendar: ${url}`;
    const ok = await browserServices.copyText(text);
    showToast(ok ? 'Event calendar link copied!' : text);
  };

  const showFlagship = activeFilter === 'all' || activeFilter === 'inter-city';
  const showCommunities = activeFilter === 'all' || activeFilter === 'communities';
  const showFootball = activeFilter === 'all' || activeFilter === 'football';
  const showArtists = activeFilter === 'all' || activeFilter === 'artists';
  const showInstitutions = activeFilter === 'all' || activeFilter === 'institutions';

  const flagshipDerby = INITIAL_DERBY_FIXTURES.find((d) => d.edition === 'inter-city');
  const communityDerbies = INITIAL_DERBY_FIXTURES.filter((d) => d.edition !== 'inter-city');
  const footballRooms = INITIAL_RIVALRY_ROOMS.filter(
    (r) => r.category === 'players' || r.category === 'clubs'
  );
  const artistRooms = INITIAL_RIVALRY_ROOMS.filter((r) => r.category === 'artists');

  return (
    <div className="public-calendar-view">
      {/* Calendar Hero Banner */}
      <div className="rivalry-hero-banner">
        <div className="card-row">
          <Pill variant="orange-pill">📅 PUBLIC COMPETITION CALENDAR · PILOT SEASON 01</Pill>
          <span className="rivalry-phase-pill">DAY-ONE OFFICIAL SCHEDULE</span>
        </div>
        <p className="rivalry-subtitle">
          Browse all featured Derbies, Open Challenges, Matchday Rivalry Rooms, and Campus Battles.
          Share fixtures with rivals or enter to play for your Side.
        </p>

        {/* Filter Chips */}
        <div className="chips" role="tablist" style={{ marginTop: '12px' }}>
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={`chip ${activeFilter === chip.id ? 'selected' : ''}`}
              onClick={() => setActiveFilter(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURED: THE FLAGSHIP INTER-CITY DERBY */}
      {showFlagship && flagshipDerby ? (
        <section className="pillar-block" style={{ marginTop: '20px' }}>
          <div className="card-row">
            <span className="eyebrow">FLAGSHIP TOURNAMENT HEADLINER</span>
            <span className="rivalry-phase-pill">CLOSING WEEKEND DERBY</span>
          </div>

          <article
            className="card pillar-derby-card"
            style={{ border: '2px solid var(--orange)', backgroundColor: '#fffdf9' }}
          >
            <div className="card-row">
              <Pill variant="orange-pill">{flagshipDerby.editionLabel}</Pill>
              <span className="small muted">5 Balanced Questions · Min. 25 players/city</span>
            </div>

            <h2>{flagshipDerby.title}</h2>
            <p className="muted">{flagshipDerby.subtitle}</p>

            <div className="pillar-versus-strip">
              <div className="pillar-vs-side">
                <span className="fav-emoji">🌊</span>
                <div>
                  <b>Team Lagos (Eko)</b>
                  <span>{flagshipDerby.sides[0].eligibleTurnout} players ready</span>
                </div>
              </div>
              <span className="vs-badge">VS</span>
              <div className="pillar-vs-side">
                <span className="fav-emoji">⛰️</span>
                <div>
                  <b>Team Abuja (Capital)</b>
                  <span>{flagshipDerby.sides[1].eligibleTurnout} players ready</span>
                </div>
              </div>
            </div>

            <div className="card-row" style={{ marginTop: '16px' }}>
              <span className="small muted">
                ⏱ {flagshipDerby.deadlineLabel} · Published on Day-One Calendar
              </span>
              <div className="card-row" style={{ gap: '8px' }}>
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => handleShareEvent(flagshipDerby.title, flagshipDerby.slug)}
                >
                  <Icon name="share" /> Share Event
                </button>
                <button
                  type="button"
                  className="btn coral"
                  onClick={() => openModal({ type: 'derby', derbyId: flagshipDerby.id })}
                >
                  Play &amp; Rep Your City <Icon name="arrow" />
                </button>
              </div>
            </div>
          </article>
        </section>
      ) : null}

      {/* SECTION: COMMUNITY DERBIES */}
      {showCommunities ? (
        <section className="pillar-block" style={{ marginTop: '24px' }}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">PLAYABLE FROM DAY ONE · LOCAL DERBIES</span>
              <h2>Lagos &amp; Abuja Neighbourhood Derbies</h2>
              <p>Neighbourhood fixtures for Gwarinpa, Wuse, Yaba, Surulere, Lekki, and VI.</p>
            </div>
          </div>

          <div className="two-cards">
            {communityDerbies.map((derby) => (
              <article key={derby.id} className="card pillar-derby-card">
                <div className="card-row">
                  <Pill variant="green-pill">{derby.editionLabel}</Pill>
                  <span className="small muted">Open for Play</span>
                </div>

                <h3>{derby.title}</h3>
                <p className="small muted">{derby.subtitle}</p>

                <div className="pillar-versus-strip">
                  <div className="pillar-vs-side">
                    <span className="fav-emoji">{derby.sides[0].emoji}</span>
                    <div>
                      <b>{derby.sides[0].name}</b>
                      <span>{derby.sides[0].eligibleTurnout} played</span>
                    </div>
                  </div>
                  <span className="vs-badge">VS</span>
                  <div className="pillar-vs-side">
                    <span className="fav-emoji">{derby.sides[1].emoji}</span>
                    <div>
                      <b>{derby.sides[1].name}</b>
                      <span>{derby.sides[1].eligibleTurnout} played</span>
                    </div>
                  </div>
                </div>

                <div className="card-row" style={{ marginTop: '12px' }}>
                  <button
                    type="button"
                    className="feed-action-btn"
                    onClick={() => handleShareEvent(derby.title, derby.slug)}
                  >
                    <Icon name="share" /> Share
                  </button>
                  <button
                    type="button"
                    className="btn dark"
                    onClick={() => openModal({ type: 'derby', derbyId: derby.id })}
                  >
                    Enter Scored Round <Icon name="arrow" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* SECTION: FOOTBALL CLUBS & PLAYERS MATCHDAY ROOMS */}
      {showFootball ? (
        <section className="pillar-block" style={{ marginTop: '24px' }}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">GLOBAL FOOTBALL SUPPORTERS · MATCHDAY ROOMS</span>
              <h2>Football Clubs &amp; Players Rivalry Schedule</h2>
              <p>Pre-match predictions lock at kickoff. Banter rooms open 24/7.</p>
            </div>
          </div>

          <div className="three-cards">
            {footballRooms.map((room) => (
              <article key={room.id} className="card pillar-room-card">
                <div className="card-row">
                  <Pill variant="orange-pill">{room.badgeLabel}</Pill>
                  <span className="rivalry-phase-pill">{room.phase}</span>
                </div>

                <h3>{room.title}</h3>
                <p className="small muted">{room.subtitle}</p>

                <div className="card-row" style={{ marginTop: 'auto', paddingTop: '12px' }}>
                  <span className="small muted">🧾 {room.cutoffLabel}</span>
                  <button
                    type="button"
                    className="btn coral"
                    onClick={() => openModal({ type: 'rivalry-room', roomId: room.id })}
                  >
                    Enter Room <Icon name="arrow" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* SECTION: ARTISTS & CELEBRITIES SHOWDOWNS */}
      {showArtists ? (
        <section className="pillar-block" style={{ marginTop: '24px' }}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">CULTURE &amp; POP ARENA</span>
              <h2>Artists &amp; Celebrities Rivalry Schedule</h2>
              <p>Afrobeats Big 3, leading ladies, and Nollywood box office showdowns.</p>
            </div>
          </div>

          <div className="three-cards">
            {artistRooms.map((room) => (
              <article key={room.id} className="card pillar-room-card">
                <div className="card-row">
                  <Pill variant="purple-pill">{room.badgeLabel}</Pill>
                  <span className="rivalry-phase-pill">{room.phase}</span>
                </div>

                <h3>{room.title}</h3>
                <p className="small muted">{room.subtitle}</p>

                <div className="card-row" style={{ marginTop: 'auto', paddingTop: '12px' }}>
                  <span className="small muted">💬 Active Banter Stream</span>
                  <button
                    type="button"
                    className="btn dark"
                    onClick={() => openModal({ type: 'rivalry-room', roomId: room.id })}
                  >
                    Join Room <Icon name="arrow" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* SECTION: CAMPUS & ALUMNI SCHEDULE */}
      {showInstitutions ? (
        <section className="pillar-block" style={{ marginTop: '24px' }}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">NATIONWIDE HIGHER INSTITUTIONS &amp; SECONDARY SCHOOLS</span>
              <h2>Campus &amp; Alumni National Onboarding Schedule</h2>
              <p>Weekly accuracy standings and open challenges across Nigeria.</p>
            </div>
          </div>

          <div className="two-cards">
            <article className="card pillar-institution-box">
              <Pill variant="green-pill">🎓 CAMPUS OPEN CHALLENGE</Pill>
              <h3>Higher Institutions Weekly League</h3>
              <p className="small muted">
                Top contenders: UNILAG, UI, OAU, ABU, Covenant, UNIBEN, UNN, UniAbuja.
              </p>
              <button
                type="button"
                className="btn dark full"
                style={{ marginTop: '12px' }}
                onClick={() => openModal({ type: 'institutions', initialKind: 'campus' })}
              >
                Browse &amp; Rep Campus <Icon name="arrow" />
              </button>
            </article>

            <article className="card pillar-institution-box">
              <Pill variant="purple-pill">🛡️ ALUMNI OPEN CHALLENGE</Pill>
              <h3>Secondary School Alumni National Derby</h3>
              <p className="small muted">
                Old Boys and Old Girls from King's College, Queen's College, Loyola Jesuit, FGC, and Barewa.
              </p>
              <button
                type="button"
                className="btn coral full"
                style={{ marginTop: '12px' }}
                onClick={() => openModal({ type: 'institutions', initialKind: 'alumni' })}
              >
                Browse &amp; Rep Alumni <Icon name="arrow" />
              </button>
            </article>
          </div>
        </section>
      ) : null}
    </div>
  );
}
