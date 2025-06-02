import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 로그인 로직 구현
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex">
      {/* Left Side - Login Form */}
      <div className="w-[480px] bg-white h-screen flex flex-col">
        <div className="p-8 flex-1">
          <div className="mb-8">
            <img src="/logo.svg" alt="RoadEye" className="h-8 mb-2" />
            <h2 className="text-2xl font-semibold text-gray-900">로그인</h2>
            <p className="text-gray-500 mt-2">차량 관제를 시작하기 위해 로그인해주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="companyCode" className="text-sm font-medium text-gray-700">
                기업 코드
              </Label>
              <Input
                id="companyCode"
                name="companyCode"
                type="text"
                required
                className="mt-1 block w-full bg-gray-50 border-gray-200"
                placeholder="기업 코드를 입력해주세요"
              />
            </div>

            <div>
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                아이디
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full bg-gray-50 border-gray-200"
                placeholder="아이디를 입력해주세요"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                비밀번호
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full bg-gray-50 border-gray-200"
                placeholder="비밀번호를 입력해주세요"
              />
            </div>


            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              로그인
            </Button>
          </form>
        </div>
              </div>

      {/* Right Side - Background */}
      <div className="flex-1 bg-[url('/car-bg.jpg')] bg-cover bg-center" />
    </div>
  );
};

export default LoginPage; 