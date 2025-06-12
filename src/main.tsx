import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryProvider } from './providers/query-provider';

import App from './app';
import Toaster from './components/partials/toaster';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
      <Toaster />
    </QueryProvider>
  </StrictMode>,
);
