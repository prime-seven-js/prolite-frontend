import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import UnAuthRoute from "./components/UnAuthRoute";
import AuthRoute from "./components/AuthRoute";
import InvalidRoute from "./components/InvalidRoute";

const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const NewFeedsPage = lazy(() => import("./pages/NewFeedsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));

function RouteFallback() {
  return <div className="min-h-screen bg-gradient-blue" />;
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
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
          <Route path="*" element={<InvalidRoute />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
