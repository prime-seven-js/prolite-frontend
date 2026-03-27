import { BrowserRouter, Route, Routes } from "react-router";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import NewFeedsPage from "./pages/NewFeedsPage";
import UnAuthRoute from "./components/UnAuthRoute";
import AuthRoute from "./components/AuthRoute";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
// import MessagesPage from "./pages/MessagesPage";
import SearchPage from "./pages/SearchPage";
import { Toaster } from "sonner";
import { ScrollToTop } from "./components/ScrollToTop";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import EmailConfirmedPage from "./pages/EmailConfirmedPage";
import DonatePage from "./pages/DonatePage";

/**
 * App — root component với React Router.
 *
 * Route structure:
 * - UnAuthRoute: /signin, /signup (chỉ truy cập khi chưa đăng nhập)
 * - AuthRoute: /, /search, /notifications, /messages, /profile/:userId
 *   (redirect về /signin nếu chưa đăng nhập)
 */

function App() {
  return (
    <>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            color: "#fff",
            fontWeight: 500,
          },
          classNames: {
            success:
              "!bg-gradient-to-r !from-[#0d9464] !to-[#2bbf8a] !text-white !border-[#2bbf8a]/20",
            error:
              "!bg-gradient-to-r !from-[#c0392b] !to-[#e74c6f] !text-white !border-[#e74c6f]/20",
            warning:
              "!bg-gradient-to-r !from-[#d4880e] !to-[#f0c040] !text-white !border-[#f0c040]/20",
            info: "!bg-gradient-to-r !from-[#2496d4] !to-[#63d4f7] !text-white !border-[#63d4f7]/20",
          },
        }}
      />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Unauth */}
          <Route element={<UnAuthRoute />}>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/email-confirmed" element={<EmailConfirmedPage />} />
          </Route>
          {/* Auth */}
          <Route element={<AuthRoute />}>
            <Route path="/" element={<NewFeedsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/messages" element={<DonatePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Route>
          {/* Public */}
          <Route path="/donate" element={<DonatePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
