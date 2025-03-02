import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function ReferralHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Initializing authentication...');
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
    // Get the return path from URL query parameter
    // const returnTo = searchParams.get('returnTo') || '/';
    console.log('returnTo:', returnTo);

    setStatus('Waiting for authentication token...');

    // Function to check localStorage for token
    const checkForToken = (returnTo: string) => {
      try {
        const token = localStorage.getItem('authToken');
        const email = localStorage.getItem('email');
        if (token && status !== 'Token found, authenticating...') {
          setStatus('Token found, authenticating...');
          console.log('found token, current status:', status);
          console.log('redirecting to', returnTo);

          // Authenticate with NextAuth
          signIn('credentials', {
            token,
            email,
            redirect: false
          })
            .then((result) => {
              if (result?.ok) {
                setStatus(
                  'Authentication successful, redirecting... to ' + returnTo
                );

                const meow = searchParams.get('returnTo') || '/';
                console.log('Authentication successful, redirecting to', meow);
                // Redirect to the original URL
                router.push(meow);
              } else {
                setStatus('Authentication failed');
                setError(result?.error || 'Unknown authentication error');
              }
            })
            .catch((err) => {
              setStatus('Authentication error');
              setError(err.message || 'An unexpected error occurred');
            });
          return true;
        }
        return false;
      } catch (err) {
        setStatus('Error accessing localStorage');
        setError(err.message);
        return true; // Return true to stop polling
      }
    };

    // Check immediately
    if (!checkForToken(returnTo)) {
      setStatus('Waiting for token...');

      // Set up polling
      const interval = setInterval(() => {
        if (checkForToken(returnTo)) {
          clearInterval(interval);
        }
      }, 500);

      // Timeout after 30 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setStatus('Authentication timed out');
        setError('No authentication token was detected within the time limit');
      }, 30000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [router, searchParams]);

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
