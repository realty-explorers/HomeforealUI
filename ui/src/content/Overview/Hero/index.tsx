/* eslint-disable react/jsx-no-undef */
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import SearchSection from "./SearchSection/SearchSection";
import LearnMoreSection from "./LearnMoreSection/LearnMoreSection";
import TestimonialsComponent from "./Testimonials/TestimonialsComponent";
import ContactUsComponent from "./ContactUs/ContactUsComponent";
import Footer from "./Footer";

function Hero() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <SearchSection />
      <HowItWorksSection />
      <LearnMoreSection />
      <TestimonialsComponent />
      <ContactUsComponent />
      <Footer />
    </div>
  );
}

export default Hero;
