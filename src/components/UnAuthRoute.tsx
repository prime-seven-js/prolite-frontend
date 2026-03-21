import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router";

/**
  * UnAuth Route - Tự động điều hướng đến SignInPage nếu chưa đăng nhập
 */

const UnAuthRoute = () => {
  const { token, hydrated } = useAuthStore();

  if (!hydrated) {
    return null;
  }

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default UnAuthRoute;
