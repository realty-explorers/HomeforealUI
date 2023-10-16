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
import { useGetLeadsQuery } from "@/store/services/analysisApi";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import BuyBox from "@/models/buybox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BuyBoxLeads from "./BuyBoxLeads";
import { useState } from "react";

const columns: GridColDef[] = [
  {
    field: "image",
    headerName: "",
    flex: 2,
    minWidth: 150,
    renderCell: (cellValues) => {
      return (
        <div className="flex flex-1 h-full grow items-center p-2 rounded-md">
          <div className="w-full h-full  flex align-center justify-center">
            <img
              src={cellValues.value}
              alt=""
              className="max-h-full aspect-video"
            />
          </div>
        </div>
      );
    },
  },
  {
    field: "address",
    headerName: "",
    flex: 1,
    minWidth: 100,
    renderCell: (cellValues) => {
      return <Typography className="text-center">{cellValues.value}
      </Typography>;
    },
  },
  { field: "opportunity", headerName: "Opportunity", flex: 1 },

  {
    field: "askingPrice",
    headerName: "Asking Price",
    flex: 1,
    minWidth: 100,
    editable: true,
  },
  {
    field: "ARV",
    headerName: "ARV",
    flex: 1,
    minWidth: 100,
    editable: true,
  },

  {
    field: "NOI",
    headerName: "NOI",
    flex: 1,
    minWidth: 100,
    editable: true,
  },

  {
    field: "capRate",
    headerName: "Cap Rate",
    flex: 1,
    minWidth: 100,
    editable: true,
  },
  {
    field: "zipCode",
    headerName: "Zip Code",
    flex: 1,
    minWidth: 100,
    editable: true,
  },
  {
    field: "note",
    headerName: "Note",
    flex: 1,
    minWidth: 100,
    editable: true,
  },
  {
    field: "action",
    headerName: "",
    flex: 1,
    minWidth: 120,
    renderCell: (cellValues) => {
      return (
        <div className="w-full h-full flex items-center justify-center m-2">
          <Button
            variant="contained"
            className={clsx([
              "bg-secondary",
              "hover:bg-secondary hover:opacity-80",
            ])}
          >
            <Typography className={clsx([styles.buttonText])}>
              Analysis
            </Typography>
          </Button>
        </div>
      );
    },
  },
];

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
};

const BuyboxItem = (props: BuyboxItemProps) => {
  // const { data, isFetching } = useGetLeadsQuery(
  //   props.data?.buybox_id || skipToken,
  // );

  const [expanded, setExpanded] = useState(false);

  const handleEditBuyBox = (e) => {
    e.stopPropagation();
    props.editBuyBox(props.buybox);
  };

  const allowedToEdit = props.buybox.permissions.includes("edit");

  const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const rows = []?.map((lead: Lead, index) => {
    return {
      id: index,
      image:
        "https://photos.zillowstatic.com/fp/b312180f50220b7ae1c090b3c3126e81-cc_ft_768.webp",
      address: lead.address,
      opportunity: lead.is_opp ? "Fix & Flip" : "",
      askingPrice: lead.listing_price,
      ARV: lead.arv,
      NOI: "",
      capRate: lead.cap_rate,
      zipCode: lead.zipcode,
      note: "",
    };
  }) ?? [];

  return (
    <>
      <StyledAccordion onChange={handleChange}>
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
          <BuyBoxLeads buybox={props.buybox} open={expanded} />
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
