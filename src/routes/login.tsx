import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMyInfoQuery, useSessionInfoQuery, useSignInMutation } from '@/hooks/api/auth';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import z from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schema = z.object({
  companyId: z.number(),
  username: z.string().min(1),
  password: z.string().min(1),
}).required();

const LoginPage = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      companyId: 2,
      username: "roadeye",
      password: "roadeye",
    },
  });

  const { mutate: doSignIn } = useSignInMutation();
  const { refetch: refetchSessionInfo } = useSessionInfoQuery();
  const { refetch: refetchMyInfo } = useMyInfoQuery();

  const onSubmit = (data: z.infer<typeof schema>) => {
    doSignIn(data, {
      onSuccess: () => {
        Promise.all([refetchSessionInfo(), refetchMyInfo()])
          .then(() => {
            navigate('/manage/dashboard');
          });
      }
    });
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#F5F6F8]'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg'>
        <div className='mb-8 text-center'>
          <h2 className='text-2xl font-semibold text-gray-900'>로그인</h2>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <div>
            <Label htmlFor='companyCode' className='text-sm font-medium text-gray-700'>
              기업 코드
            </Label>
            <Input
              {...form.register('companyId')}
              className='mt-1 block w-full border-gray-200 bg-gray-50'
              placeholder='기업 코드를 입력해주세요'
            />
          </div>

          <div>
            <Label htmlFor='username' className='text-sm font-medium text-gray-700'>
              아이디
            </Label>
            <Input
              {...form.register('username')}
              className='mt-1 block w-full border-gray-200 bg-gray-50'
              placeholder='아이디를 입력해주세요'
            />
          </div>

          <div>
            <Label htmlFor='password' className='text-sm font-medium text-gray-700'>
              비밀번호
            </Label>
            <Input
              {...form.register('password')}
              className='mt-1 block w-full border-gray-200 bg-gray-50'
              placeholder='비밀번호를 입력해주세요'
            />
          </div>

          <Button type='submit' className='w-full bg-blue-600 hover:bg-blue-700'>
            로그인
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
