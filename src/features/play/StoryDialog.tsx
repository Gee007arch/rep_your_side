import { CHAPTERS, CITIES } from '../../data/fixtures';
import { award } from '../../domain/model';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { usePassport } from '../../context/PassportContext';

export function StoryDialog() {
  const { state, persist, closeModal, showToast, publishFeedActivity } = usePassport();
  const city = state.city;
  const currentCity = CITIES[city];

  // Story state for current city
  if (!state.story[city]) {
    state.story[city] = { chapter: 0, choices: [], done: false };
  }
  const s = state.story[city]!;

  const handleChoice = (choiceIndex: number) => {
    s.choices[s.chapter] = choiceIndex;
    persist();
  };

  const handleNext = () => {
    if (s.choices[s.chapter] === undefined) return;

    if (s.chapter === 4) {
      s.done = true;
      award(state, 'story:' + city, 50);
      persist();
      publishFeedActivity({
        kind: 'story',
        actionText: 'completed all 5 chapters of',
        targetTitle: 'The Postcard Trail',
        detailText: 'Followed Tomi’s postcard clues across all five chapters and unlocked the Story Seeker stamp.',
        xpGained: 50
      });
      showToast('The whole story, collected. +50 XP!');
    } else {
      s.chapter++;
      persist();
    }
  };

  const handleBackHome = () => {
    closeModal();
    window.location.hash = 'home';
  };

  if (s.done) {
    return (
      <>
        <div className="story-finished">
          ✉<span>✳</span>
        </div>
        <p className="modal-lead">
          Tomi’s postcard found its place. You collected all five chapters of{' '}
          <b>The Postcard Trail</b>.
        </p>

        <div className="insight">
          {s.choices.map((v, i) => (
            <p key={i}>
              <b>
                {i + 1}. {CHAPTERS[i].title}
              </b>
              <br />
              {CHAPTERS[i].choices[v][0]}
            </p>
          ))}
        </div>

        <button
          type="button"
          className="btn dark full"
          onClick={handleBackHome}
        >
          Back to my Side
        </button>

        <p className="modal-footnote">
          Fictional adventure · 50 XP awarded once for this edition.
        </p>
      </>
    );
  }

  const ch = CHAPTERS[s.chapter];
  const choice = s.choices[s.chapter];

  return (
    <>
      <div className="card-row">
        <Pill variant="purple-pill">FICTIONAL ADVENTURE</Pill>
        <span className="small muted">
          Chapter {s.chapter + 1} of 5 · {currentCity.name} edition
        </span>
      </div>

      <div className="chapter-art">
        <span>✉</span>
        <i>Chapter 0{s.chapter + 1}</i>
        <b>✦</b>
      </div>

      <h3 className="question">{ch.title}</h3>
      <p className="reading-text">{ch.text}</p>

      {choice === undefined ? (
        <div className="story-choices">
          {ch.choices.map(([t], i) => (
            <button
              key={i}
              type="button"
              className="btn outline full"
              onClick={() => handleChoice(i)}
            >
              {t} <Icon name="arrow" />
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="answer-feedback positive">
            <b>{ch.choices[choice][0]}</b>
            <p>{ch.choices[choice][1]}</p>
          </div>

          <button
            type="button"
            className="btn dark full"
            onClick={handleNext}
          >
            {s.chapter === 4
              ? 'Finish the story · collect 50 XP'
              : 'Continue the trail'}{' '}
            <Icon name="arrow" />
          </button>
        </>
      )}

      <p className="modal-footnote">
        An original imagined story. Characters, clues and gatherings are fictional.
        Your place is saved as you go.
      </p>
    </>
  );
}

