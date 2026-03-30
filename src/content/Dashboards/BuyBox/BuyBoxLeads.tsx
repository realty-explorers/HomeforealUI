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
import { numberFormatter, priceFormatter } from "@/utils/converters";
import ThemedButton from "@/components/Buttons/ThemedButton";
import { useRouter } from "next/router";

type BuyBoxLeadsProps = {
  open: boolean;
  setPage: (page: number, pageSize: number) => void;
  pageSize: number;
  page: number;
  buybox: BuyBox;
};

type LeadRow = Lead & {
  source_id: string;
  analysis_status: string;
  listing_price: number;
  sales_comps_price: string;
  sales_comps_percentage: string;
  cap_rate: string;
  units?: number | string;
  unit_count?: number | string;
  units_count?: number | string;
  total_units?: number | string;
  number_of_units?: number | string;
};

const toFiniteNumber = (value: unknown) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return undefined;
  }
  return numericValue;
};

const normalizeStrategyType = (value: unknown) =>
  `${value ?? ""}`
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

const isMultifamilyStrategyValue = (value: unknown) => {
  const normalizedValue = normalizeStrategyType(value);
  if (!normalizedValue) {
    return false;
  }

  return (
    normalizedValue === "MULTIFAMILY" ||
    normalizedValue === "MULTI_FAMILY" ||
    normalizedValue === "MULTY_FAMILY" ||
    (normalizedValue.includes("MULTI") && normalizedValue.includes("FAMILY")) ||
    (normalizedValue.includes("MULTY") && normalizedValue.includes("FAMILY"))
  );
};

const resolveUnitsCount = (lead: LeadRow) => {
  const unitFields = [
    lead.units,
    lead.unit_count,
    lead.units_count,
    lead.total_units,
    lead.number_of_units,
  ];

  for (const rawValue of unitFields) {
    const unitsCount = toFiniteNumber(rawValue);
    if (unitsCount !== undefined && unitsCount > 0) {
      return unitsCount;
    }
  }

  return undefined;
};

const BuyBoxLeads = (props: BuyBoxLeadsProps) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: props.page,
    pageSize: props.pageSize,
  });
  const strategySources = [
    props.buybox?.parameters?.strategy?.strategyType,
    (props.buybox?.parameters as Record<string, unknown> | undefined)?.strategyType,
    (props.buybox as unknown as Record<string, unknown>)?.strategyType,
  ];
  const legacyNameFallback = isMultifamilyStrategyValue(
    (props.buybox?.parameters as Record<string, unknown> | undefined)?.name,
  );
  const isMultifamilyBuybox =
    strategySources.some(isMultifamilyStrategyValue) || legacyNameFallback;

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

  const rows = data?.map((lead: LeadRow, index) => {
    const unitsCount = resolveUnitsCount(lead);
    const listingPrice = toFiniteNumber(lead.listing_price);
    const pricePerUnit =
      listingPrice !== undefined && unitsCount && unitsCount > 0
        ? listingPrice / unitsCount
        : undefined;

    return {
      id: index,
      sourceId: lead.source_id,
      image: {
        image: lead.image,
        new: lead.analysis_status === "new",
      },
      address: `${lead.address}, ${lead.city}, ${lead.zipcode}`,
      opportunity: lead.opportunities.join(","),
      askingPrice: priceFormatter(lead.listing_price),
      ARV: parseFloat(lead.sales_comps_price)
        ? priceFormatter(parseFloat(lead.sales_comps_price))
        : "-",
      underARV: parseFloat(lead.sales_comps_percentage)
        ? `${parseFloat(lead.sales_comps_percentage).toFixed()}%`
        : `0%`,
      units: unitsCount ? numberFormatter(Math.round(unitsCount)) : "-",
      pricePerUnit: pricePerUnit ? priceFormatter(pricePerUnit) : "-",
      NOI: parseFloat(lead.noi) ? priceFormatter(parseFloat(lead.noi)) : "-",
      capRate: parseFloat(lead.cap_rate)
        ? `${parseFloat(lead.cap_rate).toFixed(2)}%`
        : "-",
      analysisStatus: lead.analysis_status,
      note: "",
    };
  }) ?? [];

  const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
    const commonColumns: MRT_ColumnDef<any>[] = [
      {
        accessorKey: "image",
        header: "Image",
        Cell: ({ renderedCellValue, row }) => (
          <div className="flex flex-1 h-full grow items-center rounded-md">
            <div className="w-full h-full  flex align-center justify-center relative">
              {row.original.image.new && (
                <div className="absolute top-1 left-1 bg-secondary text-white font-semibold font-poppins px-1 rounded-md">
                  new
                </div>
              )}
              <img
                src={row.original.image.image}
                alt=""
                className="max-h-full aspect-video rounded-xl w-full"
              />
            </div>
          </div>
        ),
      },
      {
        accessorKey: "address",
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
    ];

    const strategyColumns: MRT_ColumnDef<any>[] = isMultifamilyBuybox
      ? [
          {
            accessorKey: "units",
            header: "Units",
            size: 120,
          },
          {
            accessorKey: "pricePerUnit",
            header: "Price / Unit",
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
            size: 120,
          },
        ]
      : [
          {
            accessorKey: "ARV",
            header: "ARV",
            size: 150,
          },
          {
            accessorKey: "underARV",
            header: "Under ARV",
            size: 150,
          },
        ];

    return [
      ...commonColumns,
      ...strategyColumns,
      {
        accessorKey: "sourceId",
        header: "Analysis",
        size: 150,
        Cell: ({ cell }) => (
          <Button
            href={`/dashboards/real-estate?buybox_id=${props.buybox.id}&property_id=${cell.row.original.sourceId}`}
            startIcon={<AnalyticsIcon />}
            className="bg-[#9747FF] hover:bg-[#5500c4] text-[#FFFDFD] rounded-3xl p-2 px-4 font-poppins font-semibold  "
          >
            Analysis
          </Button>
        ),
      },
    ];
  }, [isMultifamilyBuybox, props.buybox.id]);

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
    <div className="">
      <MaterialReactTable table={table} />
    </div>
  );
};

export default BuyBoxLeads;
