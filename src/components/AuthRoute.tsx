import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router";

/**
 * Auth Route - Tự động điều hướng đến NewFeedsPage nếu đã đăng nhập
 */

const AuthRoute = () => {
  const { token, hydrated } = useAuthStore();

  if (!hydrated) {
    return null;
  }

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
