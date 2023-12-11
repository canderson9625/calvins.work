import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './ts/main';

hydrateRoot(document.getElementById('ssr-outlet')!, <App />);