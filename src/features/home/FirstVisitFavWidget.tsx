import { useState } from 'react';
import {
  INITIAL_FAV_ASSESSMENTS,
  type FavAssessment
} from '../../data/rivalryData';
import { MAIN_COUNTRY_LIST } from '../../data/countries';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { award } from '../../domain/model';
import { usePassport } from '../../context/PassportContext';

const FAV_STORAGE_KEY = 'rys.v15.favs.v1';

interface CompletedFavReceipt {
  assessmentId: string;
  favId: string;
  favName: string;
  fanbase: string;
  vibeBadges: string[];
  totalPoints: number;
  completedAt: string;
}

function loadFavState(): {
  assessments: FavAssessment[];
  receipts: Record<string, CompletedFavReceipt>;
} {
  if (typeof window === 'undefined') {
    return {
      assessments: structuredClone(INITIAL_FAV_ASSESSMENTS),
      receipts: {}
    };
  }
  try {
    const raw = window.localStorage.getItem(FAV_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.assessments)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return {
    assessments: structuredClone(INITIAL_FAV_ASSESSMENTS),
    receipts: {}
  };
}

function saveFavState(data: {
  assessments: FavAssessment[];
  receipts: Record<string, CompletedFavReceipt>;
}) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function FirstVisitFavWidget() {
  const {
    state,
    persist,
    showToast,
    publishFeedActivity,
    openModal,
    selectedCountry,
    setSelectedCountry,
    selectedCountryHub
  } = usePassport();
  const [store, setStore] = useState(() => loadFavState());
  const [activeAssessmentId, setActiveAssessmentId] = useState<string>(
    INITIAL_FAV_ASSESSMENTS[0].id
  );
  const [selectedFavId, setSelectedFavId] = useState<string>(
    INITIAL_FAV_ASSESSMENTS[0].favOptions[0].id
  );
  const [promptAnswers, setPromptAnswers] = useState<Record<string, number>>({});
  const [customFeelNote, setCustomFeelNote] = useState('');
  const [expandedAssessment, setExpandedAssessment] = useState<boolean>(true);

  const currentAssessment =
    store.assessments.find((a) => a.id === activeAssessmentId) ||
    store.assessments[0];

  const visibleFavOptions = currentAssessment.favOptions.slice(0, 3);

  const currentFav =
    visibleFavOptions.find((f) => f.id === selectedFavId) ||
    visibleFavOptions[0];

  const existingReceipt = store.receipts[currentAssessment.id];
  const totalVotes =
    visibleFavOptions.reduce((acc, f) => acc + f.votes, 0) || 1;

  const handleSwitchCategory = (assessment: FavAssessment) => {
    setActiveAssessmentId(assessment.id);
    setSelectedFavId(assessment.favOptions[0].id);
    setPromptAnswers({});
    setCustomFeelNote('');
  };

  const handleSelectPromptOption = (promptId: string, optionIdx: number) => {
    setPromptAnswers((prev) => ({ ...prev, [promptId]: optionIdx }));
  };

  const handleCompleteFavAssessment = () => {
    const badges: string[] = [];
    let pts = 0;

    currentAssessment.prompts.forEach((p) => {
      const idx = promptAnswers[p.id] ?? 0;
      const chosen = p.options[idx] || p.options[0];
      if (chosen) {
        badges.push(chosen.vibeTag);
        pts += chosen.points;
      }
    });

    const receipt: CompletedFavReceipt = {
      assessmentId: currentAssessment.id,
      favId: currentFav.id,
      favName: currentFav.name,
      fanbase: currentFav.fanbase,
      vibeBadges: badges,
      totalPoints: pts,
      completedAt: 'Just now'
    };

    const updatedAssessments = store.assessments.map((a) => {
      if (a.id !== currentAssessment.id) return a;
      return {
        ...a,
        participantsCount: a.participantsCount + 1,
        favOptions: a.favOptions.map((f) =>
          f.id === currentFav.id ? { ...f, votes: f.votes + 1 } : f
        )
      };
    });

    const nextStore = {
      assessments: updatedAssessments,
      receipts: { ...store.receipts, [currentAssessment.id]: receipt }
    };

    setStore(nextStore);
    saveFavState(nextStore);

    const nextState = structuredClone(state);
    const gained = award(
      nextState,
      `fav-assessment:${currentAssessment.id}`,
      currentAssessment.xpReward
    );
    if (gained > 0) {
      persist(nextState);
    }

    publishFeedActivity({
      kind: 'quiz',
      actionText: `completed "Your Feel About Your Fav" repping ${currentFav.name} (${currentFav.fanbase}) —`,
      targetTitle: currentAssessment.title,
      detailText: customFeelNote.trim()
        ? `“${customFeelNote.trim()}” · Unlocked badges: ${badges.join(' · ')}`
        : `Unlocked Fan Archetype: ${badges.join(' · ')} (${pts} Aura Pts)`,
      xpGained: gained > 0 ? gained : undefined
    });

    showToast(
      gained > 0
        ? `Fav Receipt unlocked for ${currentFav.name}! +${gained} XP`
        : `Updated your Fav Receipt for ${currentFav.name}!`
    );
  };

  const correspondingRoomId =
    currentAssessment.category === 'football-players'
      ? 'room-osimhen-lookman'
      : currentAssessment.category === 'artists-celebs'
      ? 'room-big3-afrobeats'
      : currentAssessment.category === 'nollywood-creators'
      ? 'room-nollywood-royalty'
      : 'room-arsenal-chelsea';

  return (
    <section className="card fav-assessment-widget" aria-label="Your Feel About Your Fav Instant Play">
      <div className="fav-widget-header">
        <div>
          <div className="card-row" style={{ marginBottom: '6px' }}>
            <Pill variant="orange-pill">⚡ FIRST-VISIT INSTANT PLAY · YOUR FEEL ABOUT YOUR FAV</Pill>
            <span className="reward">+{currentAssessment.xpReward} XP · No sign-up wall</span>
          </div>
          <h2>Pick your Fav, rate the vibe &amp; claim your Receipt.</h2>
          <p className="muted">
            Jump straight in on your first visit—football players, Afrobeats icons, screen stars, or your city side.
          </p>
        </div>
        <button
          type="button"
          className="btn outline"
          onClick={() => setExpandedAssessment((prev) => !prev)}
        >
          {expandedAssessment ? 'Compact View' : 'Expand Assessment'}
        </button>
      </div>

      {/* Country Jurisdiction Filter Bar */}
      <div className="fav-country-bar" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px', padding: '8px 12px', background: '#f5f4ea', borderRadius: '10px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#183e35' }}>
          🌍 Repping Jurisdiction:
        </span>
        <div className="chips" style={{ margin: 0 }}>
          {MAIN_COUNTRY_LIST.map((c) => (
            <button
              key={c.code}
              type="button"
              className={`chip ${selectedCountry === c.code ? 'selected' : ''}`}
              style={{ padding: '3px 10px', fontSize: '0.82rem' }}
              onClick={() => setSelectedCountry(c.code)}
            >
              {c.flag} {c.shortLabel}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '0.78rem', color: '#666', marginLeft: 'auto' }}>
          Hub: <strong>{selectedCountryHub}</strong>
        </span>
      </div>

      {/* Category Switcher Tabs */}
      <div className="chips fav-category-tabs" role="tablist" aria-label="Fav Assessment Categories">
        {store.assessments.map((item) => {
          const isSelected = item.id === currentAssessment.id;
          const isDone = !!store.receipts[item.id];
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`chip ${isSelected ? 'selected' : ''}`.trim()}
              onClick={() => handleSwitchCategory(item)}
            >
              {item.categoryLabel} {isDone ? '✓' : ''}
            </button>
          );
        })}
      </div>

      {/* Step 1: Pick Your Fav Grid (Always Visible for 1-Click Engagement) */}
      <div className="fav-step-label">
        <span className="eyebrow">
          STEP 1 · TAP YOUR FAV ({currentAssessment.participantsCount.toLocaleString()} FANS VOTED)
        </span>
      </div>

      <div className="fav-options-grid">
        {visibleFavOptions.map((fav) => {
          const pct = Math.round((fav.votes / totalVotes) * 100);
          const isChosen = currentFav.id === fav.id;
          return (
            <button
              key={fav.id}
              type="button"
              className={`fav-option-card ${isChosen ? 'selected' : ''}`.trim()}
              onClick={() => setSelectedFavId(fav.id)}
            >
              <div className="card-row">
                <span className="fav-emoji">{fav.emoji}</span>
                <span
                  className="rivalry-fanbase-tag"
                  style={{ backgroundColor: fav.bg, color: fav.color }}
                >
                  {fav.fanbase}
                </span>
              </div>
              <h3>{fav.name}</h3>
              <p className="small muted">{fav.subtitle}</p>
              <div className="rivalry-meter-track">
                <span style={{ width: `${pct}%`, backgroundColor: fav.color }} />
              </div>
              <div className="rivalry-side-stats">
                <b>{pct}% community vote</b>
                <span>{fav.TraitTag}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step 2: Quick 3-Tap Assessment & Feel Input */}
      {expandedAssessment ? (
        <div className="fav-prompts-section">
          <div className="fav-step-label">
            <span className="eyebrow">
              STEP 2 · YOUR FEEL ABOUT {currentFav.name.toUpperCase()} (3 QUICK TAPS)
            </span>
          </div>

          <div className="fav-prompts-grid">
            {currentAssessment.prompts.map((prompt) => {
              const chosenIdx = promptAnswers[prompt.id] ?? 0;
              return (
                <div key={prompt.id} className="fav-prompt-box">
                  <h4>{prompt.question}</h4>
                  <div className="fav-prompt-choices">
                    {prompt.options.map((opt, idx) => {
                      const active = chosenIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`fav-choice-btn ${active ? 'active' : ''}`}
                          onClick={() => handleSelectPromptOption(prompt.id, idx)}
                        >
                          <span className="fav-choice-radio">{active ? '●' : '○'}</span>
                          <div>
                            <span>{opt.label}</span>
                            <small className="fav-vibe-tag">{opt.vibeTag}</small>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="fav-submit-bar">
            <input
              type="text"
              value={customFeelNote}
              onChange={(e) => setCustomFeelNote(e.target.value)}
              placeholder={`Optional: Drop your 1-line receipt or shoutout for ${currentFav.name}...`}
              maxLength={200}
            />
            <button
              type="button"
              className="btn coral"
              onClick={handleCompleteFavAssessment}
            >
              Lock My Feel for {currentFav.name} (+{currentAssessment.xpReward} XP){' '}
              <Icon name="arrow" />
            </button>
            <button
              type="button"
              className="btn dark"
              onClick={() =>
                openModal({ type: 'rivalry-room', roomId: correspondingRoomId })
              }
            >
              Join Live Banter Room <Icon name="arrow" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Step 3: Unlocked Fan Receipt Banner */}
      {existingReceipt ? (
        <div className="fav-receipt-unlocked">
          <div className="card-row">
            <Pill variant="green-pill">
              ✓ OFFICIAL FAV RECEIPT · {existingReceipt.fanbase.toUpperCase()}
            </Pill>
            <span className="small muted">
              Aura Score: {existingReceipt.totalPoints} pts
            </span>
          </div>
          <h4>
            {state.nickname || 'Explorer'} reps {existingReceipt.favName} —{' '}
            {existingReceipt.vibeBadges.join(' · ')}
          </h4>
        </div>
      ) : null}
    </section>
  );
}

