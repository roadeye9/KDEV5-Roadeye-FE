import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({ isOpen, onClose }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 폼 제출 로직 추가
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600 p-0 sm:max-w-[600px]'>
        <div className='m-[2px] rounded-[inherit] bg-white'>
          <DialogHeader className='px-6 pt-6'>
            <DialogTitle className='text-center text-3xl font-bold text-gray-800'>
              견적 신청
            </DialogTitle>
            <p className='mt-2 text-center text-gray-600'>
              아래 정보를 입력해 주시면 빠르게 연락드리겠습니다.
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='px-6 py-4'>
            <div className='mb-4 grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='root_username' className='mb-1 block text-sm text-gray-600'>
                  아이디
                </Label>
                <Input
                  id='root_username'
                  placeholder='관리자 아이디를 입력해주세요'
                  className='w-full'
                  required
                />
              </div>
              <div>
                <Label htmlFor='root_password' className='mb-1 block text-sm text-gray-600'>
                  비밀번호
                </Label>
                <Input
                  id='root_password'
                  type='password'
                  placeholder='관리자 비밀번호를 입력해주세요'
                  className='w-full'
                  required
                />
              </div>
              <div>
                <Label htmlFor='company_code' className='mb-1 block text-sm text-gray-600'>
                  회사 코드
                </Label>
                <Input
                  id='company_code'
                  placeholder='회사 코드를 입력해주세요'
                  className='w-full'
                  required
                />
              </div>
              <div>
                <Label htmlFor='company_name' className='mb-1 block text-sm text-gray-600'>
                  회사명
                </Label>
                <Input
                  id='company_name'
                  placeholder='회사명을 입력해주세요'
                  className='w-full'
                  required
                />
              </div>
              <div>
                <Label htmlFor='company_bis_no' className='mb-1 block text-sm text-gray-600'>
                  사업자 등록번호
                </Label>
                <Input
                  id='company_bis_no'
                  placeholder='사업자 등록번호를 입력해주세요'
                  className='w-full'
                  required
                />
              </div>
              <div>
                <Label htmlFor='company_email' className='mb-1 block text-sm text-gray-600'>
                  회사 이메일
                </Label>
                <Input
                  id='company_email'
                  type='email'
                  placeholder='회사 이메일을 입력해주세요'
                  className='w-full'
                  required
                />
              </div>
            </div>

            <div className='flex justify-center pb-6'>
              <Button
                type='submit'
                className='w-full rounded-md bg-gradient-to-r from-purple-500 to-blue-600 px-8 py-2 text-white hover:opacity-90 sm:w-auto'
              >
                견적 신청하기
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteRequestModal;
