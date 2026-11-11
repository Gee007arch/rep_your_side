import type { PageRoute } from '../../domain/types';
import { CITIES, PLACES } from '../../data/fixtures';
import { EXTENDED_PLACES } from '../../data/extendedCatalog';
import { COUNTRIES } from '../../data/countries';
import {
  INITIAL_INSTITUTIONS,
  INITIAL_DERBY_FIXTURES
} from '../../data/rivalryData';
import { xp, getExplorerLevel, getStamps } from '../../domain/model';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { PlaceCard } from '../../ui/PlaceCard';
import { usePassport } from '../../context/PassportContext';

export interface PassportPageProps {
  onNavigate: (page: PageRoute) => void;
}

export function PassportPage({ onNavigate }: PassportPageProps) {
  const {
    state,
    openModal,
    showToast,
    browserServices,
    currentUser,
    selectedCountry,
    selectedCountryHub
  } = usePassport();
  const currentCity = CITIES[state.city];
  const score = xp(state);
  const level = getExplorerLevel(score);
  const stamps = getStamps(state);

  const allPlaces = [...PLACES, ...EXTENDED_PLACES];
  const savedPlaces = allPlaces.filter((p) => state.saved.includes(p.id));

  // Load User's Multi-Affiliations from localStorage
  let userAffiliatedInstitutions: typeof INITIAL_INSTITUTIONS = [];
  let userCohortNotes: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    try {
      const rawInst = window.localStorage.getItem('rys.v15.institutions.v1');
      if (rawInst) {
        const parsed = JSON.parse(rawInst);
        if (parsed?.affiliatedIds?.length) {
          userCohortNotes = parsed.cohortNotes || {};
          userAffiliatedInstitutions = (parsed.list || INITIAL_INSTITUTIONS).filter(
            (inst: any) => parsed.affiliatedIds.includes(inst.id)
          );
        }
      }
    } catch {
      // ignore
    }
  }

  // Load User's Fav Receipts from localStorage
  let userFavReceipts: Array<{
    assessmentId: string;
    favName: string;
    fanbase: string;
    vibeBadges: string[];
    totalPoints: number;
    completedAt: string;
  }> = [];
  if (typeof window !== 'undefined') {
    try {
      const rawFav = window.localStorage.getItem('rys.v15.favs.v1');
      if (rawFav) {
        const parsed = JSON.parse(rawFav);
        if (parsed?.receipts) {
          userFavReceipts = Object.values(parsed.receipts);
        }
      }
    } catch {
      // ignore
    }
  }

  // Load User's Derby Submission Receipts from localStorage
  let userDerbyAttempts: Array<{
    derbyId: string;
    lockedSideId: string;
    score: number;
    receiptId: string;
    submittedAt: string;
  }> = [];
  if (typeof window !== 'undefined') {
    try {
      const rawDerby = window.localStorage.getItem('rys.v15.derbies.v1');
      if (rawDerby) {
        const parsed = JSON.parse(rawDerby);
        if (parsed?.attempts) {
          userDerbyAttempts = (Object.values(parsed.attempts) as any[]).filter(
            (att) => att.submitted && att.receiptId
          );
        }
      }
    } catch {
      // ignore
    }
  }

  const handleShareReceipt = async (title: string, receiptId: string) => {
    const text = `🎖️ My Official Rep Your Side Receipt: "${title}" (ID: ${receiptId}) on rep-your-side.vercel.app`;
    const ok = await browserServices.copyText(text);
    showToast(ok ? 'Receipt share link copied to clipboard!' : text);
  };

  return (
    <>
      <div className="passport-layout">
        <section className="passport">
          <div className="card-row">
            <span>REP YOUR SIDE</span>
            <Icon name="passport" />
          </div>
          <div className="passport-emblem">✳</div>
          <span className="eyebrow">A LITTLE RECORD OF YOUR DISCOVERIES</span>
          <h2>
            Side
            <br />
            <em>Passport.</em>
          </h2>
          <div className="passport-name">{state.nickname}</div>

          <div className="passport-details">
            <div>
              <span>COUNTRY &amp; JURISDICTION</span>
              <b>
                {COUNTRIES[selectedCountry]?.flag} {COUNTRIES[selectedCountry]?.shortLabel || selectedCountry} ({selectedCountryHub})
              </b>
            </div>
            <div>
              <span>REPRESENTING</span>
              <b>
                {state.area ? state.area : 'Visitor'} · {currentCity.name}
              </b>
            </div>
            <div>
              <span>EXPLORER LEVEL</span>
              <b>{level} {currentUser?.isVerified ? '· Verified' : ''}</b>
            </div>
            {userAffiliatedInstitutions.length > 0 ? (
              <div>
                <span>AFFILIATIONS</span>
                <b>{userAffiliatedInstitutions.map((i) => i.shortName).join(' · ')}</b>
              </div>
            ) : null}
          </div>

          <div className="passport-bottom">
            <span>COMMUNITY COLLECTIBLE · NOT OFFICIAL ID</span>
            <b>{score} XP</b>
          </div>
        </section>

        <div>
          <div className="card passport-progress">
            <span className="eyebrow">A GOOD START IS STILL A START</span>
            <h2>{score ? 'Look at all that curiosity.' : 'Your story is just getting started.'}</h2>
            <p>
              Your city, Side, discoveries and progress stay together as you explore both
              editions.
            </p>

            <div className="stats-row">
              <div>
                <b>{score}</b>
                <span>XP</span>
              </div>
              <div>
                <b>{state.read.length}</b>
                <span>discoveries</span>
              </div>
              <div>
                <b>{state.interests.length}</b>
                <span>interests</span>
              </div>
              <div>
                <b>{userAffiliatedInstitutions.length}</b>
                <span>affiliations</span>
              </div>
            </div>

            <div className="card-row">
              <button
                type="button"
                className="btn dark"
                onClick={() => openModal({ type: 'side' })}
              >
                Edit my Side & nickname
              </button>
              <button
                type="button"
                className="btn outline"
                onClick={() => openModal({ type: 'auth', initialMode: currentUser ? 'profile' : 'login' })}
              >
                {currentUser ? `👤 Verified Profile (${currentUser.nickname})` : '🔑 Log In / Register Profile'}
              </button>
              <button
                type="button"
                className="btn outline"
                onClick={() => openModal({ type: 'institutions', initialKind: 'campus' })}
              >
                Manage Campus & Alumni
              </button>
              <button
                type="button"
                className="btn outline"
                onClick={() => openModal({ type: 'settings' })}
              >
                Data & recovery
              </button>
            </div>
          </div>

          {/* User Account / Country Status Shelf */}
          <div className="card" style={{ marginTop: '16px', background: '#f5f4ea' }}>
            <div className="card-row" style={{ marginBottom: '6px' }}>
              <span className="eyebrow" style={{ color: '#183e35' }}>
                GLOBAL VERIFICATION &amp; COUNTRY JURISDICTION
              </span>
              <Pill variant="green-pill">
                {currentUser ? `${COUNTRIES[currentUser.country]?.flag} ${currentUser.country} JURISDICTION` : 'GUEST SESSION'}
              </Pill>
            </div>
            {currentUser ? (
              <div>
                <p style={{ margin: '4px 0 10px', fontSize: '0.92rem' }}>
                  Logged in as <strong>{currentUser.fullName}</strong> (@{currentUser.nickname}) repping{' '}
                  <strong>{currentUser.hubOrArea}</strong> ({COUNTRIES[currentUser.country]?.name}).
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn outline"
                    style={{ fontSize: '0.85rem' }}
                    onClick={() => openModal({ type: 'auth', initialMode: 'profile' })}
                  >
                    View Global Profile &amp; Favs
                  </button>
                  <button
                    type="button"
                    className="btn outline"
                    style={{ fontSize: '0.85rem' }}
                    onClick={() => openModal({ type: 'auth', initialMode: 'register' })}
                  >
                    Switch / Add Another Affiliation
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ margin: '4px 0 10px', fontSize: '0.92rem' }}>
                  You are currently playing in a browser-local guest session. Register or log in to link your Country Hub (USA, Canada, UK, Nigeria, Others), permanently lock derbies, and carry your receipts across devices.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn dark"
                    style={{ fontSize: '0.85rem' }}
                    onClick={() => openModal({ type: 'auth', initialMode: 'login' })}
                  >
                    Log In with Email
                  </button>
                  <button
                    type="button"
                    className="btn outline"
                    style={{ fontSize: '0.85rem' }}
                    onClick={() => openModal({ type: 'auth', initialMode: 'register' })}
                  >
                    Create Verified Account (1 min)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="stamp-shelf">
            <h3>Your stamp collection</h3>
            <div className="stamps">
              {stamps.map((st) => (
                <div
                  key={st.title}
                  className={`stamp ${st.earned ? 'earned' : ''}`.trim()}
                >
                  <Icon name={st.icon} />
                  <b>{st.title}</b>
                  <span>{st.earned ? 'Collected' : 'Still to discover'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MULTI-AFFILIATION SHELF (CAMPUS, ALUMNI & CLUBS) */}
      <div className="section-heading" style={{ marginTop: '28px' }}>
        <div>
          <h2>My Multi-Edition Affiliations</h2>
          <p>Hold verified community, campus, and secondary school alumni identities with no score leakage.</p>
        </div>
        <button
          type="button"
          className="text-btn"
          onClick={() => openModal({ type: 'institutions', initialKind: 'campus' })}
        >
          Add affiliation <Icon name="arrow" />
        </button>
      </div>

      {userAffiliatedInstitutions.length ? (
        <div className="three-cards">
          {userAffiliatedInstitutions.map((inst) => (
            <article key={inst.id} className="card institution-card affiliated">
              <div className="card-row">
                <Pill variant={inst.kind === 'campus' ? 'green-pill' : 'purple-pill'}>
                  {inst.kind === 'campus' ? '🎓 CAMPUS' : '🛡️ ALUMNI'}
                </Pill>
                <span className="small muted">{inst.state}</span>
              </div>
              <div className="institution-head">
                <span className="rivalry-side-emoji">{inst.emoji}</span>
                <div>
                  <h3>{inst.name}</h3>
                  <p className="small muted">{inst.mottoOrTag}</p>
                </div>
              </div>
              {userCohortNotes[inst.id] ? (
                <p className="small" style={{ margin: '8px 0', color: '#183e35' }}>
                  Verified: <b>{userCohortNotes[inst.id]}</b>
                </p>
              ) : null}
              <button
                type="button"
                className="text-btn"
                style={{ marginTop: 'auto' }}
                onClick={() => openModal({ type: 'institutions', initialKind: inst.kind })}
              >
                View league leaderboard <Icon name="arrow" />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state compact">
          <Icon name="users" />
          <h3>No Campus or Secondary School Affiliations yet.</h3>
          <p>Represent your university, polytechnic, college of education, or former secondary school nationwide.</p>
          <div className="card-row" style={{ justifyContent: 'center' }}>
            <button
              type="button"
              className="btn dark"
              onClick={() => openModal({ type: 'institutions', initialKind: 'campus' })}
            >
              Verify My Campus
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() => openModal({ type: 'institutions', initialKind: 'alumni' })}
            >
              Verify My Secondary School
            </button>
          </div>
        </div>
      )}

      {/* OFFICIAL DERBY & FAN RECEIPTS SHELF */}
      <div className="section-heading" style={{ marginTop: '28px' }}>
        <div>
          <h2>Official Competition & Fan Receipts</h2>
          <p>Verified certificates from your Derbies, Fav Assessments, and Rivalry Rooms.</p>
        </div>
      </div>

      {userDerbyAttempts.length || userFavReceipts.length ? (
        <div className="two-cards">
          {userDerbyAttempts.map((att) => {
            const fixture = INITIAL_DERBY_FIXTURES.find((f) => f.id === att.derbyId);
            const side = fixture?.sides.find((s) => s.id === att.lockedSideId);
            return (
              <div key={att.receiptId} className="card receipt-confirmation-card" style={{ margin: 0 }}>
                <div className="card-row">
                  <Pill variant="green-pill">🏆 DERBY ATTEMPT RECEIPT</Pill>
                  <span className="small muted">{att.submittedAt}</span>
                </div>
                <h3>{fixture?.title || 'Derby Match'}</h3>
                <p>
                  Represented <b>{side?.name || 'Your Side'}</b> · Scored <b>{att.score}/5</b> correct.
                </p>
                <div className="card-row" style={{ marginTop: '10px' }}>
                  <code style={{ fontSize: '11px', background: '#ffffff88', padding: '3px 6px', borderRadius: '4px' }}>
                    {att.receiptId}
                  </code>
                  <button
                    type="button"
                    className="feed-action-btn"
                    onClick={() => handleShareReceipt(fixture?.title || 'Derby', att.receiptId)}
                  >
                    <Icon name="share" /> Share
                  </button>
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => openModal({ type: 'derby', derbyId: att.derbyId })}
                  >
                    View review
                  </button>
                </div>
              </div>
            );
          })}

          {userFavReceipts.map((fav, i) => (
            <div key={i} className="card receipt-confirmation-card" style={{ margin: 0 }}>
              <div className="card-row">
                <Pill variant="orange-pill">⚡ FAV AURA RECEIPT</Pill>
                <span className="small muted">{fav.totalPoints} Aura Pts</span>
              </div>
              <h3>
                {fav.favName} ({fav.fanbase})
              </h3>
              <p>
                Vibe Archetype: <b>{fav.vibeBadges.join(' · ')}</b>
              </p>
              <div className="card-row" style={{ marginTop: '10px' }}>
                <span className="small muted">Unlocked on this device</span>
                <button
                  type="button"
                  className="feed-action-btn"
                  onClick={() => handleShareReceipt(`${fav.favName} (${fav.fanbase})`, 'FAV-RECEIPT')}
                >
                  <Icon name="share" /> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state compact">
          <Icon name="trophy" />
          <h3>No competition receipts recorded yet.</h3>
          <p>
            Complete a round in the Flagship Derby, play your first "Your Feel About Your Fav" on the homepage, or enter a
            Rivalry Room to earn your first official receipt.
          </p>
          <button
            type="button"
            className="btn dark"
            onClick={() => onNavigate('home')}
          >
            Play on the Homepage
          </button>
        </div>
      )}

      {/* SAVED DETOURS */}
      <div className="section-heading" style={{ marginTop: '28px' }}>
        <h2>Saved for another little detour</h2>
        <a
          href="#discover"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('discover');
          }}
        >
          Browse discoveries <Icon name="arrow" />
        </a>
      </div>

      {savedPlaces.length ? (
        <div className="three-cards">
          {savedPlaces.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state compact">
          <Icon name="save" />
          <h3>Your saved places will live here.</h3>
          <p>Find something you like, then tap its bookmark.</p>
          <button
            type="button"
            className="btn dark"
            onClick={() => onNavigate('discover')}
          >
            Find my next discovery
          </button>
        </div>
      )}

      {state.drafts.length ? (
        <>
          <div className="section-heading">
            <h2>My correction drafts</h2>
            <span className="small muted">On this device · not submitted</span>
          </div>
          <div className="draft-list">
            {state.drafts.map((d, i) => (
              <div key={i} className="card">
                <b>{d.title}</b>
                <p>{d.text}</p>
                <span className="small muted">
                  Local draft · {new Date(d.date).toLocaleDateString('en-GB')}
                </span>
                <button
                  type="button"
                  className="text-btn"
                  onClick={() => openModal({ type: 'correction', index: i })}
                >
                  Edit draft <Icon name="arrow" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}

