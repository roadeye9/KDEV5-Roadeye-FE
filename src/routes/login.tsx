import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignIn } from '@/hooks/pages/useSignIn';

const LoginPage = () => {
  const { handleOnChange, handleSubmit } = useSignIn();

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#F5F6F8]'>
      {/* Login Form Container */}
      <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg'>
        <div className='mb-8 text-center'>
          <h2 className='text-2xl font-semibold text-gray-900'>로그인</h2>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <Label htmlFor='companyCode' className='text-sm font-medium text-gray-700'>
              기업 코드
            </Label>
            <Input
              id='companyCode'
              name='companyCode'
              type='text'
              required
              onChange={(e) => handleOnChange('tenantId', e.target.value)}
              className='mt-1 block w-full border-gray-200 bg-gray-50'
              placeholder='기업 코드를 입력해주세요'
            />
          </div>

          <div>
            <Label htmlFor='username' className='text-sm font-medium text-gray-700'>
              아이디
            </Label>
            <Input
              id='username'
              name='username'
              type='text'
              required
              onChange={(e) => handleOnChange('username', e.target.value)}
              className='mt-1 block w-full border-gray-200 bg-gray-50'
              placeholder='아이디를 입력해주세요'
            />
          </div>

          <div>
            <Label htmlFor='password' className='text-sm font-medium text-gray-700'>
              비밀번호
            </Label>
            <Input
              id='password'
              name='password'
              type='password'
              required
              onChange={(e) => handleOnChange('password', e.target.value)}
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
