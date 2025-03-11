import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSnackbar } from 'notistack';
import Link from 'next/link';

// Email step schema
const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' })
});

// Verification code schema
const verificationSchema = z.object({
  code: z.string().min(6, { message: 'Please enter a valid verification code' })
});

// New password schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm password must be at least 8 characters' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type EmailFormValues = z.infer<typeof emailSchema>;
type VerificationFormValues = z.infer<typeof verificationSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

// Steps for password reset
enum ResetStep {
  EMAIL = 0,
  VERIFICATION = 1,
  NEW_PASSWORD = 2,
  SUCCESS = 3
}

const ForgotPasswordForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [currentStep, setCurrentStep] = useState<ResetStep>(ResetStep.EMAIL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');

  // Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ''
    }
  });

  // Verification code form
  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: ''
    }
  });

  // New password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  // Handle email submission
  const onEmailSubmit = async (data: EmailFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call to send verification code
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you'd call an API to send a verification code
      // const response = await fetch('/api/send-verification', {
      //   method: 'POST',
      //   body: JSON.stringify({ email: data.email }),
      // });

      setEmail(data.email);
      enqueueSnackbar('Verification code sent', {
        variant: 'success'
      });
      setCurrentStep(ResetStep.VERIFICATION);
    } catch (error) {
      setError('Failed to send verification code. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle verification code submission
  const onVerificationSubmit = async (data: VerificationFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call to verify code
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you'd verify the code with your API
      // const response = await fetch('/api/verify-code', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, code: data.code }),
      // });

      // Randomly succeed/fail to demonstrate error handling
      const success = Math.random() > 0.3;

      if (!success) {
        setError('Invalid verification code. Please try again.');
        setLoading(false);
        return;
      }

      enqueueSnackbar('Code verified', {
        variant: 'success'
      });

      setCurrentStep(ResetStep.NEW_PASSWORD);
    } catch (error) {
      setError('Failed to verify code. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle new password submission
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you'd reset the password with your API
      // const response = await fetch('/api/reset-password', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password: data.password }),
      // });

      enqueueSnackbar('Password reset successful', {
        variant: 'success'
      });
      setCurrentStep(ResetStep.SUCCESS);
    } catch (error) {
      setError('Failed to reset password. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Go back to previous step
  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  // Render step title and description
  const renderStepHeader = () => {
    switch (currentStep) {
      case ResetStep.EMAIL:
        return (
          <>
            <h1 className="text-3xl font-bold tracking-tight">
              Reset Password
            </h1>
            <p className="text-muted-foreground">
              Enter your email to receive a verification code
            </p>
          </>
        );
      case ResetStep.VERIFICATION:
        return (
          <>
            <h1 className="text-3xl font-bold tracking-tight">Verification</h1>
            <p className="text-muted-foreground">
              Enter the code we sent to your email
            </p>
          </>
        );
      case ResetStep.NEW_PASSWORD:
        return (
          <>
            <h1 className="text-3xl font-bold tracking-tight">New Password</h1>
            <p className="text-muted-foreground">Enter your new password</p>
          </>
        );
      case ResetStep.SUCCESS:
        return (
          <>
            <h1 className="text-3xl font-bold tracking-tight">Success!</h1>
            <p className="text-muted-foreground">
              Your password has been reset successfully
            </p>
          </>
        );
    }
  };

  // Render form based on current step
  const renderStepForm = () => {
    switch (currentStep) {
      case ResetStep.EMAIL:
        return (
          <form
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
            className="space-y-6"
          >
            {error && (
              <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  className={`pl-10 transition-all duration-300 border-muted-foreground/20 focus:border-primary ${
                    emailForm.formState.errors.email
                      ? 'border-destructive focus:border-destructive'
                      : ''
                  }`}
                  {...emailForm.register('email')}
                />
              </div>
              {emailForm.formState.errors.email && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#9b87f5]/80 to-[#7E69AB]/80 hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 hover:shadow-purple-500/25 hover:scale-[1.02] hover:-translate-y-0.5 group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Send Verification Code
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        );

      case ResetStep.VERIFICATION:
        return (
          <form
            onSubmit={verificationForm.handleSubmit(onVerificationSubmit)}
            className="space-y-6"
          >
            {error && (
              <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="code"
                  placeholder="Enter verification code"
                  className={`pl-10 transition-all duration-300 border-muted-foreground/20 focus:border-primary ${
                    verificationForm.formState.errors.code
                      ? 'border-destructive focus:border-destructive'
                      : ''
                  }`}
                  {...verificationForm.register('code')}
                />
              </div>
              {verificationForm.formState.errors.code && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {verificationForm.formState.errors.code.message}
                </p>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border border-muted-foreground/10 hover:border-primary-purple/30 hover:shadow-md transition-all duration-300"
                onClick={goBack}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#9b87f5]/80 to-[#7E69AB]/80 hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 hover:shadow-purple-500/25 hover:scale-[1.02] hover:-translate-y-0.5 group"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Verify Code
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </form>
        );

      case ResetStep.NEW_PASSWORD:
        return (
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-6"
          >
            {error && (
              <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-10 transition-all duration-300 border-muted-foreground/20 focus:border-primary ${
                      passwordForm.formState.errors.password
                        ? 'border-destructive focus:border-destructive'
                        : ''
                    }`}
                    {...passwordForm.register('password')}
                  />
                </div>
                {passwordForm.formState.errors.password && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-10 transition-all duration-300 border-muted-foreground/20 focus:border-primary ${
                      passwordForm.formState.errors.confirmPassword
                        ? 'border-destructive focus:border-destructive'
                        : ''
                    }`}
                    {...passwordForm.register('confirmPassword')}
                  />
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border border-muted-foreground/10 hover:border-primary-purple/30 hover:shadow-md transition-all duration-300"
                onClick={goBack}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#9b87f5]/80 to-[#7E69AB]/80 hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 hover:shadow-purple-500/25 hover:scale-[1.02] hover:-translate-y-0.5 group"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </form>
        );

      case ResetStep.SUCCESS:
        return (
          <div className="space-y-6">
            <div className="p-3 rounded-md bg-green-100 text-green-800 text-sm">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </div>

            <Button
              type="button"
              className="w-full bg-gradient-to-r from-[#9b87f5]/80 to-[#7E69AB]/80 hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 hover:shadow-purple-500/25 hover:scale-[1.02] hover:-translate-y-0.5 group"
              onClick={() => (window.location.href = '/')}
            >
              Return to Sign In
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="space-y-2 text-center">{renderStepHeader()}</div>

      {renderStepForm()}

      {currentStep === ResetStep.EMAIL && (
        <div className="text-center text-sm">
          Remember your password?{' '}
          <Link
            href="/auth/signin"
            className="font-medium text-primary-purple hover:text-secondary-purple transition-colors duration-300 underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
