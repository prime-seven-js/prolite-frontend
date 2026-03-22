import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router';

/**
 * UnAuthRoute — route guard cho các trang chỉ truy cập khi CHƯA đăng nhập (signin, signup).
 * Nếu đã login (có token) → redirect về trang chủ.
 */
const UnAuthRoute = () => {
  const { token, hydrated } = useAuthStore();

  if (!hydrated) {
    return null;
  }

  if (token) {
    return (
      <Navigate to="/" replace />
    )
  }

  return (
    <Outlet />
  )
}

export default UnAuthRoute
