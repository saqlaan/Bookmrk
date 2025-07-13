"use client";

import { useState, useEffect } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    signInWithGoogle, 
    sendEmailLink,
    completeEmailSignIn
} from '@/lib/auth-actions';
import { Bookmark, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    const checkEmailLink = async () => {
      const result = await completeEmailSignIn();
      if (result?.success) {
        toast({ title: 'Success', description: result.message });
        router.replace('/');
      } else if (result?.message) {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    };

    // Check if this is a sign-in link
    checkEmailLink();
  }, [router, toast]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const error = await signInWithGoogle();
      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      } else {
        router.replace('/');
      }
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const { email } = data;
      const result = await sendEmailLink(email);
      
      if (result.success) {
        setEmailSent(true);
        toast({ title: 'Success', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bookmark className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight font-headline">Bookmrk</h1>
        </div>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>
          {emailSent 
            ? 'Check your email for the login link!'
            : 'Enter your email to receive a sign-in link.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!emailSent && (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="name@example.com" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending login link...
                    </>
                  ) : (
                    'Send login link'
                  )}
                </Button>
              </form>
            </Form>
            <Separator className="my-4" />
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in with Google...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" role="img" aria-label="Google logo">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"></path>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.521-3.308-11.127-7.66l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.244 44 30.023 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>
          </>
        )}
        
        {emailSent && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              The login link has been sent to your email address. Click the link to sign in.
            </p>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setEmailSent(false)}
              disabled={isLoading}
            >
              Try another email
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
