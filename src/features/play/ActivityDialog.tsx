import React, { useState } from 'react';
import type { CircleId } from '../../domain/types';
import { CIRCLES } from '../../data/fixtures';
import { award } from '../../domain/model';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { usePassport } from '../../context/PassportContext';

export interface ActivityDialogProps {
  circleId: string;
}

export function ActivityDialog({ circleId }: ActivityDialogProps) {
  const { state, persist, closeModal, showToast, publishFeedActivity } = usePassport();
  const c = CIRCLES.find((item) => item.id === circleId);
  const existing = state.activity[circleId as CircleId];

  const [text, setText] = useState<string>(existing?.text || '');
  const [error, setError] = useState<string>('');

  if (!c) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (trimmed.length < 10 || trimmed.length > 500) {
      setError('Add a little more detail: 10–500 characters.');
      return;
    }

    const existed = !!state.activity[circleId as CircleId];
    state.activity[circleId as CircleId] = {
      text: trimmed,
      date: Date.now()
    };
    award(state, 'activity:' + circleId, 20);
    persist();
    publishFeedActivity({
      kind: 'reflection',
      actionText: 'shared a reflection in',
      targetTitle: c.name,
      detailText: `“${trimmed}”`,
      xpGained: existed ? undefined : 20,
      circleId: circleId as CircleId
    });
    closeModal();
    showToast(
      existed
        ? 'Reflection updated. Your XP stays the same.'
        : 'A little participation, a little progress. +20 XP!'
    );
  };

  return (
    <>
      <Pill variant="green-pill">SELF-PACED ACTIVITY</Pill>
      <h3>{c.name}</h3>
      <p className="reading-text">{c.task}</p>

      <form id="activity-form" noValidate onSubmit={handleSubmit}>
        <label htmlFor="reflection">My little reflection</label>
        <textarea
          id="reflection"
          name="reflection"
          rows={4}
          maxLength={500}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          aria-invalid={!!error}
          placeholder="What did you notice? A sentence is enough."
        />
        <span className="field-note">
          10–500 characters. Avoid names, addresses and private details. Saved only in your browser.
        </span>

        {error ? (
          <p id="activity-error" className="field-error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="btn primary full" type="submit">
          {existing ? 'Save my changes' : 'Complete activity · collect 20 XP'}{' '}
          <Icon name="check" />
        </button>
      </form>
    </>
  );
}

