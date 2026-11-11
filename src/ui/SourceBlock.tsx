import { SOURCES } from '../data/fixtures';
import { Icon } from './icons';

export interface SourceBlockProps {
  sourceId: string;
}

export function SourceBlock({ sourceId }: SourceBlockProps) {
  const s = SOURCES[sourceId];
  if (!s) return null;

  return (
    <div className="source">
      <Icon name="shield" />
      <div>
        <strong>
          Source:{' '}
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.name} ↗
          </a>
        </strong>
        <small>
          {s.date} · Checked 21 October 2026
          <br />
          Background information · verify current conditions before acting
        </small>
      </div>
    </div>
  );
}

