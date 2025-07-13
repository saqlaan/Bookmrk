"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail 
} from '@/lib/auth-actions';
import { Bookmark } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleGoogleSignIn = async () => {
    const error = await signInWithGoogle();
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      router.push('/');
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    const { email, password } = data;
    let error;

    if (isSignUp) {
      error = await signUpWithEmail(email, password);
    } else {
      error = await signInWithEmail(email, password);
    }
    
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      router.push('/');
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bookmark className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight font-headline">LinkWise</h1>
        </div>
        <CardTitle>{isSignUp ? 'Create an account' : 'Sign in to your account'}</CardTitle>
        <CardDescription>
          {isSignUp ? 'Enter your email and password to sign up.' : 'Welcome back! Please sign in to continue.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
        </Form>
        <Separator className="my-4" />
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" role="img" aria-label="Google logo">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.521-3.308-11.127-7.66l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.244 44 30.023 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
            </svg>
            Sign in with Google
        </Button>

        <div className="mt-4 text-center text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <Button variant="link" onClick={() => setIsSignUp(!isSignUp)} className="px-1">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
