import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

// Signed-in users land on the dashboard; visitors go to the marketing /
// sign-in entry. Treat the "loading" state as not-signed-in so the
// href doesn't flicker mid-click.
const Logo = () => {
  const { status } = useSession();
  const href = status === 'authenticated' ? '/dashboards/real-estate' : '/';

  return (
    <Link
      href={href}
      aria-label="Realty Explorers — home"
      className="group inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <span className="relative inline-block size-9 shrink-0">
        <Image
          src="/static/images/logo/hlogo.png"
          alt=""
          fill
          sizes="36px"
          priority
          className="object-contain transition-transform duration-300 group-hover:scale-[1.06]"
        />
      </span>
      <span className="hidden lg:inline font-poppins font-semibold text-[15px] tracking-tight text-slate-800 group-hover:text-slate-900 transition-colors">
        Realty Explorers
      </span>
    </Link>
  );
};

export default Logo;
