import { CITIES } from '../data/fixtures';
import { roundKey } from '../domain/model';
import { Pill } from './Pill';
import { Icon } from './icons';
import { usePassport } from '../context/PassportContext';

export function MissionCard() {
  const { state, openModal } = usePassport();
  const currentCity = CITIES[state.city];
  const qKey = roundKey(state.city, 'city', 'starter-v1');
  const attempt = state.attempts[qKey];
  const done = attempt?.done;
  const active = attempt?.answers?.length;

  const buttonText = done
    ? 'Practice again'
    : active
    ? 'Continue round'
    : 'Let’s play';

  return (
    <article className="card mission-card">
      <div className="card-row">
        <Pill variant="orange-pill">YOUR STARTER MISSION</Pill>
        <span className="muted small">
          <Icon name="clock" /> 3 min
        </span>
      </div>

      <div className="mission-body">
        <div>
          <h2>
            How well do you
            <br />
            know {currentCity.name}?
          </h2>
          <p>
            5 questions. A few surprises.
            <br />
            A fresh way to see your city.
          </p>
        </div>
        <div className="quiz-doodle">
          <span>?</span>
          <i>✳</i>
          <b>✦</b>
        </div>
      </div>

      <div className="card-row mission-bottom">
        <span className="reward">
          <Icon name="spark" /> Up to 70 XP <small>first completion</small>
        </span>
        <button
          type="button"
          className="btn dark"
          onClick={() => openModal({ type: 'quiz', roundType: 'city' })}
        >
          {buttonText} <Icon name="arrow" />
        </button>
      </div>
    </article>
  );
}

