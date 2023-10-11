import { Typography } from "@mui/material";
import clsx from "clsx";
import styles from "./LandingPage.module.scss";

const PropertiesExample = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full">
      <div className="col-span-2 xl:col-span-1 row-span-2 relative flex justify-center">
        <img
          src="/static/images/placeholders/covers/homepageCard1.png"
          className="w-full h-full"
        />
        <div className="bg-white opacity-90 rounded w-[80%] h-14 absolute bottom-8 flex justify-between items-center pr-20 pl-20">
          <Typography
            className={clsx([styles.cardInfoLabel])}
          >
            ARV:
          </Typography>
          <Typography
            className={clsx([styles.cardInfoValue])}
          >
            $295,000
          </Typography>
        </div>
      </div>
      <div className="hidden xl:flex relative justify-center">
        <img
          src="/static/images/placeholders/covers/homepageCard2.png"
          className="w-full h-full"
        />
        <div className="bg-white opacity-90 rounded w-[80%] h-14 absolute bottom-8 flex justify-around items-center">
          <Typography
            className={clsx([styles.cardInfoLabel])}
          >
            ADU opportunity:
          </Typography>
          <Typography
            className={clsx([styles.cardInfoSpecialValue])}
          >
            +$2500/m
          </Typography>
        </div>
      </div>
      <div className="hidden xl:flex relative justify-center">
        <img
          src="/static/images/placeholders/covers/homepageCard3.png"
          className="w-full h-full"
        />
        <div className="bg-white opacity-90 rounded w-[80%] h-14 absolute bottom-8 flex justify-around items-center">
          <Typography
            className={clsx([styles.cardInfoLabel])}
          >
            Fix and Flip:
          </Typography>
          <Typography
            className={clsx([styles.cardInfoSpecialValue])}
          >
            $95K in 3 months
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default PropertiesExample;
