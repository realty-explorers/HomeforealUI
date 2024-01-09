/* eslint-disable react/jsx-no-undef */
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import SearchSection from "./SearchSection/SearchSection";
import LearnMoreSection from "./LearnMoreSection/LearnMoreSection";
import TestimonialsComponent from "./Testimonials/TestimonialsComponent";
import ContactUsComponent from "./ContactUs/ContactUsComponent";
import Footer from "./Footer";
import { Typography } from "@mui/material";
import Image from "next/image";

function Hero() {
  return (
    <div className="flex flex-col items-center h-full w-full bg-off-white">
      <div className="lg:flex flex-col justify-center items-center bg-off-white h-full w-full">
        <HeroSection />
        {/* <SearchSection /> */}
        {/* <HowItWorksSection /> */}
        {/* <LearnMoreSection /> */}
        {/* <TestimonialsComponent /> */}
      </div>
      <div className="hidden lg:block">
        <ContactUsComponent />
        <Footer />
      </div>
      {/* <div className="flex lg:hidden justify-center items-center w-full h-full relative"> */}
      {/*   <div className="absolute bottom-0 h-[70%] w-full"> */}
      {/*     <Image */}
      {/*       src="/static/images/placeholders/covers/house_bg.jpg" */}
      {/*       alt="house" */}
      {/*       fill */}
      {/*       className="object-cover object-center w-full h-full" */}
      {/*     /> */}
      {/*   </div> */}
      {/**/}
      {/*   <div className="flex flex-wrap w-[40%] z-[1]"> */}
      {/*     <div className="flex w-full justify-between items-center gap-2"> */}
      {/*       <Typography className=""> */}
      {/*         find untapped */}
      {/*       </Typography> */}
      {/*       <img */}
      {/*         className="w-12 h-12" */}
      {/*         src="/static/images/placeholders/illustrations/ball.png" */}
      {/*       /> */}
      {/*     </div> */}
      {/*     <div className="flex w-full"> */}
      {/*       <Typography className=""> */}
      {/*         Investments */}
      {/*       </Typography> */}
      {/*     </div> */}
      {/**/}
      {/*     <div className="flex mt-8"> */}
      {/*       <Typography className=""> */}
      {/*         Home for real is a platform that helps leading real estate agents */}
      {/*         find, match and analyze real estate. unlock hidden real estate */}
      {/*         opportunists */}
      {/*       </Typography> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}
    </div>
  );
}

export default Hero;
