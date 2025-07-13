import { BookmrkApp } from '@/components/bookmrk-app';
import { AuthWrapper } from '@/components/auth-wrapper';

export default function Home() {
  return (
    <AuthWrapper>
      <BookmrkApp />
    </AuthWrapper>
  );
}
