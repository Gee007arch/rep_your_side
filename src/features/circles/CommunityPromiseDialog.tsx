import { usePassport } from '../../context/PassportContext';

export function CommunityPromiseDialog() {
  const { closeModal } = usePassport();

  const steps = [
    [
      '01',
      'Keep it kind',
      'No threats, harassment, ethnic or religious hostility, impersonation or degrading labels.'
    ],
    [
      '02',
      'Keep it private',
      'Ask before sharing photographs or stories. Do not share home addresses, private documents or payment codes.'
    ],
    [
      '03',
      'Keep it clear',
      'Distinguish a verified fact, a personal opinion, a community report, fiction and an advertisement.'
    ],
    [
      '04',
      'Take part with care',
      'Check organisers, costs and requirements before any future live activity. This pilot offers no emergency or reporting service.'
    ]
  ] as const;

  return (
    <>
      <p className="modal-lead">
        We can celebrate our differences and still make room for each other.
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

      <button
        type="button"
        className="btn dark full"
        onClick={closeModal}
      >
        Sounds like my kind of place
      </button>
    </>
  );
}

