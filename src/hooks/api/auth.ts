import { useMutation, useQuery } from '@tanstack/react-query';

import { getMy, getSessionInfo, signIn, signOut } from '@/api/auth';

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: signIn,
  });
};

export const useSignOutMutation = () => {
  return useMutation({
    mutationFn: signOut,
  });
};

export const useMyInfoQuery = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['auth:myInfo'],
    queryFn: getMy,
    enabled,
    meta: {
      persist: true,
    },
  });
};
export const useSessionInfoQuery = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['auth:session'],
    queryFn: getSessionInfo,
    refetchInterval: 5 * 60 * 1000, // 5분
    refetchIntervalInBackground: true,
    enabled,
    meta: {
      persist: true,
    },
  });
};
