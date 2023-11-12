"use client";

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
  styled,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BuyboxItem from "./BuyboxItem";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import { useGetSummaryQuery } from "@/store/services/analysisApi";
import {
  useGetBuyBoxesQuery,
  useLazyGetBuyBoxesQuery,
} from "@/store/services/buyboxApiService";
import BuyBox from "@/models/buybox";
import { useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import Image from "next/image";
import { useSnackbar, VariantType } from "notistack";
import { motion, Variants } from "framer-motion";
import Lottie from "lottie-react";
import searchingDocumentsAnimation from "@/static/animations/loading/searchingDocumentsAnimation.json";
import { useRouter } from "next/router";

const StyledAccordion = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({}) => ({
  // border: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <AccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  borderRadius: 0,
  backgroundColor: theme.palette.mode === "dark" ? "#2d3748" : "#f5f5f5",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));
const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const defaultBuyBox = {
  id: "",
  name: "",
  data: {},
  permissions: ["view", "edit"],
};

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const containerVariants: Variants = {
  open: {
    display: "block",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.05,
    },
  },
  closed: {
    display: "none",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

const LoadingImage = () => {
  return (
    <div className="absolute left-1/2 top-0 -translate-x-1/2">
      <Lottie animationData={searchingDocumentsAnimation} className="w-80" />
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
  // const {data , isFetching } = useGetBuyBoxesIdsQuery(1);
  const [getBuyBoxes, state] = useLazyGetBuyBoxesQuery();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getBuyBoxesData = async () => {
      try {
        const data = await getBuyBoxes("", true).unwrap();
      } catch (error) {
        if (error.status === "FETCH_ERROR") {
          enqueueSnackbar(`Connection failed, try again later`, {
            variant: "error",
          });
        } else {
          enqueueSnackbar(`${error.error}`, {
            variant: "error",
          });
        }
      }
    };
    getBuyBoxesData();
  }, [state.data]);

  return (
    <div className="flex w-full h-full">
      <div className="relative w-full bg-white m-4 rounded-lg">
        {state.isFetching && <LoadingImage />}
        <motion.div
          initial={false}
          animate={!state.isFetching ? "open" : "closed"}
          className="w-full"
        >
          <motion.div
            variants={containerVariants}
          >
            {(state.data as BuyBox[])?.map((buybox, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <BuyboxItem
                  key={index}
                  buybox={buybox}
                  editBuyBox={props.editBuyBox}
                  // setOpenBuyBoxes={setOpenBuyBoxes}
                />
              </motion.div>
            ))}

            <motion.div variants={itemVariants}>
              <StyledAccordion sx={{ width: "100%" }}>
                <StyledAccordionSummary
                  expandIcon={<AddCircleOutlineIcon />}
                >
                  <Button
                    onClick={() => props.editBuyBox()}
                  >
                    <Typography>New Buybox</Typography>
                  </Button>
                </StyledAccordionSummary>
              </StyledAccordion>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyboxList;
