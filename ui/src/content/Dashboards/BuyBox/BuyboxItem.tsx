import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Image from "@/components/Photos/Image";
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  AccordionSummaryProps,
  Button,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import styles from "./BuyboxItem.module.scss";
import clsx from "clsx";
import BuyBox from "@/models/buybox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BuyBoxLeads from "./BuyBoxLeads";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBuyBoxes,
  setBuyBoxOpen,
  setBuyBoxPage,
  setBuyBoxPageSize,
} from "@/store/slices/buyBoxesSlice";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const StyledAccordion = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({}) => ({
  // border: `1px solid ${theme.palette.divider}`,
  borderRadius: "0px",
  backgroundColor: "transparent",
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
  borderRadius: "2rem",
  marginBottom: "1rem",
  backgroundColor: "white",
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({}));

type BuyboxItemProps = {
  buybox: BuyBox;
  editBuyBox: (buybox: BuyBox) => void;
  setBuyBoxId: (buybox_id: string) => void;
  setPage: (page: number, pageSize: number) => void;
  buyboxId: string;
  page: number;
  pageSize: number;
  // setOpenBuyBoxes: (buyboxState: {buybox_id: string, page: number}) => void;
};

const BuyboxItem = (props: BuyboxItemProps) => {
  const handleEditBuyBox = (e) => {
    e.stopPropagation();
    props.editBuyBox(props.buybox);
  };

  const allowedToEdit = props.buybox.permissions.includes("edit");

  const handleClick = () => {
    if (expanded) {
      props.setBuyBoxId("");
    } else {
      props.setBuyBoxId(props.buybox.id);
    }
  };

  const handleChangePagination = (page: number, pageSize: number) => {
    if (props.buyboxId === props.buybox.id) {
      props.setPage(page, pageSize);
    }
  };

  const expanded = props.buyboxId === props.buybox.id;

  return (
    <>
      <StyledAccordion
        expanded={expanded}
        onChange={handleClick}
      >
        <StyledAccordionSummary
          expandIcon={<ExpandMoreIcon className="-rotate-90" />}
          className="flex-row-reverse"
        >
          <div className="flex justify-between w-full">
            <Typography className="flex items-center">
              {props.buybox.data.buybox_name}
            </Typography>
            <Button
              startIcon={allowedToEdit
                ? <SettingsOutlinedIcon className="className" />
                : null}
              className="bg-[#9747FF] hover:bg-[#5500c4] text-[#FFFDFD] rounded-3xl p-2 px-4 font-poppins font-semibold  "
              onClick={handleEditBuyBox}
            >
              {allowedToEdit ? "Edit" : "View"} BuyBox
            </Button>
          </div>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <BuyBoxLeads
            buybox={props.buybox}
            open={expanded}
            setPage={handleChangePagination}
            page={props.page}
            pageSize={props.pageSize}
          />
        </StyledAccordionDetails>
      </StyledAccordion>
    </>
  );
};

export default BuyboxItem;
