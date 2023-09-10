/* eslint-disable react/jsx-no-undef */
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import SearchSection from "./SearchSection";

function Hero() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <SearchSection />
      <HowItWorksSection />
    </div>
  );
}

export default Hero;
