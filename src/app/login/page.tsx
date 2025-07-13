"use client";

import { AuthForm } from '@/components/auth-form';
import { useAuth } from '@/components/auth-wrapper';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't return null when user exists, let the useEffect handle the redirect
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <AuthForm />
    </div>
  );
}
