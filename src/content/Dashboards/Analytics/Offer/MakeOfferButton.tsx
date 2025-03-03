import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { Button, Typography } from '@mui/material';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

type MakeOfferButtonProps = {
  onClick: () => void;
};
const MakeOfferButton = (props: MakeOfferButtonProps) => {
  const searchParams = useSearchParams();
  const referral = searchParams.get('referral');
  return (
    <Button
      onClick={props.onClick}
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
