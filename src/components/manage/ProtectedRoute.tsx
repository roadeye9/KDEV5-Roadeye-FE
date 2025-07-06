import { useSessionInfoQuery } from '@/hooks/api/auth';
import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: sessionInfo, isFetched, isLoading, refetch } = useSessionInfoQuery();

    const timerRef = useRef<ReturnType<typeof setInterval>>();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    // 세션 정보가 로드되면 인증 상태 업데이트
    useEffect(() => {
        if (isFetched && sessionInfo) {
            if (sessionInfo.isExpired()) {
                setIsAuthenticated(false);
            } else {
                setIsAuthenticated(true);
            }
        } else if (isFetched && !sessionInfo) {
            // 세션 정보가 없으면 인증되지 않은 상태
            setIsAuthenticated(false);
        }
    }, [sessionInfo, isFetched]);

    // 주기적 세션 갱신 설정
    useEffect(() => {
        if (timerRef.current) {
            return;
        }
        if (!sessionInfo || sessionInfo.isExpired()) {
            return;
        }

        const interval = 1000 * 60 * 5; // 5분
        timerRef.current = setInterval(() => {
            refetch()
                .catch(() => {
                    setIsAuthenticated(false);
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                });
        }, interval);

        // 컴포넌트 언마운트 시 타이머 정리
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [sessionInfo, refetch]);

    // API 호출이 아직 진행 중이면 로딩 상태 유지
    if (isLoading || !isFetched) {
        return null;
    }

    // 인증되지 않은 경우 로그인 페이지로 이동
    if (isAuthenticated === false) {
        return <Navigate to='/login' />;
    }

    // 인증된 경우 자식 컴포넌트 렌더링
    return children;
}