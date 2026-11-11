import React, { useState } from 'react';
import type { CorrectionDraft } from '../../domain/types';
import { PLACES, PULSE } from '../../data/fixtures';
import { Icon } from '../../ui/icons';
import { usePassport } from '../../context/PassportContext';

export interface CorrectionDialogProps {
  id?: string;
  kind?: 'place' | 'pulse';
  index?: number;
}

export function CorrectionDialog({ id, kind, index }: CorrectionDialogProps) {
  const { state, persist, closeModal } = usePassport();
  const old = index !== undefined ? state.drafts[index] : null;

  const resolvedId = id || old?.id || '';
  const resolvedKind = kind || old?.kind || 'place';

  const item =
    resolvedKind === 'place'
      ? PLACES.find((p) => p.id === resolvedId)
      : PULSE.find((p) => p.id === resolvedId);

  const title =
    old?.title ||
    (item && 'name' in item ? item.name : (item as any)?.title) ||
    'Pilot item';

  const [text, setText] = useState<string>(old?.text || '');
  const [error, setError] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (trimmed.length < 20 || trimmed.length > 1000) {
      setError('Please add 20–1,000 characters so the correction is understandable.');
      return;
    }

    // D-02 guard: Enforce 100 drafts limit on new drafts
    if (index === undefined && state.drafts.length >= 100) {
      setError('Maximum 100 drafts reached on this device.');
      return;
    }

    const draft: CorrectionDraft = {
      id: resolvedId,
      kind: resolvedKind,
      title,
      text: trimmed,
      date: Date.now()
    };

    if (index !== undefined) {
      state.drafts[index] = draft;
    } else {
      state.drafts.push(draft);
    }

    persist();
    setSavedSuccess(true);
  };

  if (savedSuccess) {
    return (
      <>
        <div className="success-icon">
          <Icon name="check" />
        </div>
        <p>
          Find it under <b>My Passport → My correction drafts</b>. You can edit it
          there.
        </p>
        <div className="insight">
          <b>Saved on this device only</b>
          <p>
            No editor or public authority has received this draft. This pilot does not
            have a submission inbox.
          </p>
        </div>
        <button
          type="button"
          className="btn dark full"
          onClick={() => {
            closeModal();
            window.location.hash = 'passport';
          }}
        >
          View my Passport
        </button>
      </>
    );
  }

  return (
    <>
      <p className="modal-lead">
        Draft a correction for <b>{title}</b>.
      </p>

      <div className="banner">
        <Icon name="book" />
        <span>
          This pilot saves a draft on your device. It does not send it to an editor
          or authority.
        </span>
      </div>

      <form id="correction-form" noValidate onSubmit={handleSubmit}>
        <label htmlFor="correction-text">What needs correcting, and why?</label>
        <textarea
          id="correction-text"
          name="text"
          rows={5}
          maxLength={1000}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          placeholder="Describe the detail and add a public source if you have one."
        />
        <span className="field-note">
          20–1,000 characters. Please leave out private information and unsupported
          allegations.
        </span>

        {error ? (
          <p id="correction-error" role="alert" className="field-error">
            {error}
          </p>
        ) : null}

        <button className="btn primary full" type="submit">
          Save correction draft <Icon name="check" />
        </button>
      </form>
    </>
  );
}
