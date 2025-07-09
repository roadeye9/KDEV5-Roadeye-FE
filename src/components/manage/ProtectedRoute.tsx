import { useSessionInfoQuery } from '@/hooks/api/auth';
import { isExpired } from '@/utils/dateUtils';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: sessionInfo, isFetched, isLoading } = useSessionInfoQuery(true);

    if (isLoading || !isFetched) {
        return null;
    }

    const isAuthenticated = !isExpired(sessionInfo?.expireAt);
    if (!isAuthenticated) {
        return <Navigate to='/login' />;
    }

    return children;
}