import * as ReactDOM from 'react-dom/client';
import { JumpQuestAppLayout } from './layouts/app-layout';
import '@shared/assets/styles/styles.css';
import { BaseAppLayout } from '@shared/layouts';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BaseAppLayout type="static">
      <JumpQuestAppLayout />
  </BaseAppLayout>
);
