import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import LoadingScreen from '@/components/Auth/LoadingScreen';
import { ShieldCheck, ShieldX } from 'lucide-react';
import { checkProjoAuthToken } from 'lib/integrations/projo/auth';

const authStatus = {
  INITIALIZING: 'Initializing authentication...',
  AUTHENTICATING: 'Authenticating your session',
  AUTH_SUCCESS: 'Authentication successful',
  AUTH_FAILED: 'Authentication failed'
};

export default function ReferralHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('INITIALIZING');
  const [error, setError] = useState(null);
  const [returnTo, setReturnTo] = useState('');
  useEffect(() => {
    // Only set returnTo once on initial render
    if (!returnTo) {
      setReturnTo(searchParams.get('returnTo') || '/');
    }
  }, [searchParams, returnTo]);

  useEffect(() => {
    if (!returnTo) return;
    console.log('returnTo:', returnTo);
    setStatus('AUTHENTICATING');
    const checkForToken = async (returnTo: string) => {
      try {
        const referral = searchParams.get('referral');
        const token = searchParams.get('token');
        if (referral && token) {
          console.log('found token, current status:', status);
          console.log('redirecting to', returnTo);

          // Authenticate with NextAuth
          const result = await signIn('referral', {
            redirect: false,
            referral,
            token
          });

          if (!result.ok) {
            console.log(JSON.stringify(result));
            setStatus('AUTH_FAILED');
            setError(result?.error || 'Unknown authentication error');
          } else {
            setStatus('AUTH_SUCCESS');

            const meow = searchParams.get('returnTo') || '/';
            console.log('Authentication successful, redirecting to', meow);
            // Redirect to the original URL
            router.push(meow);
          }
        }
      } catch (err) {
        setStatus('Error accessing localStorage');
        setError(err.message);
      }
    };
    checkForToken(returnTo);
  }, [searchParams, returnTo]);

  return (
    <div className="min-h-screen">
      {(status === 'AUTHENTICATING' || status === 'INITIALIZING') && (
        <LoadingScreen
          message={authStatus[status]}
          companyTwoLogoUrl="/static/images/logo/hlogo.png"
          companyOneLogoUrl="/static/images/logo/projo-logo.png"
        />
      )}

      {status === 'AUTH_SUCCESS' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100 ">
          <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-sm p-8 animate-fade-in flex flex-col justify-center items-center">
            <h1 className="text-2xl font-medium mb-6 text-center">
              Authentication Complete
            </h1>
            <ShieldCheck size={36} color="#9b87f5" />
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-center mb-6">
              Your session has been successfully authenticated between the two
              companies.
            </p>
            <div className="flex justify-center"></div>
          </div>
        </div>
      )}

      {status === 'AUTH_FAILED' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100 ">
          <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-sm p-8 animate-fade-in flex flex-col justify-center items-center">
            <h1 className="text-2xl font-medium mb-6 text-center">
              Authentication Failed
            </h1>
            <ShieldX size={36} color="#9b87f5" />
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-center mb-6">
              {error}
            </p>
            <div className="flex justify-center">
              <button
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg shadow-sm hover:from-blue-600 hover:to-violet-600 transition-all duration-300"
                onClick={() => router.push('/auth/signin')}
              >
                Return to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="auth-handler-container">
      <div className="auth-handler-card">
        <h2>Authentication in Progress</h2>
        {!error && <div className="loader-spinner"></div>}
        <p className="status-message">{status}</p>
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="return-home-button"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
