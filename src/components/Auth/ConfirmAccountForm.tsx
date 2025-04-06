import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  Mail,
  Lock,
  UserPlus,
  User,
  ArrowRight,
  Github
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { signupUser } from 'lib/auth/auth';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '../ui/input-otp';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.'
  })
});

const ConfirmAccountForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    setAuthError(null);

    try {
      enqueueSnackbar('Account created!', {
        variant: 'success'
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'An unexpected error occurred';
      setAuthError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Confirm your account
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {authError && (
            <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">
              {authError}
            </div>
          )}

          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4"></div>

          <Button
            type="button"
            className="w-full bg-gradient-to-r from-[#9b87f5]/80 to-[#7E69AB]/80 hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 hover:shadow-purple-500/25 hover:scale-[1.02] hover:-translate-y-0.5 group cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>Send Confirmation Code</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ConfirmAccountForm;
