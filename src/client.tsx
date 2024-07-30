import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './ts/main';

// hydrateRoot(document.getElementById('ssr-outlet')!, <App />);
const root = createRoot(document.getElementById('ssr-outlet')!)
root.render(<App />)