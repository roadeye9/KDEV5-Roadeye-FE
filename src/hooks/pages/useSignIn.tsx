import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useSignInMutation } from '../api/auth';

export interface SignInForm {
  tenantId: string;
  username: string;
  password: string;
}

const defaultValue = {
  tenantId: '',
  username: '',
  password: ''
};
export const useSignIn = () => {
  const [signInForm, setSignInForm] = useState<SignInForm>(defaultValue);
  const navigate = useNavigate();
  const mutation = useSignInMutation();

  const handleOnChange = useCallback(
    <K extends keyof SignInForm>(key: K, value: SignInForm[K]) => {
      setSignInForm({
        ...signInForm,
        [key]: value
      });
    },
    [signInForm]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      mutation.mutate(signInForm, {
        onSuccess: () => {
          localStorage.setItem('tenantId', signInForm.tenantId);
          navigate(`/manage/dashboard`);
        }
      });
    },
    [signInForm]
  );

  return {
    signInForm,
    handleOnChange,
    handleSubmit
  };
};
