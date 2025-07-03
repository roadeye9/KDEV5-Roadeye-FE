import { useMutation, useQuery } from '@tanstack/react-query';

import { getMy, getSessionInfo, signIn } from '@/api/auth';

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: signIn
  });
};

export const useMyMutation = () => {
  return useMutation({
    mutationFn: getMy,
    onSuccess: (data) => {
      console.log(data);
    }
  });
};
export const useSessionInfoQuery = () => {
  return useQuery({
    queryKey: ['sessionInfo'],
    queryFn: getSessionInfo
  });
};
