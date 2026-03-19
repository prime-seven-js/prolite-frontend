import { BrowserRouter, Route, Routes } from "react-router";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import NewFeedsPage from "./pages/NewFeedsPage";
import UnAuthRoute from "./components/UnAuthRoute";
import AuthRoute from "./components/AuthRoute";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Unauth */}
          <Route element={<UnAuthRoute />}>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>
          {/* Auth */}
          <Route element={<AuthRoute />}>
            <Route path="/" element={<NewFeedsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Route>
          {/* Public */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
