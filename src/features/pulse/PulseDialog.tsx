import { PULSE } from '../../data/fixtures';
import { EXTENDED_PULSE } from '../../data/extendedCatalog';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { SourceBlock } from '../../ui/SourceBlock';
import { usePassport } from '../../context/PassportContext';

export interface PulseDialogProps {
  id: string;
}

export function PulseDialog({ id }: PulseDialogProps) {
  const { state, collectContent, openModal } = usePassport();
  const p =
    PULSE.find((item) => item.id === id) ||
    EXTENDED_PULSE.find((item) => item.id === id);

  if (!p) return null;

  const isCollected = state.read.includes(id);

  return (
    <>
      <Pill variant="green-pill">{p.tag}</Pill>{' '}
      <span className="small muted">
        {p.area} · Background, not breaking news
      </span>

      <p className="reading-text">{p.body}</p>

      <div className="insight">
        <span className="eyebrow">WHY IT MATTERS</span>
        <p>{p.insight}</p>
      </div>

      <h3>What to keep in mind</h3>
      <p>{p.limit}</p>

      <SourceBlock sourceId={p.source} />

      <div className="version-note">
        <b>Version 1 · 21 October 2026</b>
        <span>Initial pilot background entry. No corrections recorded.</span>
      </div>

      <button
        type="button"
        className="btn dark full"
        onClick={() => collectContent(id)}
        disabled={isCollected}
      >
        {isCollected ? 'Discovery collected ✓' : 'Now I know · collect 10 XP'}
      </button>

      <button
        type="button"
        className="text-btn"
        onClick={() => openModal({ type: 'correction', id, kind: 'pulse' })}
      >
        Something to improve? Draft a correction <Icon name="arrow" />
      </button>
    </>
  );
}

