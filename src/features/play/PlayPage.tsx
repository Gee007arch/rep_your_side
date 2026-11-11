import { CIRCLES } from '../../data/fixtures';
import { Pill } from '../../ui/Pill';
import { Icon } from '../../ui/icons';
import { MissionCard } from '../../ui/MissionCard';
import { MajorPillarsSection } from '../home/MajorPillarsSection';
import { usePassport } from '../../context/PassportContext';

export function PlayPage() {
  const { state, openModal } = usePassport();

  const activityTitles = [
    'Find your side’s colour',
    'Notice something green',
    'Write your skill in one line'
  ];

  return (
    <>
      <div className="play-intro">
        <div>
          <span className="eyebrow">PLAY FOR THE PLOT</span>
          <h2>
            Your curiosity looks
            <br />
            good on you.
          </h2>
          <p>
            Try a short round, follow a fictional trail or turn a small observation into
            a discovery.
          </p>
        </div>
        <div className="play-graphic">
          ✳
          <span>
            PLAY
            <br />
            LEARN
            <br />
            REPEAT
          </span>
        </div>
      </div>

      <div className="three-cards">
        <MissionCard />

        <article className="card activity-card peach">
          <span className="big-card-icon">
            <Icon name="shield" />
          </span>
          <Pill variant="orange-pill">STREET SENSE</Pill>
          <h2>
            Good instincts.
            <br />
            Better choices.
          </h2>
          <p>Three fictional everyday situations. What would you do?</p>
          <div className="card-row">
            <span className="reward">Up to 50 XP</span>
            <button
              type="button"
              className="btn dark"
              onClick={() => openModal({ type: 'quiz', roundType: 'street' })}
            >
              Try it <Icon name="arrow" />
            </button>
          </div>
        </article>

        <article className="card activity-card lilac">
          <span className="big-card-icon">
            <Icon name="book" />
          </span>
          <Pill variant="purple-pill">FICTIONAL ADVENTURE</Pill>
          <h2>
            The Postcard
            <br />
            Trail
          </h2>
          <p>Five short chapters. Your choices shape Tomi’s little adventure.</p>
          <div className="card-row">
            <span className="reward">50 XP</span>
            <button
              type="button"
              className="btn dark"
              onClick={() => openModal({ type: 'story' })}
            >
              Follow the clues <Icon name="arrow" />
            </button>
          </div>
        </article>
      </div>

      <div className="section-heading">
        <div>
          <h2>Little things. Real participation.</h2>
          <p>Self-paced activities you can do wherever you are.</p>
        </div>
      </div>

      <div className="three-cards">
        {CIRCLES.slice(0, 3).map((c, i) => (
          <article key={c.id} className="card mini-activity">
            <span className={`circle-icon ${c.colour}`}>
              <Icon name={c.icon} />
            </span>
            <span className="eyebrow">ACTIVITY {String(i + 1).padStart(2, '0')}</span>
            <h3>{activityTitles[i]}</h3>
            <p>{c.task}</p>
            <button
              type="button"
              className="text-btn"
              onClick={() => openModal({ type: 'activity', id: c.id })}
            >
              {state.activity[c.id] ? 'View my reflection' : 'Give it a go'}{' '}
              <Icon name="arrow" /> <span className="reward">20 XP</span>
            </button>
          </article>
        ))}
      </div>

      <MajorPillarsSection />

      <div className="info-strip">
        <Icon name="trophy" />
        <p>
          <b>Enjoy the progress. Skip the pressure.</b> XP is personal, has no cash
          value and is awarded once per starter activity. Replays are practice.
          Competitive leagues are outside this private pilot.
        </p>
      </div>
    </>
  );
}

