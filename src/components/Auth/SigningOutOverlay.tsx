import { useState } from 'react';
import { Loader2, AlertTriangle, LogIn } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'next-auth/react';
import {
  logout,
  selectSigningOut,
  selectSignOutReason,
  setSigningOut
} from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';

// Full-screen overlay that handles two flows:
//
//   - 'manual': the user clicked Sign out themselves; Userbox already
//     fired signOut() and is navigating to the AWS Cognito logout page.
//     Just show a spinner while that's in flight.
//
//   - 'session_expired': an API call returned 401. The reauth handler
//     only set the flag — no auto-redirect. We show a clear message and
//     a "Sign in again" button so the user has context before being
//     thrown to the sign-in page. The button drives the actual signOut.
const SigningOutOverlay = () => {
  const dispatch = useDispatch();
  const signingOut = useSelector(selectSigningOut);
  const reason = useSelector(selectSignOutReason);
  const [confirming, setConfirming] = useState(false);

  if (!signingOut) return null;

  const isExpired = reason === 'session_expired';

  const handleConfirm = async () => {
    if (confirming) return;
    setConfirming(true);
    try {
      await signOut({
        redirect: true,
        callbackUrl: '/auth/signin?reason=session_expired'
      });
      dispatch(logout());
    } catch (e) {
      console.error('Sign-out after session expiry failed', e);
      setConfirming(false);
      // Drop the overlay so the user isn't stuck if signOut throws.
      dispatch(setSigningOut(false));
    }
  };

  if (isExpired) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in font-poppins"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
      >
        <div className="w-full max-w-sm mx-4 rounded-xl bg-white shadow-xl p-6 flex flex-col items-center text-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2
              id="session-expired-title"
              className="text-lg font-semibold text-slate-900"
            >
              Your session expired
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              You've been signed out for security. Please sign in again to
              continue where you left off.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium gap-2"
          >
            {confirming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {confirming ? 'Redirecting to sign in…' : 'Sign in again'}
          </Button>
        </div>
      </div>
    );
  }

  // Manual signout — just a spinner while AWS Cognito logout completes.
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-3 bg-white/85 backdrop-blur-sm animate-fade-in font-poppins"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary-purple" />
      <p className="text-base font-medium text-secondary/90">
        Signing you out…
      </p>
    </div>
  );
};

export default SigningOutOverlay;
