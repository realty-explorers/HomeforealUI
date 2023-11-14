/* eslint-disable react/jsx-no-undef */
import ThemedButton from "@/components/Buttons/ThemedButton";
import clsx from "clsx";
import styles from "./LandingPage.module.scss";
import PropertiesExample from "./PropertiesExample";
import { TypeAnimation } from "react-type-animation";
import Link from "next/link";
import { Typography } from "@mui/material";

const HeroSection = () => {
  return (
    <div className="max-w-[100%] mt-10">
      <div className="flex wrap gap-0 justify-center">
        <div className="flex flex-col justify-center w-[60rem] xl:w-[35rem]">
          <div className="flex w-full  items-center gap-2">
            <Typography className={styles.header_1}>
              find untapped
              <div className={styles.ball}>
              </div>
              <br /> Investments
            </Typography>
          </div>
          {/* <div className="flex w-full"> */}
          {/*   <Typography className={styles.header_1}> */}
          {/*     Investments */}
          {/*   </Typography> */}
          {/* </div> */}

          <div className="flex mt-8">
            <Typography className={styles.header_2}>
              {/* Home for real is a platform that helps leading real estate agents */}
              {/* find, match and analyze real estate. unlock hidden real estate */}
              {/* opportunists */}
              Discover Real Estate Opportunities with HomeForReal. <br />
              HomeForReal is a platform <br /> for{"  "}
              <TypeAnimation
                sequence={[
                  "Finding hidden Gems", // Types 'One'
                  2000, // Waits 1s
                  "Matching with Precision", // Deletes 'One' and types 'Two'
                  2000, // Waits 2s
                  "Analyzing with Insight", // Types 'Three' without deleting 'Two'
                  2000, // Waits 2s
                  "Unlocking Opportunities", // Types 'Three' without deleting 'Two'
                  2000, // Waits 2s
                  () => {
                    console.log("Sequence completed");
                  },
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="text-[2rem] underline text-primary"
              />
            </Typography>
          </div>
          <div className="flex items-center mt-8">
            <a
              href="#contactUs"
              className="rounded-3xl font-poppins capitalize bg-white text-black font-bold px-4 py-2 text-lg shadow hover:ring transition-all"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contactUs").scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {/* <ThemedButton text="Chat With Us" /> */}
              Chat With Us
            </a>
            {/* <div className={`${styles.findOpportunitiesDiv}`}> */}
            <div>
              <div>
                <Link
                  className={clsx([
                    // styles.cardInfoValue,
                    "text-white bg-black px-4 py-2 rounded-3xl font-poppins font-bold capitalize mx-4 text-lg hover:ring transition-all no-underline",
                  ])}
                  href="/dashboards/real-estate"
                >
                  Get Started
                </Link>
              </div>
              {/* <div className="flex items-center"> */}
              {/*   <svg */}
              {/*     width="34" */}
              {/*     height="9" */}
              {/*     viewBox="0 0 34 9" */}
              {/*     fill="none" */}
              {/*     xmlns="http://www.w3.org/2000/svg" */}
              {/*   > */}
              {/*     <path */}
              {/*       d="M33.3536 4.85355C33.5488 4.65829 33.5488 4.34171 33.3536 4.14645L30.1716 0.964466C29.9763 0.769204 29.6597 0.769204 29.4645 0.964466C29.2692 1.15973 29.2692 1.47631 29.4645 1.67157L32.2929 4.5L29.4645 7.32843C29.2692 7.52369 29.2692 7.84027 29.4645 8.03553C29.6597 8.2308 29.9763 8.2308 30.1716 8.03553L33.3536 4.85355ZM0 5H33V4H0V5Z" */}
              {/*       fill="black" */}
              {/*     /> */}
              {/*   </svg> */}
              {/* </div> */}
            </div>
          </div>
        </div>
        <div className="flex grow max-w-[50%] pl-16">
          <PropertiesExample />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
