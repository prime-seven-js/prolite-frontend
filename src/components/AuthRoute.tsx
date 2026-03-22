import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router";

/**
 * AuthRoute — route guard cho các trang yêu cầu đăng nhập.
 * Chờ Zustand hydrate xong → kiểm tra token → redirect /signin nếu chưa login.
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
