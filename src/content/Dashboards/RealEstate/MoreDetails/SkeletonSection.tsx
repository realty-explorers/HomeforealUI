import { memo, useEffect, useState } from 'react';
import {
  Home,
  CheckCircle2,
  Loader2,
  Circle,
  Sparkles,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = { key: string; label: string };

const STEPS: Step[] = [
  { key: 'details', label: 'Loading property details' },
  { key: 'market', label: 'Loading market data' },
  { key: 'comps', label: 'Loading comparable sales' },
  { key: 'ready', label: 'Rendering analysis' }
];

const INITIAL_ADVANCE_MS = 350;
const FINISH_STEP_MS = 280;
const HOLD_AFTER_DONE_MS = 300;

// Index of the stage that "waits for the API" — everything before this
// auto-advances on a timer; this stage holds until `loading` flips false.
const WAITING_STAGE = 2; // 0=details (fast), 1=market (fast), 2=comps (waits)

type SkeletonSectionProps = {
  /** True while the API call is still pending. */
  loading: boolean;
  /** Called once all stages have played out. Parent should swap to real content. */
  onReady?: () => void;
};

const SkeletonSection = ({ loading, onReady }: SkeletonSectionProps) => {
  // stage = index of the currently-active step.
  // stage >= STEPS.length means everything is done.
  const [stage, setStage] = useState(0);

  // Stages before WAITING_STAGE auto-advance on a timer so the user sees
  // them tick over even before the API responds. The WAITING_STAGE itself
  // holds until `loading` flips false.
  useEffect(() => {
    if (stage >= WAITING_STAGE) return;
    const t = setTimeout(() => setStage((s) => s + 1), INITIAL_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [stage]);

  // Once the API is done and we're at or past the waiting stage, drain the
  // remaining stages one tick at a time.
  useEffect(() => {
    if (loading || stage < WAITING_STAGE || stage >= STEPS.length) return;
    const t = setTimeout(() => {
      setStage((s) => Math.min(s + 1, STEPS.length));
    }, FINISH_STEP_MS);
    return () => clearTimeout(t);
  }, [loading, stage]);

  // When all stages are complete, hold briefly so the user sees the final
  // green ticks, then signal the parent.
  useEffect(() => {
    if (stage < STEPS.length) return;
    const t = setTimeout(() => {
      onReady?.();
    }, HOLD_AFTER_DONE_MS);
    return () => clearTimeout(t);
  }, [stage, onReady]);

  return (
    <div className="relative flex items-center justify-center h-full min-h-[60vh] w-full overflow-hidden">
      {/* Soft ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden [contain:strict]"
      >
        <div className="absolute -top-24 -left-24 w-[40vw] h-[40vw] rounded-full bg-violet-200/40 blur-[80px]" />
        <div className="absolute -bottom-24 -right-24 w-[40vw] h-[40vw] rounded-full bg-fuchsia-200/40 blur-[80px]" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-[min(92%,420px)] mx-auto px-6 py-7 rounded-2xl border border-white/60 bg-white/85 backdrop-blur-sm shadow-[0_20px_60px_-20px_rgba(99,102,241,0.25)] flex flex-col items-center gap-5">
        {/* House icon with pulsing rings */}
        <div className="relative size-16 flex items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-400/30 to-fuchsia-400/30 animate-ping [animation-duration:2.5s]"
          />
          <span
            aria-hidden
            className="absolute inset-1 rounded-xl bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 animate-ping [animation-duration:2.5s] [animation-delay:0.6s]"
          />
          <span className="relative flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 shadow-lg shadow-violet-500/30">
            <Home className="size-7 text-white drop-shadow-sm" />
          </span>
        </div>

        {/* Headline */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.18em] font-bold text-violet-600/80">
            <Sparkles className="size-3" />
            Property Analysis
          </div>
          <h2 className="font-poppins font-bold text-xl text-slate-900">
            Loading analysis
          </h2>
          <p className="text-xs text-slate-500 font-poppins max-w-[28ch]">
            Pulling property details, market data, and comps…
          </p>
        </div>

        {/* Steps */}
        <ul className="w-full flex flex-col gap-1">
          {STEPS.map((step, i) => {
            const state: 'done' | 'active' | 'pending' =
              i < stage ? 'done' : i === stage ? 'active' : 'pending';
            return <StepRow key={step.key} label={step.label} state={state} />;
          })}
        </ul>
      </div>
    </div>
  );
};

const StepRow = ({
  label,
  state
}: {
  label: string;
  state: 'pending' | 'active' | 'done';
}) => {
  const Icon: LucideIcon =
    state === 'done' ? CheckCircle2 : state === 'active' ? Loader2 : Circle;
  return (
    <li
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors duration-300',
        state === 'done' && 'bg-emerald-50/60',
        state === 'active' && 'bg-violet-50/60',
        state === 'pending' && 'opacity-60'
      )}
    >
      <Icon
        className={cn(
          'size-4 shrink-0',
          state === 'done' && 'text-emerald-500 animate-in zoom-in-50 fade-in',
          state === 'active' && 'text-violet-500 animate-spin',
          state === 'pending' && 'text-slate-300'
        )}
      />
      <span
        className={cn(
          'text-xs font-poppins',
          state === 'done' && 'text-emerald-700 font-medium',
          state === 'active' && 'text-violet-700 font-medium',
          state === 'pending' && 'text-slate-500'
        )}
      >
        {label}
      </span>
    </li>
  );
};

export default memo(SkeletonSection);
