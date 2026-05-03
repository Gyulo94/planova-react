import { Route, Routes } from "react-router-dom";
import {
  EmailFormPage,
  LoginPage,
  MainPage,
  NotFoundPage,
  RegisterPage,
  ResetPasswordPage,
  WorkspaceDashboardPage,
  WorkspacePage,
} from "./pages";
import RegisterVerifyMailPage from "./pages/auth/register-verify-mail-page";
import RootLayout from "./components/shared/layout/root-layout";
import AuthRoute from "./components/routes/auth.route";
import PrivateRoute from "./components/routes/private.route";

function App() {
  return (
    <Routes>
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/:token" element={<RegisterVerifyMailPage />} />
        <Route path="/reset-password" element={<EmailFormPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/workspaces/new" element={<WorkspacePage />} />
        <Route element={<RootLayout />}>
          <Route
            path="/workspaces/:workspaceId"
            element={<WorkspaceDashboardPage />}
          />
        </Route>

        <Route path="/" element={<MainPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
