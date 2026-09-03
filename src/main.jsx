import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ResumeProvider } from './context/ResumeContext.jsx';
import '../styles.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <ResumeProvider>
        <App />
      </ResumeProvider>
    </React.StrictMode>
  );
}
