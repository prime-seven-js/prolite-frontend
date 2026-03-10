import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router';

const UnAuthRoute = () => {
  const { token } = useAuthStore();

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