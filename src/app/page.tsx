import { AuthWrapper } from '@/components/auth-wrapper';
import { LinkWiseApp } from '@/components/link-wise-app';

export default function Home() {
  return (
    <AuthWrapper>
      <LinkWiseApp />
    </AuthWrapper>
  );
}
