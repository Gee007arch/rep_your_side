import React, { useState } from 'react';
import type { FeedActivityItem } from '../../data/community';
import { SIDE_STANDINGS } from '../../data/community';
import { xp } from '../../domain/model';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { usePassport } from '../../context/PassportContext';

type FeedFilter = 'all' | 'myside' | 'quiz' | 'reflection' | 'discovery';

export function LiveFeedSection() {
  const {
    state,
    catalog,
    communityFeed,
    toggleFeedReaction,
    addFeedComment,
    postSideCheckin,
    simulateLivePulse,
    openModal
  } = usePassport();

  const [activeFilter, setActiveFilter] = useState<FeedFilter>('all');
  const [checkinText, setCheckinText] = useState('');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    'feed-lg-1': true,
    'feed-ab-1': true
  });
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const currentCity = catalog.getCity(state.city);
  const userScore = xp(state);
  const cityStandings = SIDE_STANDINGS[state.city] || [];

  const totalExplorers =
    cityStandings.reduce((acc, s) => acc + s.explorers, 0) + (state.area ? 1 : 0);
  const totalCityXp =
    cityStandings.reduce((acc, s) => acc + s.baseXp, 0) + userScore;
  const totalDiscoveries =
    cityStandings.reduce((acc, s) => acc + s.discoveries, 0) + state.read.length;
  const activeRightNow =
    cityStandings.reduce((acc, s) => acc + s.activeNow, 0) + 1;

  const cityFeed = communityFeed.filter((item) => item.city === state.city);

  const filteredFeed = cityFeed.filter((item) => {
    if (activeFilter === 'myside') {
      return state.area ? item.area.toLowerCase() === state.area.toLowerCase() : true;
    }
    if (activeFilter === 'quiz') {
      return item.kind === 'quiz' || item.kind === 'story';
    }
    if (activeFilter === 'reflection') {
      return item.kind === 'reflection' || item.kind === 'checkin' || item.kind === 'circle';
    }
    if (activeFilter === 'discovery') {
      return item.kind === 'discovery';
    }
    return true;
  });

  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postSideCheckin(checkinText)) {
      setCheckinText('');
    }
  };

  const handleReplySubmit = (e: React.FormEvent, itemId: string) => {
    e.preventDefault();
    const draft = replyDrafts[itemId] || '';
    if (addFeedComment(itemId, draft)) {
      setReplyDrafts((prev) => ({ ...prev, [itemId]: '' }));
      setExpandedComments((prev) => ({ ...prev, [itemId]: true }));
    }
  };

  const handleTargetClick = (item: FeedActivityItem) => {
    if (item.placeId) {
      openModal({ type: 'place', id: item.placeId });
    } else if (item.circleId) {
      openModal({ type: 'circle', id: item.circleId });
    } else if (item.kind === 'quiz') {
      openModal({
        type: 'quiz',
        roundType: item.targetTitle.toLowerCase().includes('street') ? 'street' : 'city'
      });
    } else if (item.kind === 'story') {
      openModal({ type: 'story' });
    }
  };

  const getKindBadge = (item: FeedActivityItem) => {
    switch (item.kind) {
      case 'quiz':
        return <Pill variant="orange-pill">ROUND COMPLETED</Pill>;
      case 'reflection':
        return <Pill variant="green-pill">CIRCLE REFLECTION</Pill>;
      case 'discovery':
        return <Pill variant="green-pill">LOCAL DISCOVERY</Pill>;
      case 'story':
        return <Pill variant="purple-pill">POSTCARD TRAIL</Pill>;
      case 'circle':
        return <Pill variant="purple-pill">CIRCLE INTEREST</Pill>;
      default:
        return <Pill>SIDE CHECK-IN</Pill>;
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <section className="live-feed-section" aria-label="Live community activity">
      <div className="section-heading">
        <div>
          <div className="live-heading-row">
            <h2>Live on your side</h2>
            <span className="live-pulse-badge">
              <span className="live-dot" />
              {activeRightNow} ACTIVE IN {currentCity.name.toUpperCase()}
            </span>
          </div>
          <p>Real-time rounds, local discoveries and reflections from neighbours across {currentCity.name}.</p>
        </div>

        <button
          type="button"
          className="btn outline live-sim-btn"
          onClick={simulateLivePulse}
        >
          <Icon name="pulse" /> New live activity
        </button>
      </div>

      {/* City-wide Participation Metrics Strip */}
      <div className="live-metrics-strip">
        <div className="card live-metric-tile">
          <span className="eyebrow">ACTIVE EXPLORERS</span>
          <strong>{totalExplorers.toLocaleString()}</strong>
          <small>Repping {cityStandings.length} Sides in {currentCity.name}</small>
        </div>
        <div className="card live-metric-tile">
          <span className="eyebrow">COLLECTIVE SIDE XP</span>
          <strong>{totalCityXp.toLocaleString()} <span className="orange">XP</span></strong>
          <small>{userScore > 0 ? `Includes your ${userScore} XP` : 'Play a round to add yours'}</small>
        </div>
        <div className="card live-metric-tile">
          <span className="eyebrow">DISCOVERIES LOGGED</span>
          <strong>{totalDiscoveries.toLocaleString()}</strong>
          <small>Places & City Pulse stories</small>
        </div>
        <div className="card live-metric-tile">
          <span className="eyebrow">COMMUNITY VIBES</span>
          <strong>
            {cityFeed.reduce((acc, i) => acc + i.cheers + i.reps, 0).toLocaleString()}
          </strong>
          <small>Cheers, reps & neighbour notes</small>
        </div>
      </div>

      {/* Quick Side Check-in Composer */}
      <form className="card feed-composer" onSubmit={handleCheckinSubmit}>
        <div className="feed-composer-top">
          <span className="avatar composer-avatar">
            {state.nickname.charAt(0).toUpperCase()}
          </span>
          <input
            type="text"
            value={checkinText}
            onChange={(e) => setCheckinText(e.target.value)}
            maxLength={240}
            placeholder={
              state.area
                ? `What’s good in ${state.area}, ${state.nickname}? Share a local note or shoutout...`
                : `Share a quick observation or shoutout from ${currentCity.name}...`
            }
            aria-label="Share a Side update"
          />
          <button
            type="submit"
            className="btn dark"
            disabled={checkinText.trim().length < 3}
          >
            Post update <Icon name="arrow" />
          </button>
        </div>
        <div className="feed-composer-foot">
          <span className="small muted">
            <Icon name="pin" /> Repping{' '}
            <b>{state.area ? `${state.area}, ${currentCity.name}` : `${currentCity.name} (Pick a Side to tag your area)`}</b>
          </span>
          <span className="small muted">Keep the banter kind · No private details</span>
        </div>
      </form>

      {/* Feed Filter Chips */}
      <div className="feed-filter-row">
        <div className="chips" role="group" aria-label="Filter live feed">
          {(
            [
              ['all', 'All live activity'],
              ['myside', state.area ? `My Side (${state.area})` : 'My Side'],
              ['quiz', 'Rounds & XP'],
              ['reflection', 'Reflections & notes'],
              ['discovery', 'Discoveries']
            ] as [FeedFilter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`chip ${activeFilter === key ? 'selected' : ''}`.trim()}
              aria-pressed={activeFilter === key}
              onClick={() => setActiveFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="small muted">
          Showing {filteredFeed.length} {filteredFeed.length === 1 ? 'update' : 'updates'}
        </span>
      </div>

      {/* Feed Items */}
      <div className="live-feed-list">
        {filteredFeed.slice(0, 6).map((item) => {
          const isCommentsOpen = !!expandedComments[item.id];
          const replyDraft = replyDrafts[item.id] || '';

          return (
            <article key={item.id} className="card feed-card">
              <div className="feed-card-head">
                <div className="feed-author-info">
                  <span
                    className="feed-avatar"
                    style={{ backgroundColor: item.avatarBg, color: item.avatarColor }}
                  >
                    {getInitials(item.author)}
                  </span>
                  <div>
                    <div className="feed-author-line">
                      <b>{item.author}</b>
                      {item.isCurrentUser ? (
                        <span className="you-badge">YOU</span>
                      ) : null}
                      <span className="feed-side-tag">
                        <Icon name="pin" /> {item.area} · {currentCity.name}
                      </span>
                    </div>
                    <p className="feed-action-line">
                      {item.actionText}{' '}
                      <button
                        type="button"
                        className="feed-target-btn"
                        onClick={() => handleTargetClick(item)}
                      >
                        {item.targetTitle}
                      </button>
                    </p>
                  </div>
                </div>

                <div className="feed-meta-right">
                  {item.xpGained ? (
                    <span className="feed-xp-badge">
                      <Icon name="spark" /> +{item.xpGained} XP
                    </span>
                  ) : (
                    getKindBadge(item)
                  )}
                  <span className="feed-time">{item.timeLabel}</span>
                </div>
              </div>

              <p className="feed-detail-text">{item.detailText}</p>

              <div className="feed-actions-bar">
                <div className="feed-reaction-group">
                  <button
                    type="button"
                    className={`feed-react-btn ${item.cheeredByMe ? 'active' : ''}`.trim()}
                    onClick={() => toggleFeedReaction(item.id, 'cheer')}
                    aria-pressed={!!item.cheeredByMe}
                  >
                    <span className="react-glyph">✳</span> Show love{' '}
                    <b>{item.cheers}</b>
                  </button>

                  <button
                    type="button"
                    className={`feed-react-btn ${item.reppedByMe ? 'active' : ''}`.trim()}
                    onClick={() => toggleFeedReaction(item.id, 'rep')}
                    aria-pressed={!!item.reppedByMe}
                  >
                    <span className="react-glyph">↗</span> Rep Side{' '}
                    <b>{item.reps}</b>
                  </button>

                  <button
                    type="button"
                    className={`feed-react-btn ${isCommentsOpen ? 'active' : ''}`.trim()}
                    onClick={() =>
                      setExpandedComments((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id]
                      }))
                    }
                  >
                    <span>💬</span>{' '}
                    {item.comments.length > 0
                      ? `${item.comments.length} ${
                          item.comments.length === 1 ? 'Reply' : 'Replies'
                        }`
                      : 'Reply'}
                  </button>
                </div>

                {item.placeId || item.circleId || item.kind === 'quiz' ? (
                  <button
                    type="button"
                    className="text-btn feed-jump-btn"
                    onClick={() => handleTargetClick(item)}
                  >
                    {item.kind === 'quiz'
                      ? 'Play this round'
                      : item.circleId
                      ? 'Open Circle'
                      : 'View discovery'}{' '}
                    <Icon name="arrow" />
                  </button>
                ) : null}
              </div>

              {isCommentsOpen ? (
                <div className="feed-comments-box">
                  {item.comments.length > 0 ? (
                    <div className="feed-comments-list">
                      {item.comments.map((c) => (
                        <div key={c.id} className="feed-comment-item">
                          <span
                            className="comment-avatar"
                            style={{ backgroundColor: c.avatarBg }}
                          >
                            {c.author.charAt(0).toUpperCase()}
                          </span>
                          <div className="comment-body">
                            <div className="comment-head">
                              <b>{c.author}</b>
                              <span>{c.area}</span>
                              <small>{c.timeLabel}</small>
                            </div>
                            <p>{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <form
                    className="feed-reply-form"
                    onSubmit={(e) => handleReplySubmit(e, item.id)}
                  >
                    <input
                      type="text"
                      value={replyDraft}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({
                          ...prev,
                          [item.id]: e.target.value
                        }))
                      }
                      maxLength={200}
                      placeholder={`Reply to ${item.author} as ${state.nickname}...`}
                      aria-label={`Reply to ${item.author}`}
                    />
                    <button
                      type="submit"
                      className="btn dark"
                      disabled={!replyDraft.trim()}
                    >
                      Send
                    </button>
                  </form>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

