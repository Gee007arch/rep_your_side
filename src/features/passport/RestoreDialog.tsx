import React, { useState } from 'react';
import { Icon } from '../../ui/icons';
import { usePassport } from '../../context/PassportContext';

export function RestoreDialog() {
  const { openModal, backupCodec } = usePassport();
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleCheckCode = (e: React.FormEvent) => {
    e.preventDefault();
    const res = backupCodec.decode(code);
    if (res.ok) {
      openModal({ type: 'confirm-restore', pending: res.candidate });
    } else {
      setError(res.error);
    }
  };

  return (
    <>
      <p>
        Paste a recovery code from this pilot. We’ll check it before replacing
        anything.
      </p>

      <form id="restore-form" noValidate onSubmit={handleCheckCode}>
        <label htmlFor="restore-code">Recovery code</label>
        <textarea
          id="restore-code"
          name="code"
          rows={6}
          maxLength={100000}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError('');
          }}
          placeholder="Paste your saved recovery code"
        />

        {error ? (
          <p id="restore-error" className="field-error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="btn dark full" type="submit">
          Check recovery code <Icon name="arrow" />
        </button>
      </form>
    </>
  );
}
