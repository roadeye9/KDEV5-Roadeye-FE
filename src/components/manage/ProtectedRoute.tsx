import { useSessionInfoQuery } from '@/hooks/api/auth';
import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: sessionInfo, isFetched, refetch } = useSessionInfoQuery();

    const timerRef = useRef<ReturnType<typeof setInterval>>();
    const [isAuthenticated, setIsAuthenticated] = useState(sessionInfo?.isExpired() ? false : true);

    useEffect(() => {
        if (timerRef.current) {
            return;
        }
        if (!sessionInfo) {
            return;
        }

        const interval = 1000 * 60 * 5; // 5minute
        setIsAuthenticated(true);
        timerRef.current = setInterval(() => {
            refetch()
                .catch(() => {
                    setIsAuthenticated(false);
                    clearInterval(timerRef.current);
                })
        }, interval);

    }, [sessionInfo])

    useEffect(() => {
        if (!sessionInfo || sessionInfo.isExpired()) {
            setIsAuthenticated(false);
        }
        else {
            setIsAuthenticated(true);
        }
    }, [sessionInfo])

    if (!isFetched) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' />;
    }

    return children;
}