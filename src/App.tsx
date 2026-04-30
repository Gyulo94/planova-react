import { Route, Routes } from "react-router-dom";
import { LoginPage, MainPage, NotFoundPage, RegisterPage } from "./pages";
import RegisterVerifyMailPage from "./pages/auth/register-verify-mail-page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/:token" element={<RegisterVerifyMailPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
