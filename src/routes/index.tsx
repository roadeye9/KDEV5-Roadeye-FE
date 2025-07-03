import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import QuoteRequestModal from '@/components/QuoteRequestModal';
import drivingVideo from '@/assets/vod/driving.mp4';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold">RoadEye</div>
          <div className="flex gap-6 text-sm">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-gray-600 hover:text-gray-800"
            >
              견적 문의
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <Button 
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleStartClick}
          >
            시작하기
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" /> {/* 오버레이 */}
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={drivingVideo} type="video/mp4" />
          </video>
        </div>

        <div className="container mx-auto px-6 py-32 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
              GPS 단말기 없는,<br />
              <span className="text-blue-400">자동운행일지</span>로<br />
              RoadEye를 경험해보세요.
            </h1>
            <div className="flex gap-4 justify-center mt-8">
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8"
                onClick={handleStartClick}
              >
                시작하기
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-4">운행기록 작성<br/><span className="text-blue-500">오직 앱 하나로,</span></h2>
            <p className="text-gray-600">
              복잡한 운행기록 작성은 이제 그만!<br/>
              앱으로 쉽고 간편하게 작성하세요.
            </p>
          </div>

          <div className="mb-32">
            <img src="/images/app-screen.png" alt="앱 스크린샷" className="w-full" />
          </div>

          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-4">
              업무 조작 없이<br/>
              <span className="text-blue-500">자동 운행기록,</span>
            </h2>
            <p className="text-gray-600">
              GPS와 이동통신 기술로<br/>
              정확한 위치 기반의 운행기록을 자동으로 작성합니다.
            </p>
            <div className="mt-8">
              <img src="/images/car-illustration.png" alt="자동차 일러스트" className="mx-auto" />
            </div>
          </div>

          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-4">법인차량 운행일지 자동 생성</h2>
            <p className="text-gray-600">
              수기로 작성 했던 귀찮은 운행일지를 자동으로 생성하고<br/>
              관리자 페이지에서 한눈에 확인하세요.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <img src="/images/dashboard-1.png" alt="대시보드 화면" className="w-full" />
              <img src="/images/dashboard-2.png" alt="대시보드 화면" className="w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            우리 회사 차량관리는 <span className="text-blue-500">RoadEye로 해결,</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <img src="/images/icon-1.png" alt="아이콘" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="font-bold mb-2">운행비 정산</h3>
              <p className="text-gray-600 text-sm">
                정확한 운행거리 기반으로<br/>
                운행비를 정산해보세요
              </p>
            </div>
            <div className="text-center">
              <img src="/images/icon-2.png" alt="아이콘" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="font-bold mb-2">차량 관리</h3>
              <p className="text-gray-600 text-sm">
                체계적인 차량관리로<br/>
                비용을 절감하세요
              </p>
            </div>
            <div className="text-center">
              <img src="/images/icon-3.png" alt="아이콘" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="font-bold mb-2">불편사항</h3>
              <p className="text-gray-600 text-sm">
                24시간 고객센터 운영으로<br/>
                신속한 응대를 약속드립니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">
          100만 곳 이상의 기업이<br/>
          <span className="text-blue-500">RoadEye를 신뢰</span> 할 수 있는 이유
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold text-blue-500 mb-2">100,494</div>
            <div className="text-gray-600">가입 고객사</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500 mb-2">91,761,356</div>
            <div className="text-gray-600">월 평균 운행거리</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500 mb-2">2,357,563,847</div>
            <div className="text-gray-600">누적 운행거리</div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="container mx-auto px-6 py-20 border-t">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center justify-items-center opacity-60">
          <img src="/images/partner-1.png" alt="파트너사 로고" className="h-8" />
          <img src="/images/partner-2.png" alt="파트너사 로고" className="h-8" />
          <img src="/images/partner-3.png" alt="파트너사 로고" className="h-8" />
          <img src="/images/partner-4.png" alt="파트너사 로고" className="h-8" />
          <img src="/images/partner-5.png" alt="파트너사 로고" className="h-8" />
          <img src="/images/partner-6.png" alt="파트너사 로고" className="h-8" />
          <img src="/images/partner-7.png" alt="파트너사 로고" className="h-8" />
          <img src="/images/partner-8.png" alt="파트너사 로고" className="h-8" />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">오늘부터 RoadEye로 운행해 보세요.</h2>
          <Button 
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 mt-4"
          >
            무료 시작하기
          </Button>
        </div>
      </div>

      <QuoteRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default LandingPage; 