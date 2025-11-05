
// Apply persisted theme before React renders
try {
  const storage = localStorage.getItem('ctfd-scoreboard-storage');
  if (storage) {
    const parsed = JSON.parse(storage);
    if (parsed.state && parsed.state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
} catch (e) {
  // Ignore errors
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
