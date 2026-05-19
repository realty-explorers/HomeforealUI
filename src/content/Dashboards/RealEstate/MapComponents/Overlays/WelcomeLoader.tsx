import { memo, useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Circle, Sparkles } from 'lucide-react';
import Logo from '@/components/Auth/Logo';
import { cn } from '@/lib/utils';

type Step = {
  key: string;
  label: string;
  done: boolean;
};

type WelcomeLoaderProps = {
  authReady: boolean;
  workspaceReady: boolean;
  mapReady: boolean;
  /** First name or full name to greet with. Optional. */
  name?: string;
};

const WelcomeLoader = ({
  authReady,
  workspaceReady,
  mapReady,
  name
}: WelcomeLoaderProps) => {
  const allReady = authReady && workspaceReady && mapReady;
  const [hidden, setHidden] = useState(false);

  // Hold the screen briefly after everything is ready so the user sees all
  // ticks complete instead of a jarring instant flash-out.
  useEffect(() => {
    if (!allReady) {
      setHidden(false);
      return;
    }
    const t = setTimeout(() => setHidden(true), 450);
    return () => clearTimeout(t);
  }, [allReady]);

  if (hidden) return null;

  const steps: Step[] = [
    { key: 'auth', label: 'Authenticating session', done: authReady },
    { key: 'workspace', label: 'Loading your workspace', done: workspaceReady },
    { key: 'map', label: 'Preparing the map', done: mapReady }
  ];

  const greeting = name ? `Welcome back, ${name.split(' ')[0]}` : 'Welcome back';

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 flex items-center justify-center overflow-hidden',
        'bg-gradient-to-br from-slate-50 via-white to-violet-50',
        'transition-opacity duration-500 ease-out',
        allReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
    >
      {/* Decorative gradient blobs — static (no animate-pulse) to keep GPU free for Mapbox init */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden [contain:strict]"
      >
        <div className="absolute -top-32 -left-32 w-[40vw] h-[40vw] rounded-full bg-violet-300/30 blur-[80px] will-change-transform" />
        <div className="absolute -bottom-32 -right-32 w-[40vw] h-[40vw] rounded-full bg-fuchsia-300/30 blur-[80px] will-change-transform" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-sky-200/20 blur-[90px] will-change-transform" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-[min(92vw,440px)] rounded-2xl border border-white/60 bg-white/85 backdrop-blur-md shadow-[0_20px_80px_-20px_rgba(99,102,241,0.35)] p-8 flex flex-col items-center gap-6">
        {/* Logo with subtle static glow ring */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-violet-400/30 to-fuchsia-400/30 blur-lg"
          />
          <div className="relative size-16 flex items-center justify-center rounded-2xl bg-white shadow-lg">
            <Logo className="w-10 h-10" />
          </div>
        </div>

        {/* Headline */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.18em] font-bold text-violet-600/80">
            <Sparkles className="size-3" />
            Realty Explorers
          </div>
          <h2 className="font-poppins font-bold text-2xl text-slate-900">
            {greeting}
          </h2>
          <p className="text-sm text-slate-500 font-poppins">
            {allReady
              ? "Let's go — your map is ready"
              : 'Preparing your data, hang tight…'}
          </p>
        </div>

        {/* Steps */}
        <ul className="w-full flex flex-col gap-1.5">
          {steps.map((step, i) => {
            const prevDone = steps.slice(0, i).every((s) => s.done);
            const isActive = !step.done && prevDone;
            return (
              <li
                key={step.key}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300',
                  step.done && 'bg-emerald-50/70',
                  isActive && 'bg-violet-50/70',
                  !step.done && !isActive && 'opacity-50'
                )}
              >
                {step.done ? (
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0 animate-in zoom-in-50 fade-in" />
                ) : isActive ? (
                  <Loader2 className="size-5 text-violet-500 shrink-0 animate-spin" />
                ) : (
                  <Circle className="size-5 text-slate-300 shrink-0" />
                )}
                <span
                  className={cn(
                    'font-poppins text-sm transition-colors',
                    step.done && 'text-emerald-700 font-medium',
                    isActive && 'text-violet-700 font-medium',
                    !step.done && !isActive && 'text-slate-500'
                  )}
                >
                  {step.label}
                </span>
                {step.done && (
                  <span className="ml-auto text-[0.65rem] uppercase tracking-wider font-bold text-emerald-600/80">
                    Done
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default memo(WelcomeLoader);
