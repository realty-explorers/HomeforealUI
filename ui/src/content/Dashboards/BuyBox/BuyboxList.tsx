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

const StyledAccordion = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({}) => ({
  // border: `1px solid ${theme.palette.divider}`,
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

type BuyboxListProps = {
  editBuyBox: (buybox: BuyBox) => void;
};

const BuyboxList = (props: BuyboxListProps) => {
  // const {data , isFetching } = useGetBuyBoxesIdsQuery(1);
  const [getBuyBoxes, state] = useLazyGetBuyBoxesQuery();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getBuyBoxesData = async () => {
      try {
        const data = await getBuyBoxes("1").unwrap();
      } catch (error) {
        enqueueSnackbar(`${error.error}`, {
          variant: "error",
        });
      }
    };
    getBuyBoxesData();
  }, [state.data]);

  return (
    <Grid container>
      <Card sx={{ width: "100%" }}>
        <CardContent>
          {state.isFetching
            ? (
              <div className="w-full flex justify-center">
                <Image
                  src={"/static/images/placeholders/searchingAnimation.gif"}
                  alt="loading"
                  width="150"
                  height="150"
                  className=""
                />
              </div>
            )
            : (
              <>
                {(state.data as BuyBox[])?.map((buybox, index) => (
                  <BuyboxItem
                    key={index}
                    buybox={buybox}
                    editBuyBox={props.editBuyBox}
                  />
                ))}
                <StyledAccordion sx={{ width: "100%" }}>
                  <StyledAccordionSummary expandIcon={<AddCircleOutlineIcon />}>
                    <Button onClick={() => props.editBuyBox({} as BuyBox)}>
                      <Typography>New Buybox</Typography>
                    </Button>
                  </StyledAccordionSummary>
                </StyledAccordion>
              </>
            )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default BuyboxList;
