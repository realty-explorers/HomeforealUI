'use client';

import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  AccordionSummaryProps,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  styled,
  Typography
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BuyboxItem from './BuyboxItem';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { useGetSummaryQuery } from "@/store/services/analysisApi";
import {
  useGetBuyBoxesQuery,
  useLazyGetBuyBoxesQuery
} from '@/store/services/buyboxApiService';
import BuyBox from '@/models/buybox';
import { lazy, useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import Image from 'next/image';
import { useSnackbar, VariantType } from 'notistack';
import { motion, Variants } from 'framer-motion';
import searchingDocumentsAnimation from '@/static/animations/loading/searchingDocumentsAnimation.json';
import { useRouter } from 'next/router';
import ThemedButton from '@/components/Buttons/ThemedButton';
import { useSearchParams } from 'next/navigation';

const StyledAccordion = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({}) => ({
  // border: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}));

const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <AccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  borderRadius: 0,
  backgroundColor: theme.palette.mode === 'dark' ? '#2d3748' : '#f5f5f5',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));
const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

const defaultBuyBox = {
  id: '',
  name: '',
  data: {},
  permissions: ['view', 'edit']
};

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
};

const containerVariants: Variants = {
  open: {
    // display: "block",
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.05
    }
  },
  closed: {
    // display: "none",
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.3
    }
  }
};

const LoadingImage = () => {
  const Lottie = lazy(() => import('lottie-react'));
  return (
    <div className="w-full p-4">
      {Array.from(Array(5).keys()).map((index) => (
        <div key={index}>
          <Skeleton
            variant="rounded"
            className="w-full h-16 mb-4"
            style={{ borderRadius: '2rem' }}
          />
        </div>
      ))}
      {/* <Lottie animationData={searchingDocumentsAnimation} className="w-80" /> */}
      {/* <Image */}
      {/*   src={"/static/images/placeholders/searchingAnimation.gif"} */}
      {/*   alt="loading" */}
      {/*   width={150} */}
      {/*   height={107} */}
      {/*   className="object-cover object-center" */}
      {/* /> */}
    </div>
  );
};

type BuyboxListProps = {
  editBuyBox: (buybox?: BuyBox) => void;
};

const BuyboxList = (props: BuyboxListProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyboxId = searchParams.get('buybox_id');
  const selectedPage = searchParams.get('page');
  const selectedPageSize = searchParams.get('pageSize');
  // const {data , isFetching } = useGetBuyBoxesIdsQuery(1);
  const [getBuyBoxes, state] = useLazyGetBuyBoxesQuery();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getBuyBoxesData = async () => {
      try {
        const data = await getBuyBoxes('', true).unwrap();
      } catch (error) {
        if (error.status === 'FETCH_ERROR') {
          enqueueSnackbar(`Connection failed, try again later`, {
            variant: 'error'
          });
        } else {
          enqueueSnackbar(`${error.error}`, {
            variant: 'error'
          });
        }
      }
    };
    getBuyBoxesData();
  }, [state.data]);

  const setBuyBoxId = (buyboxId: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: { buybox_id: buyboxId }
      },
      undefined,
      { shallow: true }
    );
  };

  const setPage = (page: number, pageSize: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: page, pageSize: pageSize }
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className="flex w-full h-full">
      <div className="relative w-full p-4 rounded-lg">
        {state.isFetching ? (
          <LoadingImage />
        ) : (
          <motion.div
            initial={'closed'}
            animate={state.data?.length > 0 ? 'open' : 'closed'}
            className="w-full"
          >
            <motion.div variants={containerVariants}>
              {(state.data as BuyBox[])?.map((buybox, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <BuyboxItem
                    key={index}
                    buybox={buybox}
                    editBuyBox={props.editBuyBox}
                    setBuyBoxId={setBuyBoxId}
                    setPage={setPage}
                    buyboxId={buyboxId}
                    page={selectedPage ? parseInt(selectedPage) : 0}
                    pageSize={selectedPageSize ? parseInt(selectedPageSize) : 5}
                    // setOpenBuyBoxes={setOpenBuyBoxes}
                  />
                </motion.div>
              ))}

              {/* <motion.div variants={itemVariants}> */}
              <ThemedButton onClick={() => props.editBuyBox()}>
                <AddCircleOutlineIcon className="mr-2" htmlColor="white" />
                <Typography className="text-white font-poppins">
                  New Buybox
                </Typography>
              </ThemedButton>
              {/* </motion.div> */}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BuyboxList;
