import { usePassport } from '../context/PassportContext';

export function ToastHost() {
  const { toast } = usePassport();

  return (
    <div
      id="toast"
      role="status"
      aria-live="polite"
      className={toast ? 'visible' : ''}
    >
      {toast || ''}
    </div>
  );
}

