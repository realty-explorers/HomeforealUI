import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import posthog from 'posthog-js';

/**
 * Component that identifies the user to PostHog when they are logged in.
 * This should be used client-side to ensure PostHog knows the identity of the current user.
 */
export default function PostHogUserIdentifier() {
  const { data: session } = useSession();

  useEffect(() => {
    // When the session changes and user is logged in, identify them in PostHog
    if (session?.user?.id) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
        verified: session.user.verified,
        roles: session.user.roles,
        $initial_referrer: document.referrer || undefined
      });
      
      // You can also record that they logged in
      posthog.capture('user_signed_in');
    } else if (!session) {
      // When a user logs out, we should clear their identity
      posthog.reset();
    }
  }, [session]);

  // This is a utility component that doesn't render anything
  return null;
}