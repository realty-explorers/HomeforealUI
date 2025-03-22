import SidebarLayout from '@/layouts/SidebarLayout';
import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Eye,
  MoreHorizontal,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Offer, OfferStatus } from '@/schemas/OfferSchemas';
import {
  useApproveOfferMutation,
  useDeleteOfferMutation,
  useGetAllOffersQuery,
  useLazyGetAllOffersQuery
} from '@/store/services/offersApi';
import StatusBadge from './OfferStatusBadge';
import { formatCurrency } from '@/utils/converters';
import OfferDetailView from './OffersDetailView';
import { timeSince } from '@/utils/dateUtils';

export function OffersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const { data, isFetching, error } = useGetAllOffersQuery('');
  const [deleteOffer, deleteOfferState] = useDeleteOfferMutation();
  const [approveOffer, approveOfferState] = useApproveOfferMutation();

  const handleViewDetails = (offer: Offer) => {
    setSelectedOffer(offer);
    setDetailModalOpen(true);
  };

  const handleStatusChange = async (
    offerId: string,
    newStatus: OfferStatus
  ) => {
    await approveOffer({ offerId });
    // setPendingStatusChange({ offerId, status: newStatus });
    // setConfirmDialogOpen(true);
  };

  const handleDeleteOffer = async (offerId: string) => {
    await deleteOffer({ offerId });
  };

  const columns: ColumnDef<Offer>[] = [
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <StatusBadge status={row.getValue('status') || 'PENDING'} />
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      }
    },
    {
      accessorKey: 'purchasePrice',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="whitespace-nowrap"
        >
          Purchase Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = row.original.offerData.financialDetails.purchasePrice;
        return <div>{formatCurrency(amount)}</div>;
      },
      accessorFn: (row) => row.offerData.financialDetails.purchasePrice
    },
    {
      accessorKey: 'financingType',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="whitespace-nowrap"
        >
          Financing Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.offerData.financialDetails.financingType,
      accessorFn: (row) => row.offerData.financialDetails.financingType
    },
    {
      accessorKey: 'buyerName',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="whitespace-nowrap"
        >
          Buyer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.offerData.buyerDetails.name,
      accessorFn: (row) => row.offerData.buyerDetails.name
    },

    {
      accessorKey: 'buyerEmail',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="whitespace-nowrap"
        >
          Buyer Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.offerData.buyerDetails.email,
      accessorFn: (row) => row.offerData.buyerDetails.email
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="whitespace-nowrap"
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => timeSince(row.original.createdAt)
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const offer = row.original;
        const isPending = !offer.status || offer.status === 'PENDING';

        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleViewDetails(offer)}
              className="hover-scale"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hover-scale">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[160px] animate-scale-in"
              >
                <DropdownMenuItem
                  onClick={() => handleStatusChange(offer.id, 'ACCEPTED')}
                  disabled={!isPending || approveOfferState.isLoading}
                  className="cursor-pointer"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleDeleteOffer(offer.id)}
                  disabled={deleteOfferState.isLoading}
                  className="cursor-pointer"
                >
                  <X className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    }
  ];

  const table = useReactTable({
    data: data?.offers || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={
            (table.getColumn('buyerEmail')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('buyerEmail')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {selectedOffer && (
        <OfferDetailView
          offer={selectedOffer}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
        />
      )}
    </div>
  );
}

export default OffersTable;
