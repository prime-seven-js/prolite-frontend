import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router';

const AuthRoute = () => {
  const { token, user, loading } = useAuthStore();

  if (!token) {
    return (
      <Navigate to="/signin" replace />
    )
  }

  return (
    <Outlet />
  )
}

export default AuthRoute