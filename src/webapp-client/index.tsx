import React from 'react';
import ReactDOM from 'react-dom/client';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import App from './src/App';

Chart.register(...registerables);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
