/* eslint-disable react/jsx-no-undef */
import ThemedButton from "@/components/Buttons/ThemedButton";
import clsx from "clsx";
import styles from "./LandingPage.module.scss";
import PropertiesExample from "./PropertiesExample";
import { TypeAnimation } from "react-type-animation";
import Link from "next/link";
import { Button, Typography } from "@mui/material";

const HeroSection = () => {
  return (
    // <div className="max-w-[100%] h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 ">
    <div className="max-w-[100%] h-full bg-[url('https://miro.medium.com/v2/resize:fit:10000/1*PK-uDYbGaV4WNtGCIZjOyQ.jpeg')] bg-cover bg-center lg:bg-none">
      <div className="flex justify-center h-full backdrop-brightness-50 lg:backdrop-brightness-100 lg:px-8">
        <div className="flex flex-col h-[100dvh] lg:pt-32 justify-center lg:justify-start pb-20 lg:pb-0 lg:items-center lg:px-16 lg:gap-y-8">
          <div className="flex w-full items-center ">
            <Typography
              className={clsx([
                "font-playfair text-[3rem] lg:text-[3.5rem] capitalize font-bold w-full  lg:text-left mb-4 text-white lg:text-black text-center",
              ])}
            >
              find untapped
              <div className={clsx([styles.ball, "hidden lg:inline-flex"])}>
              </div>
              <br /> Investments
            </Typography>
          </div>

          <div className="flex px-4 ">
            <Typography className="font-poppins font-semibold lg:font-normal text-[1.5rem] lg:text-[2rem] text-white lg:text-black text-center lg:text-left">
              Discover Real Estate Opportunities with Homeforeal.{" "}
              <br />Let us do the work for you.<br />
              <TypeAnimation
                sequence={[
                  "Customize your deals", // Types 'One'
                  2000, // Waits 1s
                  "Save time", // Deletes 'One' and types 'Two'
                  2000, // Waits 2s
                  "Analyze with Insight", // Types 'Three' without deleting 'Two'
                  2000, // Waits 2s
                  "Unlock Opportunities", // Types 'Three' without deleting 'Two'
                  2000, // Waits 2s
                  () => {
                    console.log("Sequence completed");
                  },
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="text-[1.5rem] lg:text-[2rem] underline text-secondary "
              />
            </Typography>
          </div>
          <div className="flex justify-center lg:justify-start absolute left-0 w-full bottom-8 lg:static">
            <Button
              href="#contactUs"
              className="rounded-3xl font-poppins capitalize bg-white text-black font-bold px-4 py-2 text-lg shadow hover:ring transition-all hidden lg:flex"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contactUs").scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Chat With Us
            </Button>
            <Button
              className={clsx([
                // styles.cardInfoValue,
                "text-white bg-secondary lg:bg-black lg:hover:bg-black px-4 py-2 rounded-3xl font-poppins font-bold capitalize mx-4 text-lg hover:ring transition-all no-underline w-full lg:w-auto",
              ])}
              href="/dashboards/real-estate"
            >
              Get Started
            </Button>
          </div>
        </div>
        <div className="hidden lg:flex  max-w-[50%] h-full items-center">
          <div className="flex h-3/4">
            <PropertiesExample />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
