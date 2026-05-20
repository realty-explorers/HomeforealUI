import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectSigningOut } from '@/store/slices/authSlice';

// Full-screen feedback shown while we're signing the user out — either
// from the user menu or when an API call returns 401 and the reauth
// handler kicks them out. Renders on top of the app so navigation /
// session-clear delays don't look like a dead app.
const SigningOutOverlay = () => {
  const signingOut = useSelector(selectSigningOut);
  if (!signingOut) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-white/85 backdrop-blur-sm animate-fade-in"
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
