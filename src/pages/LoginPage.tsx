import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 로그인 로직 구현
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* Top Navigation */}
      <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-8">
          <img src="/logo.svg" alt="RoadEye" className="h-8" />
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search something..."
              className="pl-10 pr-4 py-2 w-[300px] bg-gray-100 border-0"
            />
          </div>
          <button className="relative">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12">
          {/* Left Side - Car Image */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <img
                src="/car-preview.png"
                alt="Car Preview"
                className="w-full object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 rounded-b-lg">
                <div className="text-white">
                  <h3 className="text-2xl font-bold">RoadEye</h3>
                  <p className="text-sm opacity-90">스마트한 차량 관제 시스템</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Good Day</h2>
              <p className="text-gray-500 mt-2">차량 관제를 시작하기 위해 로그인해주세요.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                    로그인 상태 유지
                  </label>
                </div>

                <button type="button" className="text-sm text-blue-600 hover:text-blue-500">
                  비밀번호 찾기
                </button>
              </div>

              <div className="space-y-4">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  로그인
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                  onClick={() => navigate('/signup')}
                >
                  회원가입
                </Button>
              </div>
            </form>

            {/* Stats Preview */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">70%</div>
                <div className="text-sm text-gray-500">배터리</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">20°C</div>
                <div className="text-sm text-gray-500">온도</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">50.5km</div>
                <div className="text-sm text-gray-500">주행거리</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 