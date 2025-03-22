import { useAppDispatch } from '@/store/hooks';
import { setShowVerificationDialog } from '@/store/slices/authSlice';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { Button, Typography } from '@mui/material';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

type MakeOfferButtonProps = {
  onClick: () => void;
};
const MakeOfferButton = (props: MakeOfferButtonProps) => {
  const searchParams = useSearchParams();
  const referral = searchParams.get('referral');
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const hanldeOfferClick = () => {
    if (!session?.user?.verified) {
      dispatch(setShowVerificationDialog(true));
    } else {
      props.onClick();
    }
  };
  return (
    <Button
      onClick={hanldeOfferClick}
      className={clsx([
        'p-[3px] rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 group absolute bottom-2 left-3 z-10 animate-fadeDelayed opacity-0 ',
        referral === 'projo' && 'w-[calc(100%-1rem)] xs:w-auto'
      ])}
    >
      <div className="px-2 py-1 rounded-full bg-white flex flex-row-reverse justify-center items-center gap-x-1 group-hover:bg-opacity-5 transition w-full">
        <Typography className="text-black font-semibold ">
          Make Offer
        </Typography>
        <RequestQuoteIcon className="text-black" />
      </div>
    </Button>
  );
};
export default MakeOfferButton;
