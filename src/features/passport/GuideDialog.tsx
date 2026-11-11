import { Icon } from '../../ui/icons';
import { usePassport } from '../../context/PassportContext';

export function GuideDialog() {
  const { closeModal } = usePassport();

  const steps = [
    [
      '01',
      'Pick your city & Side',
      'Choose Lagos or Abuja, then an area you care about. No exact location needed.'
    ],
    [
      '02',
      'Play, learn, discover',
      'Try a five-question round. Check answers, learn from explanations and follow the sources.'
    ],
    [
      '03',
      'Collect your little wins',
      'Earn personal XP, save discoveries and add stamps to your Side Passport. Replays don’t duplicate XP.'
    ],
    [
      '04',
      'Make it your own',
      'Follow a five-chapter fictional trail, try self-paced activities and save Circle interests.'
    ]
  ] as const;

  return (
    <>
      <p className="modal-lead">
        A small adventure in knowing your city a little better.
      </p>

      <div className="guide-steps">
        {steps.map(([n, t, d]) => (
          <div key={n}>
            <span>{n}</span>
            <section>
              <h3>{t}</h3>
              <p>{d}</p>
            </section>
          </div>
        ))}
      </div>

      <div className="insight">
        <b>What’s usable in this private pilot?</b>
        <p>
          Both city editions, guest play, answer feedback, saved places, a local
          Passport, editable reflections, story progress and correction drafts.
        </p>
        <p>
          <b>What comes later?</b> Accounts and cross-device sync, live news,
          moderated submissions, group membership, RSVPs, jobs, payments and ranked
          leagues.
        </p>
      </div>

      <button
        type="button"
        className="btn dark full"
        onClick={closeModal}
      >
        Let’s explore <Icon name="arrow" />
      </button>

      <p className="modal-footnote">
        This community pilot is intended for adults aged 18+. Basic play is free. XP
        has no cash value. Missed days do not remove progress.
      </p>
    </>
  );
}

