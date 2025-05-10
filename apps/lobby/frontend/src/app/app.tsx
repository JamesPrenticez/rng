import { Routes, Route } from "react-router-dom";

import { Path } from "./models";

import { 
  HomePage,
  LoginPage,
  RegisterPage,
  NotFoundPage
 } from "./pages";
import { AppLayout } from "./layout";

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
