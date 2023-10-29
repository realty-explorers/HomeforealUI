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
import { Button, ListItemIcon, MenuItem, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AnalyticsIcon from "@mui/icons-material/Analytics";

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

type BuyBoxLeadsProps = {
  open: boolean;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  buybox: BuyBox;
};

const BuyBoxLeads = (props: BuyBoxLeadsProps) => {
  const [getProperty, propertyState] = useLazyGetPropertyQuery();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: props.page,
    pageSize: props.pageSize,
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const handleAnalysis = async (id: string) => {
    const source_id = data?.[id]?.source_id;
    const propertyData = await getProperty(source_id).unwrap();
    // dispatch(setSelectedComps(propertyData?.sales_comps?.data));
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
                className="max-h-full aspect-video rounded-xl"
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
        accessorKey: "note",
        header: "Note",
        size: 150,
      },
    ],
    [],
  );

  useEffect(() => {
    props.setPage(pagination.pageIndex);
    props.setPageSize(pagination.pageSize);
  }, [pagination.pageIndex]);

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableSorting: false,
    enableFilters: false,
    enableRowActions: true,
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
    renderRowActionMenuItems: ({ closeMenu, row }) => [
      <MenuItem
        key={1}
        onClick={() => {
          handleAnalysis(row.original.id);
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
