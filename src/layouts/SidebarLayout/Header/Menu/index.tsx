'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LayoutGroup, motion } from 'framer-motion';
import { Menu as MenuIcon } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

type Page = { title: string; href: string; requireAdmin?: boolean };

const pages: Page[] = [
  { title: 'Search', href: '/dashboards/real-estate' },
  { title: 'BuyBox', href: '/dashboards/buybox' },
  { title: 'Admin', href: '/dashboards/admin', requireAdmin: true }
];

const HeaderMenu = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const visible = pages.filter(
    (p) =>
      !p.requireAdmin ||
      (p.requireAdmin && session?.user?.roles?.includes('admin'))
  );

  return (
    <>
      {/* desktop nav */}
      <div className="hidden md:flex items-center gap-6">
        <Logo />
        <LayoutGroup id="header-nav">
          <nav className="flex items-center gap-1" aria-label="Main">
            {visible.map((page) => {
              const active = pathname === page.href;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative px-4 py-2 text-sm tracking-wide rounded outline-none transition-colors',
                    'focus-visible:ring-2 focus-visible:ring-primary/40',
                    active
                      ? 'text-slate-900 font-medium'
                      : 'text-slate-500 hover:text-slate-900'
                  )}
                >
                  {page.title}
                  {/* Hover preview: faded pill that slides up from below.
                      Hidden on the active item (active indicator handles it). */}
                  {!active && (
                    <span
                      aria-hidden
                      className={cn(
                        'pointer-events-none absolute inset-x-0 mx-auto -bottom-1',
                        'h-1 w-9 rounded-full bg-secondary/40',
                        'opacity-0',
                        'group-hover:opacity-100 group-hover:bottom-0',
                        'transition-all duration-200 ease-out'
                      )}
                    />
                  )}
                  {/* Active indicator: tween-animated between links.
                      Centered via inset-x-0 + mx-auto (not translate-x)
                      because framer's layout animation overrides any
                      transform on this element. Tween (vs spring) feels
                      snappier because there's no settle phase. */}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="pointer-events-none absolute inset-x-0 mx-auto bottom-0 h-1 w-9 rounded-full bg-secondary"
                      transition={{
                        type: 'tween',
                        duration: 0.22,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>
      </div>

      {/* mobile nav */}
      <div className="flex md:hidden items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex items-center justify-center size-9 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <MenuIcon className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 font-poppins">
            <SheetHeader className="border-b px-4 py-3 text-left">
              <SheetTitle className="text-base">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-2" aria-label="Main">
              {visible.map((page) => {
                const active = pathname === page.href;
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'px-3 py-2.5 rounded-md text-sm tracking-wide transition-colors',
                      active
                        ? 'bg-slate-100 text-slate-900 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    {page.title}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <Logo />
      </div>
    </>
  );
};

export default HeaderMenu;
