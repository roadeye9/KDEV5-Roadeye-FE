import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 응답 인터셉터 추가
api.interceptors.response.use(
  // 성공적인 응답은 그대로 반환
  (response: AxiosResponse) => response,

  // 에러 처리
  (error: AxiosError) => {
    // 403 Forbidden 에러인 경우
    if (error.response?.status === 403) {
      // 사용자에게 알림 표시 (sonner 스타일로 변경)
      toast.error('인증 실패', {
        description: '세션이 만료되었거나 접근 권한이 없습니다. 다시 로그인해주세요.',
      });

      // 짧은 지연 후 로그인 페이지로 리디렉션
      setTimeout(() => {
        // 현재 인증 정보를 지우고 로그인 페이지로 이동
        // (실제 앱에서는 AuthContext나 상태관리 라이브러리의 로그아웃 함수 호출 필요)
        window.location.href = '/login';
      }, 1500);
    }
    
    // 다른 에러들은 그대로 반환하여 개별 핸들링
    return Promise.reject(error);
  }
);

export default api; 