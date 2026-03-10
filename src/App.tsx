import { BrowserRouter, Route, Routes } from "react-router";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import NewFeedsPage from "./pages/NewFeedsPage";
import UnAuthRoute from "./components/UnAuthRoute";
import AuthRoute from "./components/AuthRoute";

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
          </Route>
          {/* Public */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
