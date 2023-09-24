/* eslint-disable react/jsx-no-undef */
import ThemedButton from "@/components/Buttons/ThemedButton";
import { Typography } from "@mui/material";
import clsx from "clsx";
import styles from "./LandingPage.module.scss";
import PropertiesExample from "./PropertiesExample";

const HeroSection = () => {
  return (
    <div className="max-w-[70%] ">
      <div className="flex wrap gap-8">
        <div className="flex flex-wrap w-[40%] ">
          <div className="flex w-full justify-between items-center gap-2">
            <Typography className={styles.header_1}>
              find untapped
            </Typography>
            <img
              className="w-12 h-12"
              src="/static/images/placeholders/illustrations/ball.png"
            />
          </div>
          <div className="flex w-full">
            <Typography className={styles.header_1}>
              Investments
            </Typography>
          </div>

          <div className="flex mt-8">
            <Typography className={styles.header_2}>
              Home for real is a platform that helps leading real estate agents
              find, match and analyze real estate. unlock hidden real estate
              opportunists
            </Typography>
          </div>
        </div>
        <div className="flex w-[60%] ">
          <PropertiesExample />
        </div>
      </div>

      <div className="flex items-center mt-4">
        <ThemedButton text="Chat With Us" />
        <Typography className={clsx([styles.cardInfoValue, "ml-4 mr-4"])}>
          Find Opportunities Now
        </Typography>
        <div>
          <svg
            width="34"
            height="9"
            viewBox="0 0 34 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.3536 4.85355C33.5488 4.65829 33.5488 4.34171 33.3536 4.14645L30.1716 0.964466C29.9763 0.769204 29.6597 0.769204 29.4645 0.964466C29.2692 1.15973 29.2692 1.47631 29.4645 1.67157L32.2929 4.5L29.4645 7.32843C29.2692 7.52369 29.2692 7.84027 29.4645 8.03553C29.6597 8.2308 29.9763 8.2308 30.1716 8.03553L33.3536 4.85355ZM0 5H33V4H0V5Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
