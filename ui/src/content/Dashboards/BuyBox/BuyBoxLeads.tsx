import BuyBox from "@/models/buybox";
import {
  useGetLeadsCountQuery,
  useGetLeadsQuery,
  useLazyGetLeadsQuery,
} from "@/store/services/analysisApi";
import { useRouter } from "next/navigation";
import { useLazyGetPropertyQuery } from "@/store/services/propertiesApiService";
import {
  setSelectedComps,
  setSelectedProperty,
  setSelectedPropertyPreview,
  setSelectedRentalComps,
} from "@/store/slices/propertiesSlice";
import { Button, Typography } from "@mui/material";

import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowId,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { skipToken } from "@reduxjs/toolkit/query";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PropertyPreview from "@/models/propertyPreview";

const PAGE_SIZE = 5;

type BuyBoxLeadsProps = {
  open: boolean;
  page: number;
  setPage: (page: number) => void;
  buybox: BuyBox;
};

const BuyBoxLeads = (props: BuyBoxLeadsProps) => {
  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "",
      // flex: 1,
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
      // flex: 1,
      minWidth: 100,
      renderCell: (cellValues) => {
        return (
          <Typography className="text-center">{cellValues.value}</Typography>
        );
      },
    },
    {
      field: "opportunity",
      headerName: "Opportunity", // flex: 1
    },

    {
      field: "askingPrice",
      headerName: "Asking Price",
      // flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "ARV",
      headerName: "ARV",
      // flex: 1,
      minWidth: 100,
      editable: true,
    },

    {
      field: "NOI",
      headerName: "NOI",
      // flex: 1,
      minWidth: 100,
      editable: true,
    },

    {
      field: "capRate",
      headerName: "Cap Rate",
      // flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "zipCode",
      headerName: "Zip Code",
      // flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "note",
      headerName: "Note",
      // flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "action",
      headerName: "",
      // flex: 1,
      minWidth: 220,
      renderCell: (cellValues) => {
        return (
          <div className="w-full h-full flex items-center justify-center m-2">
            <Button
              variant="contained"
              className={clsx([
                "bg-secondary",
                "hover:bg-secondary hover:opacity-80",
              ])}
              onClick={() => handleAnalysis(cellValues.row.id)}
            >
              <Typography className="">
                Analysis
              </Typography>
            </Button>
          </div>
        );
      },
    },
  ];

  const router = useRouter();
  const [getProperty, propertyState] = useLazyGetPropertyQuery();
  const dispatch = useDispatch();
  const handleAnalysis = async (id: string) => {
    const source_id = data?.[id]?.source_id;
    const propertyData = await getProperty(source_id).unwrap();
    dispatch(setSelectedComps(propertyData?.sales_comps?.data));
    dispatch(setSelectedRentalComps(propertyData?.rents_comps?.data));
    dispatch(setSelectedProperty(propertyData));
    dispatch(
      setSelectedPropertyPreview(
        {
          ...propertyData,
          sales_listing_price: propertyData.listing_price,
        } as PropertyPreview,
      ),
    );
    const propertyPreview = {
      ...propertyData,
      sales_listing_price: propertyData?.listing_price,
    } as PropertyPreview;
    dispatch(setSelectedPropertyPreview(propertyPreview));
    router.push("/dashboards/real-estate");
  };

  const mapPageToNextCursor = useRef<{ [page: number]: GridRowId }>({});
  const [paginationModel, setPaginationModel] = useState({
    page: props.page,
    pageSize: PAGE_SIZE,
  });

  const countQuery = useGetLeadsCountQuery(
    props.open && props.buybox ? props.buybox?.id : skipToken,
  );
  const { data, isFetching, error } = useGetLeadsQuery(
    props.buybox && props.open
      ? {
        id: props.buybox.id,
        skip: paginationModel.page * PAGE_SIZE,
        limit: PAGE_SIZE,
      }
      : skipToken,
  );
  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel,
  ) => {
    // We have the cursor, we can allow the page transition.
    // if (
    //   newPaginationModel.page === 0 ||
    //   mapPageToNextCursor.current[newPaginationModel.page - 1]
    // ) {
    setPaginationModel(newPaginationModel);
    props.setPage(newPaginationModel.page);
    // }
  };

  const rows = data?.map((lead: Lead, index) => {
    return {
      id: index,
      image: lead.primary_image ?? "",
      address: lead.address,
      opportunity: lead.opportunities.join(","),
      askingPrice: lead.listing_price,
      ARV: lead.arv_price,
      NOI: lead.noi,
      capRate: lead.cap_rate,
      zipCode: lead.zipcode,
      note: "",
    };
  }) ?? [];

  return (
    <div>
      {data?.[0]?.bedrooms}
      <DataGrid
        rowCount={countQuery.data?.count || 0}
        loading={isFetching}
        paginationMode="server"
        onPaginationModelChange={handlePaginationModelChange}
        paginationModel={paginationModel}
        pageSizeOptions={[PAGE_SIZE]}
        className="border-none"
        sx={{
          "*": {
            ".MuiDataGrid-cell": {
              outline: "none",
              "&:focus": {
                outline: "none",
              },
              "&:focus-within": {
                outline: "none",
              },
            },
          },
        }}
        rows={rows}
        columns={columns}
        rowHeight={100}
        // initialState={{
        //   pagination: {
        //     paginationModel: {
        //       pageSize: 10,
        //     },
        //   },
        // }}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default BuyBoxLeads;
