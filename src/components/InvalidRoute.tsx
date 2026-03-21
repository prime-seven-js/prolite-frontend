import { Navigate } from 'react-router';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Invalid Route - Tự động điều hướng đến SignInPage nếu chưa đăng nhập
 *                 hoặc NewFeedsPage nếu đã đăng nhập
 */

const InvalidRoute = () => {
    const { token, hydrated } = useAuthStore();

    if (!hydrated) {
        return null;
    }

    return <Navigate to={token ? "/" : "/signin"} replace />;
}

export default InvalidRoute