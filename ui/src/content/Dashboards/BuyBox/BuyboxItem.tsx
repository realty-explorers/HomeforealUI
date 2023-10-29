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

type BuyboxItemProps = {
  buybox: BuyBox;
  editBuyBox: (buybox: BuyBox) => void;
  // setOpenBuyBoxes: (buyboxState: {buybox_id: string, page: number}) => void;
};

const BuyboxItem = (props: BuyboxItemProps) => {
  const dispatch = useDispatch();
  const { buyboxes } = useSelector(selectBuyBoxes);

  const expanded = buyboxes[props.buybox.id]?.open === true;

  const handleEditBuyBox = (e) => {
    e.stopPropagation();
    props.editBuyBox(props.buybox);
  };

  const allowedToEdit = props.buybox.permissions.includes("edit");

  const handleClick = () => {
    if (expanded) {
      dispatch(setBuyBoxOpen({ buybox_id: props.buybox.id, open: false }));
      return;
    }
    dispatch(setBuyBoxOpen({ buybox_id: props.buybox.id, open: true }));
  };

  const setPage = (page: number) => {
    dispatch(setBuyBoxPage({ buybox_id: props.buybox.id, page: page }));
  };

  const setPageSize = (pageSize: number) => {
    dispatch(
      setBuyBoxPageSize({ buybox_id: props.buybox.id, pageSize: pageSize }),
    );
  };

  return (
    <>
      <StyledAccordion expanded={expanded} onChange={handleClick}>
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
              className="bg-[#9747FF] hover:bg-[#5500c4] text-[#FFFDFD] rounded-lg p-2 font-poppins font-semibold  "
              onClick={handleEditBuyBox}
            >
              {allowedToEdit ? "Edit" : "View"} BuyBox
            </Button>
          </div>
        </StyledAccordionSummary>
        <AccordionDetails>
          <BuyBoxLeads
            buybox={props.buybox}
            open={expanded}
            page={buyboxes[props.buybox.id]?.page || 0}
            pageSize={buyboxes[props.buybox.id]?.pageSize || 5}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        </AccordionDetails>
      </StyledAccordion>
      {/* <DataGrid */}
      {/*   sx={{ */}
      {/*     "*": { */}
      {/*       ".MuiDataGrid-cell": { */}
      {/*         outline: "none", */}
      {/*         "&:focus": { */}
      {/*           outline: "none", */}
      {/*         }, */}
      {/*         "&:focus-within": { */}
      {/*           outline: "none", */}
      {/*         }, */}
      {/*       }, */}
      {/*     }, */}
      {/*   }} */}
      {/*   rows={rows} */}
      {/*   columns={columns} */}
      {/*   rowHeight={100} */}
      {/*   initialState={{ */}
      {/*     pagination: { */}
      {/*       paginationModel: { */}
      {/*         pageSize: 5, */}
      {/*       }, */}
      {/*     }, */}
      {/*   }} */}
      {/*   pageSizeOptions={[5]} */}
      {/*   checkboxSelection */}
      {/*   disableRowSelectionOnClick */}
      {/* /> */}
    </>
  );
};

export default BuyboxItem;
