import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, Github, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSnackbar } from 'notistack';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

// Define schema for form validation
const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: SignInFormValues) => {
    setLoading(true);
    setAuthError(null);

    try {
      // Simulate authentication with NextAuth signIn
      // In a real app, this would be:
      const result = await signIn('login', {
        redirect: false,
        email: data.email,
        password: data.password
      });

      if (!result.ok) {
        setAuthError(result.error);
        setLoading(false);
        return;
      }

      enqueueSnackbar('Welcome back!', {
        variant: 'success'
      });

      // Redirect to dashboard
      router.push('/dashboards/real-estate');
    } catch (error) {
      setAuthError('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {authError && (
          <div className="p-3 rounded-md bg-destructive/[.15] text-destructive text-sm">
            {authError}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                className={`pl-10 transition-all duration-300 border-muted-foreground/20 focus:border-primary ${
                  errors.email
                    ? 'border-destructive focus:border-destructive'
                    : ''
                }`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm font-medium text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium border-t-primary-light hover:text-secondary-purple text-purple-600 no-underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`pl-10 transition-all duration-300 border-muted-foreground/20 focus:border-primary ${
                  errors.password
                    ? 'border-destructive focus:border-destructive'
                    : ''
                }`}
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-sm font-medium text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#9b87f5]/80 to-[#7E69AB]/80 hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 hover:shadow-purple-500/25 hover:scale-[1.02] hover:-translate-y-0.5 group cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
        <Button
          variant="outline"
          className="bg-morphic border border-muted-foreground/10 hover:border-primary-purple/30 hover:shadow-md transition-all duration-300 cursor-pointer"
          type="button"
          onClick={() => {
            signIn('cognito', {
              callbackUrl: '/dashboards/real-estate',
              identity_provider: 'Google'
            });
          }}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Button asChild variant="link" className="p-0">
          <Link
            href="/auth/signup"
            className="font-medium text-primary-purple hover:text-secondary-purple transition-colors duration-300 underline-offset-4 hover:underline text-purple-600 no-underline"
          >
            Sign up
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SignInForm;
