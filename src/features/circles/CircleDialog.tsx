import type { CircleId } from '../../domain/types';
import { CIRCLES, CITIES } from '../../data/fixtures';
import { CIRCLE_SOCIAL_STATS } from '../../data/community';
import { Icon } from '../../ui/icons';
import { usePassport } from '../../context/PassportContext';

export interface CircleDialogProps {
  id: string;
}

export function CircleDialog({ id }: CircleDialogProps) {
  const { state, toggleCircleInterest, openModal, communityFeed, toggleFeedReaction } = usePassport();
  const c = CIRCLES.find((item) => item.id === id);
  const currentCity = CITIES[state.city];

  if (!c) return null;

  const isInterested = state.interests.includes(id as CircleId);
  const social = CIRCLE_SOCIAL_STATS[id as CircleId];
  const circleReflections = communityFeed.filter((item) => item.circleId === id);

  return (
    <>
      <span className={`circle-icon ${c.colour}`}>
        <Icon name={c.icon} />
      </span>
      <p className="modal-lead">{c.desc}</p>

      <h3>What this Circle could be</h3>
      <p>
        A space for people in the {currentCity.name} edition to share this
        interest, learn and take part in reviewed activities.
      </p>

      <h3>A first little activity</h3>
      <p>{c.task}</p>

      {social ? (
        <div className="circle-dialog-members">
          <div className="circle-avatar-stack">
            {social.recentMembers.map((m, idx) => (
              <span
                key={idx}
                className="stack-avatar"
                style={{ backgroundColor: m.bg, color: m.color }}
              >
                {m.initials}
              </span>
            ))}
          </div>
          <span className="small muted">
            <b>
              {(state.city === 'lagos' ? social.lagosMembers : social.abujaMembers) +
                (isInterested ? 1 : 0)}{' '}
              neighbours
            </b>{' '}
            in {currentCity.name} interested · {social.weeklyReflections} shared notes
          </span>
        </div>
      ) : null}

      {circleReflections.length > 0 ? (
        <div className="circle-wall">
          <h3>Recent neighbour reflections</h3>
          {circleReflections.slice(0, 3).map((item) => (
            <div key={item.id} className="circle-wall-item">
              <div className="card-row">
                <span className="small">
                  <b>{item.author}</b> · {item.area}
                </span>
                <span className="small muted">{item.timeLabel}</span>
              </div>
              <p>{item.detailText}</p>
              <button
                type="button"
                className={`feed-react-btn ${item.cheeredByMe ? 'active' : ''}`.trim()}
                onClick={() => toggleFeedReaction(item.id, 'cheer')}
              >
                <span className="react-glyph">✳</span> Show love <b>{item.cheers}</b>
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="insight">
        <b>Circle preview</b>
        <p>
          Saving an interest does not create membership, send a request or book a
          place. Organisers, schedules and safe participation arrangements must be
          in place before live activities open.
        </p>
      </div>

      <button
        type="button"
        className="btn dark full"
        onClick={() => toggleCircleInterest(id as CircleId)}
      >
        {isInterested ? 'Remove saved interest' : 'Save my interest'}
      </button>

      <button
        type="button"
        className="btn outline full"
        onClick={() => openModal({ type: 'activity', id })}
      >
        Try the self-paced activity
      </button>

      <button
        type="button"
        className="text-btn"
        onClick={() => openModal({ type: 'community' })}
      >
        Read our community promise <Icon name="arrow" />
      </button>
    </>
  );
}

