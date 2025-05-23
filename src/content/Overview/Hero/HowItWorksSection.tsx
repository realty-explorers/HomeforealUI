/* eslint-disable react/no-unknown-property */
import { Typography } from "@mui/material";
import styles from "./LandingPage.module.scss";
import dataProtectionImg from '@/public/static/images/placeholders/covers/Secure-data-protection.svg'
import whyUsPhoto from '@/public/static/images/placeholders/covers/whyUsPhoto.svg'
import whyUsRectangle from '@/public/static/images/placeholders/covers/whyUsRectangle.svg'
import closeMoreDealsArrow from '@/public/static/images/icons/closeMoreDealsArrow.svg'
import dailyDealsArrow from '@/public/static/images/icons/dailyDealsArrow.svg'
import defineCriteriaArrow from '@/public/static/images/icons/defineCriteriaArrow.svg'
import ThemedButtonLg from "@/components/Buttons/ThemedButtonLg";

const meow = () => {
  const a = 3;
};

const markerIcon = (
  <svg
    width="69"
    height="107"
    viewBox="0 0 69 107"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <rect x="0.5" width="68" height="107" fill="url(#pattern0)" />
    <defs>
      <pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0_630_3747"
          transform="matrix(0.00174837 0 0 0.00111111 0.069902 0)"
        />
      </pattern>
      <image
        id="image0_630_3747"
        width="492"
        height="900"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

const HowItWorksSection = () => {
  return (
    <div className="ml-20 mr-10  mt-20 grid grid-cols-[1.5fr_1fr] gap-14">
      <div className=" col-start-2 flex justify-center items-center flex-col">
        <Typography className={styles.howItWorksTitle}>
          How it works.
        </Typography>
        <Typography className={styles.howItWorksDescription}>
          Increase closing rate{" "}
          <span className="text-purple-500">up to 10x</span>
        </Typography>
      </div>
      <div className="mt-10">
        <img src="/static/images/placeholders/covers/searchPage.png" className="w-[42rem] h-[28rem]" />
      </div>
      <div className="ml-10 mb-16 p-8 w-[25rem] h-[30rem] rounded bg-[#F8F0D399] flex flex-col justify-center items-center">
        {markerIcon}
        <div className="mt-10">
          <Typography className={styles.yellowCardTitle}>
            Define Criteria
          </Typography>
          <Typography className={styles.yellowCardDescription}>
            Find investments that match your client's criteria with our advanced
            patented screener.
          </Typography>
        </div>
      </div>
      <img style={{
        position: 'absolute',
        top: '136em',
        height: '8rem',
        width: '45rem',
        left: '29rem'
      }} src={defineCriteriaArrow} />
      <div className="mt-20 pt-12 flex justify-end">
        <img src="/static/images/placeholders/covers/buyboxPage.png" className="w-[37rem] h-[22rem]" />
      </div>
      <div className="ml-10 mb-10 p-8 w-[25rem] h-[30rem] rounded bg-[#F8F0D399] flex flex-col items-center justify-center">
        <img
          src="/static/images/placeholders/illustrations/phoneApp.png"
          width="130rem"
          height="130rem"
        />
        <div className="mt-10">
          <Typography className={styles.yellowCardTitle}>
            Get daily Deals
          </Typography>
          <Typography className={styles.yellowCardDescription}>
            Our system monitors the market 24/7 to match the right investments to your clients.
          </Typography>
        </div>
      </div>
      <img style={{
        position: 'absolute',
        top: '170em',
        height: '18%',
        width: '42%',
        left: '31%'
      }} src={dailyDealsArrow} />
      <div className="mt-28 m-4 p-8 w-[25rem] h-[32rem] rounded bg-[#F8F0D399] flex flex-col justify-center items-center">
        <img
          src={dataProtectionImg}
          width="150rem"
          height="150rem"
        />
        <Typography className={styles.yellowCardTitle}>
          Close more deals
        </Typography>
        <Typography className={styles.yellowCardDescription}>
          Amazing analysis that close more deals than ever before - increase your customer base and   deal closing rate.
        </Typography>
      </div>
      <img style={{
        position: 'absolute',
        top: '223em',
        height: '20%',
        width: '33%',
        left: '34%'
      }} src={closeMoreDealsArrow} />
      <div className="mt-20">
        <img className={styles.comp} src="/static/images/placeholders/covers/compPhoto2.png" width='320rem' />
        <img src="/static/images/placeholders/covers/compPhoto.png" />
      </div>
      <div className="my-12">
        <img src={whyUsPhoto} className="w-100 h-100" />
      </div>
      <div className=" flex flex-col my-12">
        <div className=" flex flex-row justify-end mr-10 h-[10%]">
          <img
            className="w-12 h-12"
            src="/static/images/placeholders/illustrations/ball.png"
          />
        </div>
        <div className="mt-8 h-[6%]">
          <img src={whyUsRectangle} />
        </div>
        <div className={`${styles.howItWorksTitle} h-[10%] mb-2`}>
          Why Us.
        </div>
        <div className="w-[85%] h-[55%]">
          <div className={styles.whyUsParagraphs}>
            <span className={styles.whyUsPoints}>Expert insights </span>
            - Our experienced team provides guidance you can trust.
          </div>
          <div className={styles.whyUsParagraphs}>
            <span className={styles.whyUsPoints}>Advanced technology </span>
            - Our patented platform finds the best investments 24/7.
          </div>
          <div className={styles.whyUsParagraphs}>
            <span className={styles.whyUsPoints}>Proven results </span>
            - We help increase deal flow and customer acquisition.
          </div>
        </div>
        <div className=" mb-2 h-[10%] flex items-end">
          <a href="#contactUs">
            <ThemedButtonLg text="Chat With Us" />
          </a>
        </div>
      </div>
    </div>

  );
};

export default HowItWorksSection;
