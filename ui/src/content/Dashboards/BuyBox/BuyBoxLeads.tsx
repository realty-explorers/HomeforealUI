import BuyBox from "@/models/buybox";
import {
  useGetLeadsCountQuery,
  useGetLeadsQuery,
  useLazyGetLeadsQuery,
} from "@/store/services/analysisApi";
import { useLazyGetPropertyQuery } from "@/store/services/propertiesApiService";
import {
  setSelectedComps,
  setSelectedProperty,
  setSelectedPropertyPreview,
  setSelectedRentalComps,
} from "@/store/slices/propertiesSlice";
import { Button, ListItemIcon, MenuItem, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import Lead from "@/models/lead";

import { useSearchParams } from "next/navigation";

import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowId,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { skipToken } from "@reduxjs/toolkit/query";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PropertyPreview from "@/models/propertyPreview";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  MRT_PaginationState,
  useMaterialReactTable,
} from "material-react-table";
import { priceFormatter } from "@/utils/converters";
import ThemedButton from "@/components/Buttons/ThemedButton";
import { useRouter } from "next/router";

type BuyBoxLeadsProps = {
  open: boolean;
  setPage: (page: number, pageSize: number) => void;
  pageSize: number;
  page: number;
  buybox: BuyBox;
};

const BuyBoxLeads = (props: BuyBoxLeadsProps) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: props.page,
    pageSize: props.pageSize,
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const countQuery = useGetLeadsCountQuery(
    props.open && props.buybox ? props.buybox?.id : skipToken,
  );

  const { data, isFetching, error } = useGetLeadsQuery(
    props.buybox && props.open
      ? {
        id: props.buybox.id,
        skip: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
      }
      : skipToken,
  );

  const rows = data?.map((lead: Lead, index) => {
    return {
      id: index,
      sourceId: lead.source_id,
      image: lead.primary_image ?? "",
      address: lead.address,
      opportunity: lead.opportunities.join(","),
      askingPrice: priceFormatter(lead.listing_price),
      ARV: parseFloat(lead.arv_price)
        ? priceFormatter(parseFloat(lead.arv_price))
        : "-",
      NOI: parseFloat(lead.noi) ? priceFormatter(parseFloat(lead.noi)) : "-",
      capRate: parseFloat(lead.cap_rate)
        ? `${parseFloat(lead.cap_rate).toFixed(2)}%`
        : "-",
      zipCode: lead.zipcode,
      note: "",
    };
  }) ?? [];

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Image",
        Cell: ({ renderedCellValue, row }) => (
          <div className="flex flex-1 h-full grow items-center rounded-md">
            <div className="w-full h-full  flex align-center justify-center">
              <img
                src={row.original.image}
                alt=""
                className="max-h-full aspect-video rounded-xl w-full"
              />
            </div>
          </div>
        ),
      },
      {
        accessorKey: "address", //access nested data with dot notation
        header: "address",
        size: 150,
      },
      {
        accessorKey: "opportunity",
        header: "Opportunity",
        size: 150,
      },
      {
        accessorKey: "askingPrice",
        header: "Asking Price",
        size: 150,
      },
      {
        accessorKey: "ARV",
        header: "ARV",
        size: 150,
      },
      {
        accessorKey: "NOI",
        header: "NOI",
        size: 150,
      },
      {
        accessorKey: "capRate",
        header: "Cap Rate",
        size: 150,
      },
      {
        accessorKey: "zipCode",
        header: "Zip Code",
        size: 150,
      },
      {
        accessorKey: "sourceId",
        // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
        header: "Analysis",
        size: 150,
        //custom conditional format and styling
        Cell: ({ cell }) => (
          <Button // startIcon={}
            // href=`/dashboards/real-estate?buybox_id=${props.buybox.id}&property_id=${data?.[cell.row.id]?.source_id}`
            href={`/dashboards/real-estate?buybox_id=${props.buybox.id}&property_id=${cell.row.original.sourceId}`}
            startIcon={<AnalyticsIcon />}
            className="bg-[#9747FF] hover:bg-[#5500c4] text-[#FFFDFD] rounded-3xl p-2 px-4 font-poppins font-semibold  " // onClick={handleEditBuyBox}
          >
            Analysis
          </Button>
        ),
      },
    ],
    [],
  );

  useEffect(() => {
    props.setPage(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex]);

  const handleChangePagination = (pagination) => {
    // console.log(pagination);

    // setPagination(pagination);
    //
    // router.push(
    //   {
    //     pathname: router.pathname,
    //     query: {
    //       ...router.query,
    //       page: pagination.pageIndex,
    //       pageSize: pagination.pageSize,
    //     },
    //   },
    //   undefined,
    //   { shallow: true },
    // );
  };

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableSorting: false,
    enableFilters: false,
    // enableRowActions: true,
    rowCount: countQuery.data?.count || 0,
    manualPagination: true,
    onPaginationChange: setPagination,
    state: {
      isLoading: isFetching,
      pagination: {
        pageSize: pagination.pageSize,
        pageIndex: pagination.pageIndex,
      },
    },
    getRowId: (row) => row.id,
    muiTableHeadProps: {
      sx: {
        fontFamily: "var(--font-poppins)",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: "var(--font-poppins)",
      },
    },
    muiTableContainerProps: {
      sx: {
        backgroundColor: "white",
      },
    },
    muiTableBodyRowProps: {
      sx: {
        backgroundColor: "white",
      },
    },
    muiTableHeadRowProps: {
      sx: {
        backgroundColor: "white",
      },
    },
    muiTopToolbarProps: {
      sx: {
        backgroundColor: "white",
      },
    },
    renderRowActionMenuItems: ({ closeMenu, row }) => [
      <MenuItem
        key={1}
        onClick={() => {
          // handleAnalysis(row.original.id);
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <AnalyticsIcon />
        </ListItemIcon>
        Analysis
      </MenuItem>,
      <MenuItem
        key={0}
        onClick={() => {
          // View profile logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <BookmarkIcon />
        </ListItemIcon>
        Save Lead
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {
          // Send email logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        Delete Lead
      </MenuItem>,
    ],
  });

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default BuyBoxLeads;
