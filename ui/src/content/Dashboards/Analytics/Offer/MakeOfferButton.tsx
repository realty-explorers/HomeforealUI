import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { Button, Typography } from '@mui/material';

type MakeOfferButtonProps = {
  onClick: () => void;
};
const MakeOfferButton = (props: MakeOfferButtonProps) => {
  return (
    <Button
      onClick={props.onClick}
      className="p-[3px] rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 group sticky top-[calc(100%-3rem)] left-3 z-10"
    >
      <div className="px-2 py-1 rounded-full bg-white flex flex-row-reverse items-center gap-x-1 group-hover:bg-opacity-5 transition">
        <Typography className="text-black font-poppins font-semibold">
          Make Offer
        </Typography>
        <RequestQuoteIcon className="text-black" />
      </div>
    </Button>
  );
};
export default MakeOfferButton;
