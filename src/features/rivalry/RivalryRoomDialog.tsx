import React, { useState } from 'react';
import {
  INITIAL_RIVALRY_ROOMS,
  type RivalryRoom,
  type BanterComment
} from '../../data/rivalryData';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { award } from '../../domain/model';
import { usePassport } from '../../context/PassportContext';

export interface RivalryRoomDialogProps {
  roomId: string;
}

const ROOMS_STORAGE_KEY = 'rys.v15.rooms.v1';

function loadRoomState(roomId: string): RivalryRoom {
  const fallback =
    INITIAL_RIVALRY_ROOMS.find((r) => r.id === roomId || r.slug === roomId) ||
    INITIAL_RIVALRY_ROOMS[0];
  if (typeof window === 'undefined') return structuredClone(fallback);
  try {
    const raw = window.localStorage.getItem(ROOMS_STORAGE_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      if (map && map[fallback.id]) {
        return map[fallback.id];
      }
    }
  } catch {
    // ignore
  }
  return structuredClone(fallback);
}

function saveRoomState(room: RivalryRoom) {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(ROOMS_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[room.id] = room;
    window.localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function RivalryRoomDialog({ roomId }: RivalryRoomDialogProps) {
  const { state, persist, showToast, publishFeedActivity, browserServices } = usePassport();
  const [room, setRoom] = useState<RivalryRoom>(() => loadRoomState(roomId));
  const [selectedSideId, setSelectedSideId] = useState<string>(room.sides[0]?.id || '');
  const [votedReceiptSideId, setVotedReceiptSideId] = useState<string | null>(null);
  const [receiptPredictionNote, setReceiptPredictionNote] = useState('');
  const [banterInput, setBanterInput] = useState('');
  const [sideFilter, setSideFilter] = useState<string>('all');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [activeTab, setActiveTab] = useState<'banter' | 'receipts' | 'trivia'>('banter');

  // Mini fan trivia state inside room
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checkedAnswer, setCheckedAnswer] = useState(false);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaDone, setTriviaDone] = useState(false);

  const totalVotes = room.sides.reduce((acc, s) => acc + s.votes, 0) || 1;
  const currentSide = room.sides.find((s) => s.id === selectedSideId) || room.sides[0];

  const handleVoteReceipt = (sideId: string) => {
    const chosen = room.sides.find((s) => s.id === sideId);
    if (!chosen) return;

    const updated: RivalryRoom = {
      ...room,
      sides: room.sides.map((s) =>
        s.id === sideId
          ? { ...s, votes: s.votes + 1, supporters: s.supporters + (votedReceiptSideId ? 0 : 1) }
          : s
      )
    };
    setRoom(updated);
    saveRoomState(updated);
    setSelectedSideId(sideId);
    setVotedReceiptSideId(sideId);

    const nextState = structuredClone(state);
    const gained = award(nextState, `receipt:${room.id}`, 20);
    if (gained > 0) {
      persist(nextState);
    }

    publishFeedActivity({
      kind: 'checkin',
      actionText: `locked in a Receipt for ${chosen.name} in`,
      targetTitle: room.title,
      detailText: receiptPredictionNote.trim()
        ? `“${receiptPredictionNote.trim()}” — Backing ${chosen.fanbaseName} (${chosen.emoji})`
        : `Backed ${chosen.name} (${chosen.fanbaseName}) in The Receipts poll!`,
      xpGained: gained > 0 ? gained : undefined
    });

    showToast(
      gained > 0
        ? `Receipt locked for ${chosen.name}! +${gained} XP`
        : `Receipt updated for ${chosen.name}!`
    );
  };

  const handlePostBanter = (e: React.FormEvent) => {
    e.preventDefault();
    const text = banterInput.trim();
    if (text.length < 3) {
      showToast('Write at least a few words to join the banter.');
      return;
    }

    const newComment: BanterComment = {
      id: `bc-user-${Date.now()}`,
      author: `${state.nickname || 'Explorer'} · ${state.area || (state.city === 'lagos' ? 'Lagos' : 'Abuja')}`,
      sideId: currentSide.id,
      sideLabel: currentSide.fanbaseName,
      sideBg: currentSide.bg,
      sideColor: currentSide.color,
      text,
      timeLabel: 'Just now',
      cheers: 1,
      reps: 1,
      cheeredByMe: true,
      replies: []
    };

    const updated: RivalryRoom = {
      ...room,
      comments: [newComment, ...room.comments]
    };
    setRoom(updated);
    saveRoomState(updated);
    setBanterInput('');

    const nextState = structuredClone(state);
    const gained = award(nextState, `banter:${room.id}`, 15);
    if (gained > 0) {
      persist(nextState);
    }

    publishFeedActivity({
      kind: 'reflection',
      actionText: `dropped banter for ${currentSide.fanbaseName} in`,
      targetTitle: room.title,
      detailText: `“${text}”`,
      xpGained: gained > 0 ? gained : undefined
    });

    showToast(gained > 0 ? `Banter posted for ${currentSide.fanbaseName}! +${gained} XP` : 'Banter posted to the room!');
  };

  const handleCheerComment = (commentId: string) => {
    const updated: RivalryRoom = {
      ...room,
      comments: room.comments.map((c) => {
        if (c.id !== commentId) return c;
        const active = !c.cheeredByMe;
        return {
          ...c,
          cheeredByMe: active,
          cheers: Math.max(0, c.cheers + (active ? 1 : -1))
        };
      })
    };
    setRoom(updated);
    saveRoomState(updated);
  };

  const handleAddReply = (commentId: string) => {
    const text = replyInput.trim();
    if (!text) return;
    const updated: RivalryRoom = {
      ...room,
      comments: room.comments.map((c) => {
        if (c.id !== commentId) return c;
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: `rep-${Date.now()}`,
              author: state.nickname || 'Explorer',
              sideLabel: currentSide.fanbaseName,
              text,
              timeLabel: 'Just now'
            }
          ]
        };
      })
    };
    setRoom(updated);
    saveRoomState(updated);
    setReplyInput('');
    setReplyingToId(null);
    showToast('Reply added to the thread!');
  };

  const handleCallOutRival = async () => {
    const shareText = `🔥 I’m repping ${currentSide.name} (${currentSide.fanbaseName}) in "${room.title}" on Rep Your Side! Bring your receipts and defend your Side: ${
      typeof window !== 'undefined' ? window.location.origin : 'https://rep-your-side.vercel.app'
    }/#rivalry/${room.slug}`;
    const ok = await browserServices.copyText(shareText);
    showToast(
      ok
        ? 'Rival Call-Out link copied! Paste it in your group chat.'
        : 'Ready to share: ' + shareText
    );
  };

  const filteredComments =
    sideFilter === 'all'
      ? room.comments
      : room.comments.filter((c) => c.sideId === sideFilter);

  const currentQuestion = room.quizQuestions[qIndex];

  const handleCheckTrivia = () => {
    if (selectedOption === null || !currentQuestion) return;
    setCheckedAnswer(true);
    if (selectedOption === currentQuestion.correct) {
      setTriviaScore((prev) => prev + 1);
    }
  };

  const handleNextTrivia = () => {
    if (qIndex + 1 < room.quizQuestions.length) {
      setQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setCheckedAnswer(false);
    } else {
      setTriviaDone(true);
      const nextState = structuredClone(state);
      const gained = award(nextState, `room-trivia:${room.id}`, 40);
      if (gained > 0) {
        persist(nextState);
      }
      publishFeedActivity({
        kind: 'quiz',
        actionText: `completed the Fan Challenge in`,
        targetTitle: room.title,
        detailText: `Scored ${triviaScore}/${room.quizQuestions.length} repping ${currentSide.fanbaseName}!`,
        xpGained: gained > 0 ? gained : undefined
      });
      showToast(gained > 0 ? `Fan Challenge finished! +${gained} XP` : 'Fan Challenge complete!');
    }
  };

  return (
    <div className="rivalry-room-page">
      {/* Top Meta & Phase Banner */}
      <div className="rivalry-hero-banner">
        <div className="card-row">
          <Pill variant="orange-pill">{room.badgeLabel}</Pill>
          <span className="rivalry-phase-pill">{room.phase}</span>
        </div>
        <p className="rivalry-subtitle">{room.subtitle}</p>
        <div className="rivalry-prompt-box">
          <strong>THE DEBATE:</strong> {room.headlinePrompt}
        </div>

        {/* Choose Your Allegiance Bar */}
        <div className="rivalry-side-picker">
          <span className="eyebrow">1. PICK YOUR SIDE IN THIS ROOM:</span>
          <div className="rivalry-sides-grid">
            {room.sides.map((side) => {
              const pct = Math.round((side.votes / totalVotes) * 100);
              const isSelected = selectedSideId === side.id;
              return (
                <button
                  key={side.id}
                  type="button"
                  className={`rivalry-side-card ${isSelected ? 'active' : ''}`.trim()}
                  onClick={() => setSelectedSideId(side.id)}
                >
                  <div className="card-row">
                    <span className="rivalry-side-emoji">{side.emoji}</span>
                    <span
                      className="rivalry-fanbase-tag"
                      style={{ backgroundColor: side.bg, color: side.color }}
                    >
                      {side.fanbaseName}
                    </span>
                  </div>
                  <h4>{side.name}</h4>
                  <p>{side.tagline}</p>
                  <div className="rivalry-meter-track">
                    <span
                      style={{
                        width: `${pct}%`,
                        backgroundColor: side.color
                      }}
                    />
                  </div>
                  <div className="rivalry-side-stats">
                    <b>{pct}% of Receipts</b>
                    <span>{side.supporters.toLocaleString()} fans</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Strip: Call Out a Rival & Switch Tabs */}
        <div className="rivalry-action-bar">
          <div className="chips" role="tablist">
            <button
              type="button"
              className={`chip ${activeTab === 'banter' ? 'selected' : ''}`}
              onClick={() => setActiveTab('banter')}
            >
              💬 Live Banter ({room.comments.length})
            </button>
            <button
              type="button"
              className={`chip ${activeTab === 'receipts' ? 'selected' : ''}`}
              onClick={() => setActiveTab('receipts')}
            >
              🧾 The Receipts Poll
            </button>
            {room.quizQuestions.length > 0 ? (
              <button
                type="button"
                className={`chip ${activeTab === 'trivia' ? 'selected' : ''}`}
                onClick={() => setActiveTab('trivia')}
              >
                ⚡ Fan Trivia ({room.quizQuestions.length} Qs)
              </button>
            ) : null}
          </div>

          <button type="button" className="btn coral" onClick={handleCallOutRival}>
            <Icon name="share" /> Call Out a Rival
          </button>
        </div>
      </div>

      {/* Banter of the Match Highlights */}
      <div className="banter-of-match-section">
        <div className="card-row">
          <span className="eyebrow">🔥 BANTER OF THE MATCH · FEATURED FAN TAKES</span>
          <span className="small muted">Curated from standout Side comments</span>
        </div>
        <div className="banter-featured-grid">
          {room.banterOfTheMatch.map((feat, idx) => (
            <div key={idx} className="banter-featured-card">
              <div className="card-row">
                <Pill variant="green-pill">{feat.sideLabel}</Pill>
                <span className="small muted">👏 {feat.cheers} cheers</span>
              </div>
              <blockquote>“{feat.quote}”</blockquote>
              <cite>— {feat.author}</cite>
            </div>
          ))}
        </div>
      </div>

      {/* TAB 1: LIVE BANTER */}
      {activeTab === 'banter' ? (
        <div className="rivalry-banter-container">
          <form className="banter-composer" onSubmit={handlePostBanter}>
            <div className="card-row">
              <span className="eyebrow">
                POSTING AS {(state.nickname || 'EXPLORER').toUpperCase()} · REPPING{' '}
                {currentSide.fanbaseName.toUpperCase()} {currentSide.emoji}
              </span>
              <span className="small muted">+15 XP first comment</span>
            </div>
            <div className="banter-input-row">
              <input
                type="text"
                value={banterInput}
                onChange={(e) => setBanterInput(e.target.value)}
                placeholder={`Defend ${currentSide.name} or drop a receipt for the opposing fanbase...`}
                maxLength={280}
              />
              <button type="submit" className="btn dark">
                Post Banter <Icon name="arrow" />
              </button>
            </div>
          </form>

          <div className="filter-row">
            <div className="chips">
              <button
                type="button"
                className={`chip ${sideFilter === 'all' ? 'selected' : ''}`}
                onClick={() => setSideFilter('all')}
              >
                All Sides ({room.comments.length})
              </button>
              {room.sides.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`chip ${sideFilter === s.id ? 'selected' : ''}`}
                  onClick={() => setSideFilter(s.id)}
                >
                  {s.emoji} {s.fanbaseName}
                </button>
              ))}
            </div>
          </div>

          <div className="banter-feed-list">
            {filteredComments.map((c) => (
              <article key={c.id} className="banter-comment-card">
                <div className="card-row">
                  <div className="banter-author-meta">
                    <span
                      className="banter-side-pill"
                      style={{ backgroundColor: c.sideBg, color: c.sideColor }}
                    >
                      {c.sideLabel}
                    </span>
                    <b>{c.author}</b>
                  </div>
                  <span className="small muted">{c.timeLabel}</span>
                </div>

                <p className="banter-comment-text">{c.text}</p>

                <div className="banter-comment-actions">
                  <button
                    type="button"
                    className={`feed-action-btn ${c.cheeredByMe ? 'active' : ''}`}
                    onClick={() => handleCheerComment(c.id)}
                  >
                    🔥 {c.cheers} Cheers
                  </button>
                  <button
                    type="button"
                    className="feed-action-btn"
                    onClick={() =>
                      setReplyingToId(replyingToId === c.id ? null : c.id)
                    }
                  >
                    💬 Reply ({c.replies.length})
                  </button>
                </div>

                {c.replies.length > 0 ? (
                  <div className="banter-replies">
                    {c.replies.map((r) => (
                      <div key={r.id} className="banter-reply-item">
                        <b>{r.author}</b> <span className="small muted">({r.sideLabel})</span>:{' '}
                        {r.text}
                      </div>
                    ))}
                  </div>
                ) : null}

                {replyingToId === c.id ? (
                  <div className="banter-reply-box">
                    <input
                      type="text"
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder={`Reply to ${c.author}...`}
                    />
                    <button
                      type="button"
                      className="btn dark"
                      onClick={() => handleAddReply(c.id)}
                    >
                      Send
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {/* TAB 2: THE RECEIPTS POLL */}
      {activeTab === 'receipts' ? (
        <div className="rivalry-receipts-box">
          <div className="card-row">
            <Pill variant="orange-pill">🧾 THE RECEIPTS · FREE PREDICTION</Pill>
            <span className="small muted">{room.cutoffLabel}</span>
          </div>
          <h3>{room.receiptQuestion}</h3>
          <p>
            Lock in your call before the cutoff. No stakes or cash—just pure bragging
            rights and a shareable Receipt card when the result drops!
          </p>

          <div className="field">
            <label htmlFor="receipt-note">Optional 1-line prediction note (e.g. scoreline or bold call):</label>
            <input
              id="receipt-note"
              type="text"
              value={receiptPredictionNote}
              onChange={(e) => setReceiptPredictionNote(e.target.value)}
              placeholder="e.g. 2 goals and Man of the Match! Keep this receipt."
            />
          </div>

          <div className="receipts-vote-grid">
            {room.sides.map((s) => {
              const pct = Math.round((s.votes / totalVotes) * 100);
              const isVoted = votedReceiptSideId === s.id;
              return (
                <div
                  key={s.id}
                  className={`receipt-vote-card ${isVoted ? 'voted' : ''}`}
                >
                  <div className="card-row">
                    <span className="rivalry-side-emoji">{s.emoji}</span>
                    <b>{pct}% of fans</b>
                  </div>
                  <h4>{s.name}</h4>
                  <p className="small muted">{s.votes.toLocaleString()} locked receipts</p>
                  <button
                    type="button"
                    className={isVoted ? 'btn coral full' : 'btn dark full'}
                    onClick={() => handleVoteReceipt(s.id)}
                  >
                    {isVoted ? '✓ Receipt Locked' : `Lock Receipt for ${s.shortCode}`}
                  </button>
                </div>
              );
            })}
          </div>

          {votedReceiptSideId ? (
            <div className="receipt-confirmation-card">
              <span className="eyebrow">OFFICIAL FAN RECEIPT SNAPSHOT</span>
              <h4>
                {state.nickname || 'Explorer'} backed{' '}
                {room.sides.find((s) => s.id === votedReceiptSideId)?.name}
              </h4>
              {receiptPredictionNote ? <p>“{receiptPredictionNote}”</p> : null}
              <span className="small muted">
                Receipt ID: #RYS-REC-{room.id.toUpperCase().slice(0, 8)} · Verified Local Stamp
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* TAB 3: FAN TRIVIA */}
      {activeTab === 'trivia' ? (
        <div className="rivalry-trivia-box">
          {!triviaDone && currentQuestion ? (
            <>
              <div className="card-row">
                <Pill variant="purple-pill">
                  FAN CHALLENGE · QUESTION {qIndex + 1} OF {room.quizQuestions.length}
                </Pill>
                <span className="reward">+40 XP on completion</span>
              </div>
              <h3>{currentQuestion.q}</h3>
              <div className="options">
                {currentQuestion.a.map((opt, idx) => {
                  let cls = 'option';
                  if (selectedOption === idx) cls += ' selected';
                  if (checkedAnswer) {
                    if (idx === currentQuestion.correct) cls += ' correct';
                    else if (selectedOption === idx) cls += ' wrong';
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={cls}
                      disabled={checkedAnswer}
                      onClick={() => setSelectedOption(idx)}
                    >
                      <span>{String.fromCharCode(65 + idx)}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {checkedAnswer ? (
                <div className="explanation">
                  <b>
                    {selectedOption === currentQuestion.correct
                      ? 'Spot on! Ball & culture knowledge verified.'
                      : 'Good try — here is the receipt:'}
                  </b>
                  <p>{currentQuestion.why}</p>
                </div>
              ) : null}
              <div className="modal-actions">
                {!checkedAnswer ? (
                  <button
                    type="button"
                    className="btn dark"
                    disabled={selectedOption === null}
                    onClick={handleCheckTrivia}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn coral"
                    onClick={handleNextTrivia}
                  >
                    {qIndex + 1 < room.quizQuestions.length
                      ? 'Next Question'
                      : 'Finish & Claim XP'}{' '}
                    <Icon name="arrow" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="receipt-confirmation-card">
              <span className="eyebrow">FAN CHALLENGE COMPLETED</span>
              <h3>
                You scored {triviaScore} / {room.quizQuestions.length} for{' '}
                {currentSide.fanbaseName}!
              </h3>
              <p>
                Your fan challenge score has been added to the {currentSide.name}{' '}
                supporter tally.
              </p>
              <button
                type="button"
                className="btn outline"
                onClick={() => {
                  setQIndex(0);
                  setSelectedOption(null);
                  setCheckedAnswer(false);
                  setTriviaScore(0);
                  setTriviaDone(false);
                }}
              >
                Play Again (Practice)
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
