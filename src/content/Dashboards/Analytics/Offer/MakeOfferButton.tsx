import { useAppDispatch } from '@/store/hooks';
import { setShowVerificationDialog } from '@/store/slices/authSlice';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

type MakeOfferButtonProps = {
  onClick: () => void;
};

const MakeOfferButton = (props: MakeOfferButtonProps) => {
  const searchParams = useSearchParams();
  const referral = searchParams.get('referral');
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const handleOfferClick = () => {
    if (!session?.user?.verified) {
      dispatch(setShowVerificationDialog(true));
    } else {
      props.onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleOfferClick}
      className={cn(
        'group absolute bottom-2 left-3 z-10',
        'inline-flex items-center self-start w-auto h-auto',
        'rounded-full p-[3px]',
        'bg-gradient-to-r from-indigo-500 to-pink-500',
        // Cool entrance: slide up + fade + zoom
        'animate-in fade-in slide-in-from-bottom-6 zoom-in-90 duration-700 ease-out',
        'shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50',
        'transition-shadow',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2',
        referral === 'projo' && 'w-[calc(100%-1rem)] xs:w-auto'
      )}
    >
      <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-1.5 transition-colors group-hover:bg-white/5">
        <Receipt className="size-4 text-slate-900" />
        <span className="font-poppins text-sm font-semibold text-slate-900">
          Make Offer
        </span>
      </span>
    </button>
  );
};

export default MakeOfferButton;
