import * as ReactDOM from 'react-dom/client';
import { DiceMagicAppLayout } from './layouts/app-layout';
import '@shared/assets/styles/styles.css';
import { BaseAppLayout } from '@shared/layouts';
import { GameProvider } from '@dice-magic/contexts';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BaseAppLayout>
      <GameProvider>
        <DiceMagicAppLayout />
      </GameProvider>
  </BaseAppLayout>
);
