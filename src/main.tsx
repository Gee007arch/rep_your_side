import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import { PassportProvider } from './context/PassportContext';
import { AppShell } from './app/AppShell';

export function App() {
  return (
    <PassportProvider>
      <AppShell />
    </PassportProvider>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
