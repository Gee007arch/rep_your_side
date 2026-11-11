import { useState } from 'react';
import {
  INITIAL_DERBY_FIXTURES,
  INITIAL_RIVALRY_ROOMS,
  INITIAL_INSTITUTIONS,
  type DerbyFixture,
  type RivalryRoom
} from '../../data/rivalryData';
import { MAIN_COUNTRY_LIST, type CountryCode } from '../../data/countries';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { ArtScene } from '../../ui/art';
import { usePassport } from '../../context/PassportContext';

function getDerbyArtScene(derby: DerbyFixture) {
  if (derby.edition === 'inter-city') return { type: 'train', city: 'lagos' as const };
  if (derby.edition === 'abuja') return { type: 'city', city: 'abuja' as const };
  if (derby.edition === 'lagos') return { type: 'city', city: 'lagos' as const };
  if (derby.countryCode === 'UK') return { type: 'train', city: 'lagos' as const };
  if (derby.countryCode === 'CANADA') return { type: 'forest', city: 'abuja' as const };
  if (derby.countryCode === 'USA') return { type: 'city', city: 'lagos' as const };
  return { type: 'park', city: 'lagos' as const };
}

function getFootballRoomArtScene(room: RivalryRoom) {
  if (room.id.includes('osimhen') || room.id.includes('saka')) {
    return { type: 'city', city: 'lagos' as const };
  }
  if (room.id.includes('arsenal') || room.id.includes('chelsea')) {
    return { type: 'train', city: 'lagos' as const };
  }
  if (room.id.includes('manutd') || room.id.includes('liverpool')) {
    return { type: 'city', city: 'lagos' as const };
  }
  if (room.id.includes('real') || room.id.includes('barca')) {
    return { type: 'craft', city: 'lagos' as const };
  }
  return { type: 'park', city: 'lagos' as const };
}

function getArtistRoomArtScene(room: RivalryRoom) {
  if (room.id.includes('big3') || room.id.includes('afrobeats')) {
    return { type: 'craft', city: 'lagos' as const };
  }
  if (room.id.includes('tems') || room.id.includes('asake')) {
    return { type: 'city', city: 'lagos' as const };
  }
  if (room.id.includes('nollywood') || room.id.includes('queens')) {
    return { type: 'park', city: 'abuja' as const };
  }
  return { type: 'craft', city: 'lagos' as const };
}

export function MajorPillarsSection() {
  const { openModal } = usePassport();
  const [activePillarFilter, setActivePillarFilter] = useState<
    'all' | 'derbies' | 'football' | 'artists' | 'campus'
  >('all');
  const [activeCountryFilter, setActiveCountryFilter] = useState<'ALL' | CountryCode>('ALL');

  const footballRooms = INITIAL_RIVALRY_ROOMS.filter(
    (r) => r.category === 'players' || r.category === 'clubs'
  );
  const artistRooms = INITIAL_RIVALRY_ROOMS.filter((r) => r.category === 'artists');
  
  const filteredDerbies = INITIAL_DERBY_FIXTURES.filter((d) => {
    if (activeCountryFilter === 'ALL') return true;
    if (activeCountryFilter === 'NIGERIA') return !d.countryCode || d.countryCode === 'NIGERIA';
    return d.countryCode === activeCountryFilter;
  });

  const campusTop = INITIAL_INSTITUTIONS.filter((i) => {
    if (i.kind !== 'campus') return false;
    if (activeCountryFilter === 'ALL') return true;
    if (activeCountryFilter === 'NIGERIA') return !i.countryCode || i.countryCode === 'NIGERIA';
    return i.countryCode === activeCountryFilter;
  }).slice(0, 4);

  const alumniTop = INITIAL_INSTITUTIONS.filter((i) => {
    if (i.kind !== 'alumni') return false;
    if (activeCountryFilter === 'ALL') return true;
    if (activeCountryFilter === 'NIGERIA') return !i.countryCode || i.countryCode === 'NIGERIA';
    return i.countryCode === activeCountryFilter;
  }).slice(0, 4);

  const showDerbies = activePillarFilter === 'all' || activePillarFilter === 'derbies';
  const showFootball = activePillarFilter === 'all' || activePillarFilter === 'football';
  const showArtists = activePillarFilter === 'all' || activePillarFilter === 'artists';
  const showCampus = activePillarFilter === 'all' || activePillarFilter === 'campus';

  return (
    <div className="major-pillars-wrapper">
      {/* Pillar Spotlight Filter Bar */}
      <div className="pillars-spotlight-header">
        <div>
          <span className="eyebrow">🔥 PLATFORM PILLARS &amp; LIVE ARENAS</span>
          <h2>Pick a Side, challenge a rival &amp; join the banter.</h2>
          <p>
            Every major arena on Rep Your Side—from Neighbourhood &amp; Inter-City Derbies to
            Football Players, Artists &amp; Celebrities, Campus and Old School Alumni.
          </p>
        </div>

        <div className="chips" role="tablist" aria-label="Platform Pillars Filter">
          <button
            type="button"
            className={`chip ${activePillarFilter === 'all' ? 'selected' : ''}`}
            onClick={() => setActivePillarFilter('all')}
          >
            ✨ All Pillars
          </button>
          <button
            type="button"
            className={`chip ${activePillarFilter === 'derbies' ? 'selected' : ''}`}
            onClick={() => setActivePillarFilter('derbies')}
          >
            🏆 City &amp; Inter-City Derbies
          </button>
          <button
            type="button"
            className={`chip ${activePillarFilter === 'football' ? 'selected' : ''}`}
            onClick={() => setActivePillarFilter('football')}
          >
            ⚽ Football &amp; Players Banter
          </button>
          <button
            type="button"
            className={`chip ${activePillarFilter === 'artists' ? 'selected' : ''}`}
            onClick={() => setActivePillarFilter('artists')}
          >
            🎤 Artists &amp; Celebrities
          </button>
          <button
            type="button"
            className={`chip ${activePillarFilter === 'campus' ? 'selected' : ''}`}
            onClick={() => setActivePillarFilter('campus')}
          >
            🎓 Campus &amp; Alumni
          </button>
        </div>

        {/* Country Filter Sub-Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#183e35' }}>
            🌍 Filter Arena by Country:
          </span>
          <div className="chips" style={{ margin: 0 }}>
            <button
              type="button"
              className={`chip ${activeCountryFilter === 'ALL' ? 'selected' : ''}`}
              style={{ padding: '3px 10px', fontSize: '0.82rem' }}
              onClick={() => setActiveCountryFilter('ALL')}
            >
              🌐 All Countries
            </button>
            {MAIN_COUNTRY_LIST.map((c) => (
              <button
                key={c.code}
                type="button"
                className={`chip ${activeCountryFilter === c.code ? 'selected' : ''}`}
                style={{ padding: '3px 10px', fontSize: '0.82rem' }}
                onClick={() => setActiveCountryFilter(c.code)}
              >
                {c.flag} {c.shortLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PILLAR 1: FLAGSHIP ABUJA VS LAGOS & NEIGHBOURHOOD DERBIES */}
      {showDerbies ? (
        <section className="pillar-block" aria-label="Community and Inter-City Derbies">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PILLAR 01 · SCORED DERBIES &amp; OPEN CHALLENGES</span>
              <h2>Flagship Abuja vs Lagos &amp; Neighbourhood Derbies</h2>
              <p>
                Lock one eligible Side per fixture. Ranked by average accuracy once minimum
                turnout is met.
              </p>
            </div>
            <button
              type="button"
              className="text-btn"
              onClick={() =>
                openModal({
                  type: 'derby',
                  derbyId: INITIAL_DERBY_FIXTURES[0].id
                })
              }
            >
              Open Flagship Derby <Icon name="arrow" />
            </button>
          </div>

          <div className="two-cards">
            {filteredDerbies.map((derby) => {
              const sA = derby.sides[0];
              const sB = derby.sides[1];
              const accA = ((sA.totalCorrect / sA.totalQuestionsAttempted) * 100).toFixed(1);
              const accB = ((sB.totalCorrect / sB.totalQuestionsAttempted) * 100).toFixed(1);
              const artScene = getDerbyArtScene(derby);

              return (
                <article key={derby.id} className="card pillar-derby-card">
                  <button
                    type="button"
                    className="place-image"
                    onClick={() => openModal({ type: 'derby', derbyId: derby.id })}
                    aria-label={`Open ${derby.title}`}
                  >
                    <ArtScene type={artScene.type} city={artScene.city} />
                    <span className="image-tag">{derby.editionLabel}</span>
                  </button>

                  <div className="pillar-card-content">
                    <div className="card-row">
                      <Pill
                        variant={
                          derby.edition === 'inter-city' ? 'orange-pill' : 'green-pill'
                        }
                      >
                        {derby.editionLabel}
                      </Pill>
                      <span className="small muted">{derby.questions.length} Qs · +60 XP</span>
                    </div>

                    <h3>{derby.title}</h3>
                    <p className="muted">{derby.subtitle}</p>

                    <div className="pillar-versus-strip">
                      <div className="pillar-vs-side">
                        <span className="fav-emoji">{sA.emoji}</span>
                        <div>
                          <b>{sA.name}</b>
                          <span>
                            {accA}% acc · {sA.eligibleTurnout} players
                          </span>
                        </div>
                      </div>
                      <span className="vs-badge">VS</span>
                      <div className="pillar-vs-side">
                        <span className="fav-emoji">{sB.emoji}</span>
                        <div>
                          <b>{sB.name}</b>
                          <span>
                            {accB}% acc · {sB.eligibleTurnout} players
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="card-row" style={{ marginTop: 'auto', paddingTop: '10px' }}>
                      <span className="small muted">{derby.deadlineLabel}</span>
                      <button
                        type="button"
                        className="btn dark"
                        onClick={() => openModal({ type: 'derby', derbyId: derby.id })}
                      >
                        Play &amp; Rep Your Side <Icon name="arrow" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* PILLAR 2: FOOTBALL CLUBS & PLAYERS BANTER ROOMS */}
      {showFootball ? (
        <section className="pillar-block" aria-label="Football Clubs and Players Banter">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PILLAR 02 · GLOBAL FOOTBALL FANS &amp; PLAYERS BANTER</span>
              <h2>Matchday Rivalry Rooms &amp; Players Banter</h2>
              <p>
                Debate your favourite footballers and clubs, lock in pre-match Receipts, and
                react to Banter of the Match.
              </p>
            </div>
            <button
              type="button"
              className="text-btn"
              onClick={() =>
                openModal({
                  type: 'rivalry-room',
                  roomId: footballRooms[0].id
                })
              }
            >
              Enter Featured Room <Icon name="arrow" />
            </button>
          </div>

          <div className="three-cards">
            {footballRooms.map((room) => {
              const totalV = room.sides.reduce((acc, s) => acc + s.votes, 0) || 1;
              const topBanter = room.banterOfTheMatch[0];
              const artScene = getFootballRoomArtScene(room);

              return (
                <article key={room.id} className="card pillar-room-card">
                  <button
                    type="button"
                    className="place-image"
                    onClick={() =>
                      openModal({ type: 'rivalry-room', roomId: room.id })
                    }
                    aria-label={`Open ${room.title}`}
                  >
                    <ArtScene type={artScene.type} city={artScene.city} />
                    <span className="image-tag">{room.badgeLabel}</span>
                  </button>

                  <div className="pillar-card-content">
                    <div className="card-row">
                      <Pill variant="orange-pill">{room.badgeLabel}</Pill>
                      <span className="rivalry-phase-pill">{room.phase}</span>
                    </div>

                    <h3>{room.title}</h3>
                    <p className="small muted">{room.subtitle}</p>

                    <div className="room-sides-mini">
                      {room.sides.map((s) => {
                        const pct = Math.round((s.votes / totalV) * 100);
                        return (
                          <div key={s.id} className="room-side-bar-row">
                            <div className="card-row">
                              <span>
                                {s.emoji} <b>{s.name}</b> ({s.fanbaseName})
                              </span>
                              <b>{pct}%</b>
                            </div>
                            <div className="rivalry-meter-track">
                              <span
                                style={{ width: `${pct}%`, backgroundColor: s.color }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {topBanter ? (
                      <div className="mini-banter-quote">
                        <span className="eyebrow">🔥 BANTER OF THE MATCH ({topBanter.sideLabel})</span>
                        <p>“{topBanter.quote}”</p>
                      </div>
                    ) : null}

                    <div className="card-row" style={{ marginTop: 'auto', paddingTop: '12px' }}>
                      <span className="small muted">
                        💬 {room.comments.length} posts · 🧾 Receipts Open
                      </span>
                      <button
                        type="button"
                        className="btn coral"
                        onClick={() =>
                          openModal({ type: 'rivalry-room', roomId: room.id })
                        }
                      >
                        Join Room <Icon name="arrow" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* PILLAR 3: ARTISTS, CELEBRITIES & CULTURE ARENA */}
      {showArtists ? (
        <section className="pillar-block" aria-label="Artists, Celebrities and Pop Culture Banter">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PILLAR 03 · ARTISTS, CELEBRITIES &amp; POP CULTURE</span>
              <h2>Afrobeats Royalty, Box Office Queens &amp; Creator Icons</h2>
              <p>
                Rep your favourite music star, Nollywood icon or creator—drop catalog receipts
                and vote in live fan showdowns.
              </p>
            </div>
            <button
              type="button"
              className="text-btn"
              onClick={() =>
                openModal({
                  type: 'rivalry-room',
                  roomId: artistRooms[0].id
                })
              }
            >
              Open Big 3 Arena <Icon name="arrow" />
            </button>
          </div>

          <div className="three-cards">
            {artistRooms.map((room) => {
              const totalV = room.sides.reduce((acc, s) => acc + s.votes, 0) || 1;
              const topBanter = room.banterOfTheMatch[0];
              const artScene = getArtistRoomArtScene(room);

              return (
                <article key={room.id} className="card pillar-room-card">
                  <button
                    type="button"
                    className="place-image"
                    onClick={() =>
                      openModal({ type: 'rivalry-room', roomId: room.id })
                    }
                    aria-label={`Open ${room.title}`}
                  >
                    <ArtScene type={artScene.type} city={artScene.city} />
                    <span className="image-tag">{room.badgeLabel}</span>
                  </button>

                  <div className="pillar-card-content">
                    <div className="card-row">
                      <Pill variant="purple-pill">{room.badgeLabel}</Pill>
                      <span className="rivalry-phase-pill">{room.phase}</span>
                    </div>

                    <h3>{room.title}</h3>
                    <p className="small muted">{room.subtitle}</p>

                    <div className="room-sides-mini">
                      {room.sides.map((s) => {
                        const pct = Math.round((s.votes / totalV) * 100);
                        return (
                          <div key={s.id} className="room-side-bar-row">
                            <div className="card-row">
                              <span>
                                {s.emoji} <b>{s.name}</b> ({s.fanbaseName})
                              </span>
                              <b>{pct}%</b>
                            </div>
                            <div className="rivalry-meter-track">
                              <span
                                style={{ width: `${pct}%`, backgroundColor: s.color }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {topBanter ? (
                      <div className="mini-banter-quote">
                        <span className="eyebrow">✨ TOP FAN RECEIPT ({topBanter.sideLabel})</span>
                        <p>“{topBanter.quote}”</p>
                      </div>
                    ) : null}

                    <div className="card-row" style={{ marginTop: 'auto', paddingTop: '12px' }}>
                      <span className="small muted">🧾 Vote &amp; Drop Receipt</span>
                      <button
                        type="button"
                        className="btn dark"
                        onClick={() =>
                          openModal({ type: 'rivalry-room', roomId: room.id })
                        }
                      >
                        Enter Fandom Room <Icon name="arrow" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* PILLAR 4: NATIONWIDE CAMPUS & SECONDARY SCHOOL ALUMNI */}
      {showCampus ? (
        <section className="pillar-block" aria-label="Campus and Secondary School Alumni Leagues">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PILLAR 04 · NATIONWIDE CAMPUS &amp; OLD SCHOOL ALUMNI</span>
              <h2>Represent Your Campus or Former Secondary School</h2>
              <p>
                Nationwide eligibility across all 36 states &amp; the FCT. Hold multiple
                affiliations alongside your city Side!
              </p>
            </div>
            <button
              type="button"
              className="text-btn"
              onClick={() =>
                openModal({ type: 'institutions', initialKind: 'campus' })
              }
            >
              Browse Full Directory <Icon name="arrow" />
            </button>
          </div>

          <div className="two-cards">
            <article className="card pillar-institution-box">
              <button
                type="button"
                className="place-image"
                onClick={() =>
                  openModal({ type: 'institutions', initialKind: 'campus' })
                }
                aria-label="Browse Higher Institutions Campus League"
              >
                <ArtScene type="city" city="lagos" />
                <span className="image-tag">CAMPUS LEAGUE</span>
              </button>

              <div className="pillar-card-content">
                <div className="card-row">
                  <Pill variant="green-pill">🎓 HIGHER INSTITUTIONS · CAMPUS LEAGUE</Pill>
                  <span className="small muted">Universities · Polytechnics · Colleges</span>
                </div>
                <h3>Top Repped Campuses This Week</h3>
                <div className="institution-mini-list">
                  {campusTop.map((inst, i) => (
                    <div key={inst.id} className="institution-mini-row">
                      <span>
                        <b>#{i + 1}</b> {inst.emoji} <b>{inst.shortName}</b>{' '}
                        <small className="muted">({inst.state})</small>
                      </span>
                      <span>
                        <b>{inst.weeklyScorePct}%</b> · {inst.verifiedMembers} reps
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn dark full"
                  style={{ marginTop: 'auto', paddingTop: '12px' }}
                  onClick={() =>
                    openModal({ type: 'institutions', initialKind: 'campus' })
                  }
                >
                  Verify &amp; Rep My Campus (+30 XP) <Icon name="arrow" />
                </button>
              </div>
            </article>

            <article className="card pillar-institution-box">
              <button
                type="button"
                className="place-image"
                onClick={() =>
                  openModal({ type: 'institutions', initialKind: 'alumni' })
                }
                aria-label="Browse Secondary School Alumni Directory"
              >
                <ArtScene type="craft" city="abuja" />
                <span className="image-tag">ALUMNI LEAGUE</span>
              </button>

              <div className="pillar-card-content">
                <div className="card-row">
                  <Pill variant="purple-pill">🛡️ SECONDARY SCHOOL ALUMNI · OLD BOYS &amp; GIRLS</Pill>
                  <span className="small muted">Unity · Heritage · Mission · Command</span>
                </div>
                <h3>Top Secondary School Alumni Chapters</h3>
                <div className="institution-mini-list">
                  {alumniTop.map((inst, i) => (
                    <div key={inst.id} className="institution-mini-row">
                      <span>
                        <b>#{i + 1}</b> {inst.emoji} <b>{inst.shortName}</b>{' '}
                        <small className="muted">({inst.state})</small>
                      </span>
                      <span>
                        <b>{inst.weeklyScorePct}%</b> · {inst.verifiedMembers} reps
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn coral full"
                  style={{ marginTop: 'auto', paddingTop: '12px' }}
                  onClick={() =>
                    openModal({ type: 'institutions', initialKind: 'alumni' })
                  }
                >
                  Rep My Old School &amp; Graduating Set (+30 XP) <Icon name="arrow" />
                </button>
              </div>
            </article>
          </div>
        </section>
      ) : null}
    </div>
  );
}

