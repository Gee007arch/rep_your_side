import { useState } from 'react';
import {
  INITIAL_DERBY_FIXTURES,
  type DerbyFixture
} from '../../data/rivalryData';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { award } from '../../domain/model';
import { usePassport } from '../../context/PassportContext';

export interface DerbyMatchDialogProps {
  derbyId: string;
}

const DERBY_STORAGE_KEY = 'rys.v15.derbies.v1';

interface SavedDerbyAttempt {
  derbyId: string;
  lockedSideId: string;
  answers: number[];
  submitted: boolean;
  score: number;
  receiptId: string;
  submittedAt: string;
}

function loadDerbyFixture(derbyId: string): DerbyFixture {
  const fallback =
    INITIAL_DERBY_FIXTURES.find((d) => d.id === derbyId || d.slug === derbyId) ||
    INITIAL_DERBY_FIXTURES[0];
  if (typeof window === 'undefined') return structuredClone(fallback);
  try {
    const raw = window.localStorage.getItem(DERBY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.fixtures?.[fallback.id]) {
        return parsed.fixtures[fallback.id];
      }
    }
  } catch {
    // ignore
  }
  return structuredClone(fallback);
}

function loadDerbyAttempt(derbyId: string): SavedDerbyAttempt | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DERBY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.attempts?.[derbyId] || null;
    }
  } catch {
    // ignore
  }
  return null;
}

function saveDerbyData(fixture: DerbyFixture, attempt: SavedDerbyAttempt | null) {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(DERBY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : { fixtures: {}, attempts: {} };
    parsed.fixtures = parsed.fixtures || {};
    parsed.attempts = parsed.attempts || {};
    parsed.fixtures[fixture.id] = fixture;
    if (attempt) {
      parsed.attempts[fixture.id] = attempt;
    }
    window.localStorage.setItem(DERBY_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore
  }
}

export function DerbyMatchDialog({ derbyId }: DerbyMatchDialogProps) {
  const { state, persist, showToast, publishFeedActivity, browserServices } = usePassport();
  const [fixture, setFixture] = useState<DerbyFixture>(() => loadDerbyFixture(derbyId));
  const [attempt, setAttempt] = useState<SavedDerbyAttempt | null>(() =>
    loadDerbyAttempt(fixture.id)
  );
  const [chosenSideId, setChosenSideId] = useState<string>(
    attempt?.lockedSideId || fixture.sides[0]?.id || ''
  );
  const [qIdx, setQIdx] = useState<number>(0);
  const [showReview, setShowReview] = useState<boolean>(false);

  const lockedSide = fixture.sides.find(
    (s) => s.id === (attempt?.lockedSideId || chosenSideId)
  ) || fixture.sides[0];

  // Calculate exact accuracy percentage per side (§5 of Guide)
  const getSideAccuracy = (s: DerbyFixture['sides'][number]) => {
    if (s.totalQuestionsAttempted <= 0) return 0;
    return (s.totalCorrect / s.totalQuestionsAttempted) * 100;
  };

  const bothMeetTurnout = fixture.sides.every(
    (s) => s.eligibleTurnout >= fixture.minTurnoutPerSide
  );

  const sideA = fixture.sides[0];
  const sideB = fixture.sides[1];
  const accA = getSideAccuracy(sideA);
  const accB = getSideAccuracy(sideB);

  let matchStandingLabel = 'OFFICIAL QUALIFYING DERBY';
  if (!bothMeetTurnout) {
    matchStandingLabel = 'EXHIBITION (AWAITING MIN. TURNOUT)';
  } else if (Math.abs(accA - accB) < 0.01) {
    matchStandingLabel = 'OFFICIAL DRAW';
  }

  const handleStartAttempt = () => {
    if (attempt) return;
    const newAttempt: SavedDerbyAttempt = {
      derbyId: fixture.id,
      lockedSideId: chosenSideId,
      answers: Array(fixture.questions.length).fill(-1),
      submitted: false,
      score: 0,
      receiptId: '',
      submittedAt: ''
    };
    setAttempt(newAttempt);
    saveDerbyData(fixture, newAttempt);
    showToast(`Side locked to ${lockedSide.name} for this fixture!`);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!attempt || attempt.submitted) return;
    const updatedAnswers = [...attempt.answers];
    updatedAnswers[qIdx] = optionIndex;
    const updatedAttempt = { ...attempt, answers: updatedAnswers };
    setAttempt(updatedAttempt);
    saveDerbyData(fixture, updatedAttempt);
  };

  const handleSubmitAttempt = () => {
    if (!attempt || attempt.submitted) return;
    if (attempt.answers.some((a) => a < 0)) {
      showToast('Please answer all questions before final submission.');
      return;
    }

    const correctCount = attempt.answers.reduce((acc, ans, idx) => {
      return acc + (ans === fixture.questions[idx]?.correct ? 1 : 0);
    }, 0);

    const receiptCode = `RYS-DERBY-${fixture.id.slice(-5).toUpperCase()}-${Date.now()
      .toString(36)
      .slice(-4)
      .toUpperCase()}`;

    const finalizedAttempt: SavedDerbyAttempt = {
      ...attempt,
      submitted: true,
      score: correctCount,
      receiptId: receiptCode,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedFixture: DerbyFixture = {
      ...fixture,
      sides: fixture.sides.map((s) =>
        s.id === attempt.lockedSideId
          ? {
              ...s,
              eligibleTurnout: s.eligibleTurnout + 1,
              totalCorrect: s.totalCorrect + correctCount,
              totalQuestionsAttempted: s.totalQuestionsAttempted + fixture.questions.length
            }
          : s
      )
    };

    setFixture(updatedFixture);
    setAttempt(finalizedAttempt);
    saveDerbyData(updatedFixture, finalizedAttempt);

    const nextState = structuredClone(state);
    const gained = award(nextState, `derby:${fixture.id}`, 60);
    if (gained > 0) {
      persist(nextState);
    }

    publishFeedActivity({
      kind: 'quiz',
      actionText: `submitted an official Derby score (${correctCount}/${fixture.questions.length}) for ${lockedSide.name} in`,
      targetTitle: fixture.title,
      detailText: `Receipt ${receiptCode} · Pushed ${lockedSide.name} turnout to ${
        lockedSide.eligibleTurnout + 1
      } players!`,
      xpGained: gained > 0 ? gained : undefined
    });

    showToast(
      gained > 0
        ? `Derby attempt submitted! Receipt ${receiptCode} · +${gained} XP`
        : `Derby attempt recorded! Receipt ${receiptCode}`
    );
  };

  const handleCheerSide = (sideId: string) => {
    const updatedFixture: DerbyFixture = {
      ...fixture,
      sides: fixture.sides.map((s) =>
        s.id === sideId ? { ...s, cheers: s.cheers + 1 } : s
      )
    };
    setFixture(updatedFixture);
    saveDerbyData(updatedFixture, attempt);
    showToast('Preset cheer added for your Side!');
  };

  const handleShareDerby = async () => {
    const msg = `🏆 Defend your Side in "${fixture.title}" on Rep Your Side! I’m repping ${lockedSide.name}. Play the 5-question round here: ${
      typeof window !== 'undefined' ? window.location.origin : 'https://rep-your-side.vercel.app'
    }/#derbies/${fixture.slug}`;
    const ok = await browserServices.copyText(msg);
    showToast(ok ? 'Derby challenge link copied!' : msg);
  };

  const currentQ = fixture.questions[qIdx];

  return (
    <div className="derby-match-page">
      {/* Scoreboard Header */}
      <div className="derby-scoreboard-card">
        <div className="card-row">
          <Pill variant="orange-pill">{fixture.editionLabel}</Pill>
          <span className="rivalry-phase-pill">{matchStandingLabel}</span>
        </div>

        <p className="rivalry-subtitle">{fixture.subtitle}</p>
        <div className="small muted" style={{ marginBottom: '14px' }}>
          ⏱ {fixture.deadlineLabel} · Formula: Total Correct ÷ (Eligible Turnout × Questions)
        </div>

        <div className="derby-versus-grid">
          {fixture.sides.map((s) => {
            const acc = getSideAccuracy(s).toFixed(1);
            const turnoutPct = Math.min(
              100,
              Math.round((s.eligibleTurnout / fixture.minTurnoutPerSide) * 100)
            );
            const isLocked = (attempt?.lockedSideId || chosenSideId) === s.id;
            return (
              <div
                key={s.id}
                className={`derby-side-box ${isLocked ? 'locked-side' : ''}`}
              >
                <div className="card-row">
                  <span className="rivalry-side-emoji">{s.emoji}</span>
                  {attempt?.lockedSideId === s.id ? (
                    <Pill variant="green-pill">🔒 YOUR LOCKED SIDE</Pill>
                  ) : null}
                </div>
                <h3>{s.name}</h3>
                <div className="derby-big-score">{acc}%</div>
                <span className="small muted">Average Accuracy Score</span>

                <div className="rivalry-meter-track" style={{ marginTop: '10px' }}>
                  <span
                    style={{
                      width: `${turnoutPct}%`,
                      backgroundColor: s.color
                    }}
                  />
                </div>
                <div className="rivalry-side-stats">
                  <span>
                    Turnout: <b>{s.eligibleTurnout}</b> / {fixture.minTurnoutPerSide} min
                  </span>
                  <button
                    type="button"
                    className="feed-action-btn"
                    onClick={() => handleCheerSide(s.id)}
                  >
                    👏 {s.cheers} Cheers
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* State 1: Not yet started attempt -> Choose Side & Lock */}
      {!attempt ? (
        <div className="card derby-action-panel">
          <span className="eyebrow">STEP 1 · CHOOSE & LOCK YOUR ELIGIBLE SIDE</span>
          <h3>Which Side are you representing in this fixture?</h3>
          <p>
            Once you begin your scored attempt, your Side is locked for this event. Changing
            your Passport Side later will not move this attempt.
          </p>

          <div className="rivalry-sides-grid" style={{ margin: '16px 0' }}>
            {fixture.sides.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`rivalry-side-card ${chosenSideId === s.id ? 'active' : ''}`}
                onClick={() => setChosenSideId(s.id)}
              >
                <span className="rivalry-side-emoji">{s.emoji}</span>
                <h4>{s.name}</h4>
                <span className="small muted">
                  {chosenSideId === s.id ? '✓ Selected to Lock' : 'Tap to represent'}
                </span>
              </button>
            ))}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn coral" onClick={handleStartAttempt}>
              Lock {lockedSide.name} & Start Scored Round <Icon name="arrow" />
            </button>
            <button type="button" className="btn outline" onClick={handleShareDerby}>
              <Icon name="share" /> Call Out a Rival
            </button>
          </div>
        </div>
      ) : null}

      {/* State 2: In-progress attempt */}
      {attempt && !attempt.submitted && currentQ ? (
        <div className="card derby-action-panel">
          <div className="card-row">
            <Pill variant="green-pill">
              🔒 LOCKED SIDE: {lockedSide.name.toUpperCase()}
            </Pill>
            <span className="small muted">
              Question {qIdx + 1} of {fixture.questions.length} · Draft Saved ✓
            </span>
          </div>

          <h3 style={{ marginTop: '12px' }}>{currentQ.q}</h3>

          <div className="options">
            {currentQ.a.map((opt, idx) => {
              const isSelected = attempt.answers[qIdx] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(idx)}
                >
                  <span>{String.fromCharCode(65 + idx)}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn outline"
              disabled={qIdx === 0}
              onClick={() => setQIdx((p) => Math.max(0, p - 1))}
            >
              ← Previous
            </button>

            {qIdx + 1 < fixture.questions.length ? (
              <button
                type="button"
                className="btn dark"
                disabled={attempt.answers[qIdx] < 0}
                onClick={() => setQIdx((p) => p + 1)}
              >
                Save & Next <Icon name="arrow" />
              </button>
            ) : (
              <button
                type="button"
                className="btn coral"
                disabled={attempt.answers.some((a) => a < 0)}
                onClick={handleSubmitAttempt}
              >
                Submit Official Attempt <Icon name="check" />
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* State 3: Submitted -> Show Official Receipt & Answer Disclosure */}
      {attempt && attempt.submitted ? (
        <div className="card derby-receipt-panel">
          <div className="receipt-confirmation-card">
            <div className="card-row">
              <Pill variant="green-pill">✓ OFFICIAL SUBMISSION RECEIPT</Pill>
              <span className="small muted">Recorded at {attempt.submittedAt}</span>
            </div>
            <h3>
              {state.nickname || 'Explorer'} scored {attempt.score} /{' '}
              {fixture.questions.length} for {lockedSide.name}
            </h3>
            <p>
              Receipt ID: <b>{attempt.receiptId}</b> · Your score is locked into{' '}
              {lockedSide.name}’s provisional average accuracy!
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn dark"
                onClick={() => setShowReview((prev) => !prev)}
              >
                {showReview ? 'Hide Answer Review' : 'View Official Answer Review'}
              </button>
              <button type="button" className="btn coral" onClick={handleShareDerby}>
                <Icon name="share" /> Share & Call Out a Rival
              </button>
            </div>
          </div>

          {showReview ? (
            <div className="derby-review-list" style={{ marginTop: '18px' }}>
              <h4>Official Question & Answer Disclosure</h4>
              {fixture.questions.map((q, i) => {
                const userAns = attempt.answers[i];
                const isCorrect = userAns === q.correct;
                return (
                  <div key={i} className="explanation" style={{ marginBottom: '12px' }}>
                    <b>
                      Q{i + 1}: {q.q}
                    </b>
                    <p>
                      Your answer: <b>{q.a[userAns] ?? 'None'}</b>{' '}
                      {isCorrect ? '✓ (Correct)' : `✗ (Correct: ${q.a[q.correct]})`}
                    </p>
                    <p className="small muted">{q.why}</p>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

