export default function NotFoundPage() {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <h1 className='mb-4 text-4xl font-bold'>404</h1>
      <p className='mb-8 text-xl text-muted-foreground'>페이지를 찾을 수 없습니다</p>
      <a href='/' className='text-primary hover:underline'>
        홈으로 돌아가기
      </a>
    </div>
  );
}
