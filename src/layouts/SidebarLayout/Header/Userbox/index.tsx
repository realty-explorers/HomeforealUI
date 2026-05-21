'use client';

import { useEffect } from 'react';
import NextLink from 'next/link';
import { Loader2, LockOpen, UserSquare2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut, useSession } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  selectSigningOut,
  setSigningOut,
  setSignOutReason,
  setToken
} from '@/store/slices/authSlice';
import { cn } from '@/lib/utils';
import VerificationAlertBadge from './VerificationAlertBadge';

const FALLBACK_AVATAR = '/static/images/avatars/avatar2.png';

// First letters of name (or email local-part), capped at 2 chars, for
// the avatar fallback when no image is available.
const initials = (name?: string | null, email?: string | null) => {
  const src = (name || email?.split('@')[0] || '?').trim();
  return (
    src
      .split(/[\s._-]+/)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('') || '?'
  );
};

const HeaderUserbox = () => {
  const { data } = useSession();
  const user = data?.user;
  const dispatch = useDispatch();
  const signingOut = useSelector(selectSigningOut);

  useEffect(() => {
    if (data) dispatch(setToken(data.user.accessToken));
  }, [data, dispatch]);

  const handleSignOut = async () => {
    if (signingOut) return;
    dispatch(setSignOutReason('manual'));
    dispatch(setSigningOut(true));
    try {
      await signOut({ redirect: false });
      const awsDomain = 'https://auth.realty-explorers.com';
      const logoutUrl = `${awsDomain}/logout?client_id=f9c39cp5p9pmstb1a45lun2n4&logout_uri=${process.env.NEXT_PUBLIC_URL}`;
      window.location.href = logoutUrl;
    } catch (e) {
      // NextAuth signOut very rarely throws; if it does, clear the
      // overlay so the user can retry instead of being stuck.
      console.error('Sign out failed', e);
      dispatch(setSigningOut(false));
    }
  };

  return (
    <div className="flex items-center gap-2">
      {user && !user.verified && <VerificationAlertBadge />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Account menu"
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-transform hover:scale-[1.06]"
          >
            <Avatar className="size-8 ring-1 ring-slate-200">
              <AvatarImage
                src={user?.image || FALLBACK_AVATAR}
                alt={user?.name || user?.email || 'Account'}
              />
              <AvatarFallback className="text-xs bg-slate-100 text-slate-700">
                {initials(user?.name, user?.email)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-72 p-0 overflow-hidden font-poppins"
        >
          {/* User header — tinted strip with avatar + identity. */}
          <div className="flex items-center gap-3 bg-slate-100/80 px-3 py-3">
            <Avatar className="size-10 rounded-md ring-1 ring-slate-200">
              <AvatarImage
                src={user?.image || FALLBACK_AVATAR}
                alt={user?.name || user?.email || 'Account'}
                className="object-cover"
              />
              <AvatarFallback className="text-xs bg-slate-200 text-slate-700 rounded-md">
                {initials(user?.name, user?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span
                className="text-sm font-semibold text-slate-900 truncate"
                title={user?.name || user?.email || undefined}
              >
                {user?.name || user?.email}
              </span>
              {user?.name && user?.email && (
                <span
                  className="text-[11px] text-slate-500 truncate"
                  title={user.email}
                >
                  {user.email}
                </span>
              )}
            </div>
          </div>

          <DropdownMenuSeparator className="m-0" />

          {/* Navigation row(s). */}
          <div className="p-1.5">
            <DropdownMenuItem asChild>
              <NextLink
                href="/management/profile"
                className="cursor-pointer py-2 text-sm text-slate-700 focus:text-slate-900"
              >
                <UserSquare2 className="size-4 mr-2 text-slate-500" />
                My Profile
              </NextLink>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="m-0" />

          {/* Sign-out CTA — full-width, centered. Semantic rose tone
              signals a destructive action without leaning on the brand
              purple, which is reserved for the active-nav indicator. */}
          <div className="p-2">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className={cn(
                'inline-flex w-full items-center justify-center gap-2 rounded-md',
                'px-3 py-2 text-sm font-medium text-rose-600',
                'transition-colors hover:bg-rose-50 focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-rose-300',
                signingOut && 'opacity-60 cursor-not-allowed'
              )}
            >
              {signingOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LockOpen className="size-4" />
              )}
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderUserbox;
