import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const handleGithubLogin = () => {
    const clientId = import.meta.env.VITE_APP_GITHUB_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_APP_GITHUB_REDIRECT_URL;
    const scope = 'read:user user:email';
    
    const githubAuthUrl = `${import.meta.env.VITE_APP_GITHUB_AUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = githubAuthUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-2"
          >
            <Github className="h-5 w-5" />
            GitHub로 로그인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 