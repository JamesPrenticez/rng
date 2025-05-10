import { Route, Routes } from 'react-router-dom';
import { Path } from './models';
import { AppLayout } from './layout/app-layout';
import { HomePage, NotFoundPage } from './pages';

export const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path={Path.HOME} element={<HomePage/>} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
}
