// External

import * as ReactDOM from 'react-dom/client';

// Assets
import { App } from './app/app';
import './styles/fonts.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <App />
);
