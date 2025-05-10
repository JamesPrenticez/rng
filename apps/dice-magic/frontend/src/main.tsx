import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { AppLayout } from './app/layouts/app-layout';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <StrictMode>
    <AppLayout />
  // </StrictMode>
);
