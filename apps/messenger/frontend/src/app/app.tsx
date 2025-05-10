import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout';
import { Path } from './models';
import { AppLayoutMobile } from './layout/app-layout-mobile';
import { AppLayoutDesktop } from './layout/app-layout-desktop';
import { AppLayoutAdmin } from './layout/app-layout-admin';
import { AuthForm } from './components/auth/auth-form';
import { ProtectedRoute } from './components/auth/protected-route';
import { MessengerHome } from './components/messenger-home/messenger-home';
import { Inbox } from './components/inbox/inbox';
import { Contacts } from './components/contacts/contacts';
import { FindContacts } from './components/contacts/find-contacts';
import { MessengerSettings } from './components/messenger-settings.tsx/messenger-settings';
import { useAspectRatioHandler } from '@shared/ui/layouts';
import { UpdateUserDetails } from './components/auth/update-user-details';

export const App = () => {
  const { isVertical } = useAspectRatioHandler();

  return (
    <AppLayout isMobile={isVertical}>
      <Routes>
        {/* <Route path={Path.HOME} element={<Home />} /> */}
        <Route
          path={Path.UPDATE_USER_DETAILS}
          element={
            // <ProtectedRoute>
            <UpdateUserDetails isMobile={isVertical} />
            // </ProtectedRoute>
          }
        />
        <Route path={Path.LOGIN} element={<AuthForm isMobile={isVertical} />} />
        <Route
          path={Path.REGISTER}
          element={<AuthForm isMobile={isVertical} />}
        />

        <Route
          path={Path.HOME}
          element={
            <ProtectedRoute>
              {isVertical ? <AppLayoutMobile /> : <AppLayoutDesktop />}
            </ProtectedRoute>
          }
        >
          <Route path={Path.MESSENGER} element={<MessengerHome />} />
          <Route path={Path.MESENGER_INBOX} element={<Inbox />} />
          <Route path={Path.MESENGER_CONTACTS} element={<Contacts />} />
          <Route
            path={Path.MESENGER_FIND_CONTACTS}
            element={<FindContacts />}
          />
          <Route
            path={Path.MESSENGER_SETTINGS}
            element={<MessengerSettings />}
          />
        </Route>

        <Route path={Path.ADMIN} element={<AppLayoutAdmin />} />
        <Route path="/*" element={<h1>Page Not Found!</h1>} />
      </Routes>
    </AppLayout>
  );
};
