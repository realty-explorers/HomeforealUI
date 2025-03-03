// pages/auth/signin.js
import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import LoadingScreen from '@/components/Auth/LoadingScreen';

export default function SignIn() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const callbackUrl = router.query.callbackUrl as string;

  useEffect(() => {
    const callbackUrl = searchParams.get('callbackUrl') || '';
    // Automatically trigger Cognito sign-in as soon as the component mounts
    signIn('cognito', { callbackUrl: callbackUrl || '/' });
  }, [callbackUrl]);

  return (
    <div className="min-h-screen">
      <LoadingScreen
        message="Authenticating..."
        companyOneLogoUrl="/static/images/logo/hlogo.png"
      />
    </div>
  );
}
