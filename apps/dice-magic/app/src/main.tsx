import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { DiceMagicAppLayout } from './layouts/app-layout';

import '@shared/assets/styles/styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <DiceMagicAppLayout />
  </StrictMode>
);
