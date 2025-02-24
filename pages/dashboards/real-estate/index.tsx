import { Suspense, useEffect, useRef, useState } from 'react';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import SidebarLayout from '@/layouts/SidebarLayout';
import { CircularProgress, IconButton } from '@mui/material';
import Map from '@/content/Dashboards/RealEstate/Map';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import {
  selectProperties,
  setSelectedProperty,
  setSelectedPropertyPreview,
  setSelectedRentalComps
} from '@/store/slices/propertiesSlice';
import styles from './RealEstate.module.scss';
import { CompData, FilteredComp } from '@/models/analyzedProperty';
import { motion, Variants } from 'framer-motion';
import { propertiesApiEndpoints } from '@/store/services/propertiesApiService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SkeletonSection from '@/content/Dashboards/RealEstate/MoreDetails/SkeletonSection';
import MoreDetails from '@/content/Dashboards/RealEstate/MoreDetails/MoreDetails';
import dynamic from 'next/dynamic';
import Joyride from 'react-joyride';
import { selectMap } from '@/store/slices/mapSlice';
import { map } from 'lodash';
import PageTourModal from '@/components/JoyRide/ToolTips/PageTourModal';
import { ACTIONS, EVENTS } from 'react-joyride';
import { selectLocation } from '@/store/slices/locationSlice';
import MakeOfferButton from '@/content/Dashboards/Analytics/Offer/MakeOfferButton';
import OfferDialog from '@/content/Dashboards/Analytics/Offer/OfferDialog';
import IntroDialog from '@/components/Modals/Intro/IntroDialog';
import {
  selectAuth,
  setShowVerificationDialog,
  setVerificationStep
} from '@/store/slices/authSlice';

// import { useSession, SessionProvider, signIn } from 'next-auth/react';

const JoyRideNoSSR = dynamic(() => import('react-joyride'), { ssr: false });

const steps = [
  {
    target: '#search-bar',
    content:
      'Search for a location to get started. Search by zip code, neighborhood or city. Currently, we only support Alabama and Florida.',
    locale: { skip: <strong aria-label="skip">SKIP</strong> },
    disableBeacon: true,
    styles: {
      spotlight: {
        borderRadius: '3rem',
        padding: 0,
        margin: 0
      }
    }
  },

  {
    target: '#buybox_combobox',
    content:
      'Select a buy box to get started. You can create a new buy box by visiting the buy box page.',
    locale: { skip: <strong aria-label="skip">SKIP</strong> },
    disableBeacon: true,
    styles: {
      spotlight: {
        borderRadius: '1rem',
        padding: 0,
        margin: 0
      }
    }
  },

  {
    target: '#strategy_toggle',
    content: 'Select an investment strategy',
    locale: { skip: <strong aria-label="skip">SKIP</strong> },
    disableBeacon: true,
    styles: {
      spotlight: {
        borderRadius: '1rem',
        padding: 0,
        margin: 0
      }
    }
  },

  {
    target: '#filters',
    content: 'Apply filters to narrow down your search.',
    locale: { skip: <strong aria-label="skip">SKIP</strong> },
    disableBeacon: true,
    styles: {
      spotlight: {
        borderRadius: '1rem',
        padding: 0,
        margin: 0
      }
    }
  },

  {
    target: '#buybox-page',
    content: 'Build new buyboxes',
    locale: { skip: <strong aria-label="skip">SKIP</strong> },
    disableBeacon: true,
    styles: {
      spotlight: {
        borderRadius: '1rem'
      }
    }
  }
];

const DashboardRealEstate = (props: any) => {
  // const session = useSession();

  const [tour, setTour] = useState(false);
  const dispatch = useDispatch();
  const {
    selectedProperty,
    selectedComps,
    selectedPropertyPreview,
    selectedRentalComps,
    selecting
  } = useSelector(selectProperties);
  const { verificationStep, showVerificationDialog } = useSelector(selectAuth);
  const [showGuide, setShowGuide] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [step2ready, setStep2Ready] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);

  const { suggestion } = useSelector(selectLocation);
  const openMoreDetails = selectedPropertyPreview;

  const selectedPropertyState =
    propertiesApiEndpoints.getProperty.useQueryState(
      selectedPropertyPreview?.source_id
    );

  const handleSelectRentalComps = (compsProperties: FilteredComp[]) => {
    dispatch(setSelectedRentalComps(compsProperties));
  };

  const handleHidePanel = () => {
    dispatch(setSelectedPropertyPreview(null));
    dispatch(setSelectedProperty(null));
  };

  const { mapLoading } = useSelector(selectMap);

  useEffect(() => {
    const tourDelay = setTimeout(() => {
      setShowGuide(true);
    }, 1000);
    return () => clearTimeout(tourDelay);
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const tourValue = localStorage.getItem('tour');
      if (!tourValue) {
        localStorage.setItem('tour', 'true');
      }
      if (!tourValue || tourValue === 'true') {
        setTour(true);
      } else {
        setTour(false);
      }
    }
  }, []);

  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

  return (
    <div className="flex w-full h-full relative overflow-hidden" id="map">
      <JoyRideNoSSR
        tooltipComponent={(props) => <PageTourModal {...props} />}
        steps={steps}
        continuous
        showProgress={true}
        showSkipButton={true}
        // run={!mapLoading && tour && showGuide && windowWidth > 768}
        run={false}
        callback={(data) => {
          const { status, index, type, action } = data;
          // console.log(
          //   `Step ${index}, ${status} ${type}, ${stepIndex}, ${action}, ${typeof status}`,
          // );
          if (
            index > 0 &&
            type === EVENTS.STEP_AFTER &&
            action === ACTIONS.NEXT
          ) {
            setStepIndex(index + 1);
          }
          if (stepIndex === 0 && step2ready) {
            setStepIndex(1);
          } else if (index === 0 && type === 'step:after') {
            if (suggestion) {
              setStep2Ready(true);
            }
            setStepIndex(1);
          } else if (index === 1 && type === 'error:target_not_found') {
            setShowGuide(false);
            setStepIndex(1);
            if (!suggestion) {
              setTimeout(() => {
                setShowGuide(true);
                setStepIndex(1);
              }, 1000);
            }
          }
        }}
        styles={{
          options: {
            // arrowColor: "#eee",
            backgroundColor: '#eee',
            primaryColor: '#000',
            textColor: '#000'
          }
        }}
        stepIndex={stepIndex}
      />
      {openMoreDetails && (
        <>
          <IconButton
            className="absolute top-1/2 left-full md:left-1/2 -translate-y-full -translate-x-full md:-translate-x-1/2 bg-white w-1 h-10 shadow z-[2] animate-fadeDelayed opacity-100 "
            onClick={handleHidePanel}
          >
            <ExpandMoreIcon
              className={clsx([
                'transition-all ',
                openMoreDetails ? 'rotate-90' : '-rotate-90'
              ])}
            />
          </IconButton>

          <MakeOfferButton onClick={() => setShowOfferDialog(true)} />

          {/* <MakeOfferButton onClick={() => setShowOfferDialog(true)} /> */}
          <motion.div
            initial={{
              translateX: '-100%'
            }}
            animate={{ translateX: '0' }}
            transition={{
              duration: 0.8,
              ease: [0, 0.71, 0.2, 1.01]
            }}
            className={clsx([
              styles.moreDetailsPanel,
              'w-full md:w-1/2 overflow-y-auto absolute h-full bg-off-white z-[1]'
            ])}
          >
            {selectedPropertyState.isFetching || selecting ? (
              <SkeletonSection />
            ) : (
              <div
                className={clsx([
                  'duration-500 transition-opacity animate-fade relative'
                ])}
              >
                <MoreDetails
                  selectedProperty={selectedProperty}
                  selectedComps={selectedComps}
                  selectedRentalComps={selectedRentalComps}
                  setSelectedRentalComps={handleSelectRentalComps}
                />
              </div>
            )}
          </motion.div>
        </>
      )}

      <div
        className={clsx([
          'h-full absolute left-0 md:left-1/2 bg-white transition-transform duration-500 overflow-hidden',
          openMoreDetails
            ? 'w-full md:w-1/2 translate-x-0 md:translate-x-0'
            : 'w-full  translate-x-0 md:-translate-x-1/2'
        ])}
      >
        <Map />
      </div>
      <OfferDialog show={showOfferDialog} setShow={setShowOfferDialog} />
      <IntroDialog
        open={showVerificationDialog}
        setOpen={(open) => dispatch(setShowVerificationDialog(open))}
        step={verificationStep}
        setStep={(step: number) => dispatch(setVerificationStep(step))}
      />
    </div>
  );
};

DashboardRealEstate.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

// export default withPageAuthRequired(DashboardRealEstate, { returnTo: '' });
export default DashboardRealEstate;
// export const getServerSideProps = withPageAuthRequired();
