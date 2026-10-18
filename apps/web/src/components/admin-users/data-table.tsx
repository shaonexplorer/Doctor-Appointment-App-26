'use client';

import * as React from 'react';
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Updater,
  type Column,
} from '@tanstack/react-table';
import { CalendarPlus, ChevronDown, ChevronUp, Loader2, MoreHorizontal } from 'lucide-react';

import { features, type DataTableFeatures } from './data-table-features';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  rowCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: Updater<PaginationState>) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: Updater<SortingState>) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: Updater<ColumnFiltersState>) => void;
  columnVisibility?: ColumnVisibilityState;
  onColumnVisibilityChange?: (visibility: Updater<ColumnVisibilityState>) => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: Updater<RowSelectionState>) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  isLoading?: boolean;
  showColumnVisibility?: boolean;
  showGlobalFilter?: boolean;
  globalFilterPlaceholder?: string;
  /** Custom toolbar components - rendered in the toolbar area */
  toolbar?: React.ReactNode;
  /** Custom leading toolbar content (before global filter) */
  toolbarLeading?: React.ReactNode;
  /** Custom trailing toolbar content (after column visibility) */
  toolbarTrailing?: React.ReactNode;
  /** Callback triggered when the "New appointment" toolbar action is clicked */
  onCreateAppointment?: () => void;
  className?: string;
}

/**
 * Reusable server-side DataTable component using TanStack Table v9
 * with shadcn/ui styling.
 *
 * All filtering, sorting, and pagination are handled server-side.
 * The component only manages the UI state and delegates operations
 * to the server via callback props.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  rowCount = 0,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  columnVisibility,
  onColumnVisibilityChange,
  rowSelection,
  onRowSelectionChange,
  globalFilter: _globalFilter,
  onGlobalFilterChange: _onGlobalFilterChange,
  isLoading = false,
  showColumnVisibility = true,
  showGlobalFilter: _showGlobalFilter = true,
  globalFilterPlaceholder: _globalFilterPlaceholder = 'Search...',
  toolbar,
  toolbarLeading,
  toolbarTrailing,
  onCreateAppointment,
  className,
}: DataTableProps<TData>) {
  const [localVisibility, setLocalVisibility] = React.useState<ColumnVisibilityState>({});
  const table = useTable({
    features,
    data,
    columns,
    // Server-side state
    state: {
      sorting: sorting ?? [],
      columnFilters: columnFilters ?? [],
      columnVisibility: columnVisibility ?? localVisibility,
      rowSelection: rowSelection ?? {},
      pagination: pagination ?? { pageIndex: 0, pageSize: 10 },
    },
    // Server-side handlers - reset page on sort/filter changes
    onSortingChange: (updater: Updater<SortingState>) => {
      const newSorting = typeof updater === 'function' ? updater(sorting ?? []) : updater;
      onSortingChange?.(newSorting);
      onPaginationChange?.((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onColumnFiltersChange: (updater: Updater<ColumnFiltersState>) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters ?? []) : updater;
      onColumnFiltersChange?.(newFilters);
      onPaginationChange?.((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onColumnVisibilityChange: (updater: Updater<ColumnVisibilityState>) => {
      const newVisibility =
        typeof updater === 'function' ? updater(columnVisibility ?? localVisibility) : updater;
      if (onColumnVisibilityChange) {
        onColumnVisibilityChange(newVisibility);
      } else {
        setLocalVisibility(newVisibility);
      }
    },
    onRowSelectionChange,
    onPaginationChange,
    // Enable manual (server-side) operations
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    rowCount,
  });

  // Helper to render sort icons
  const renderSortIcon = (column: Column<DataTableFeatures, TData, unknown>) => {
    const isSorted = column.getIsSorted();
    if (isSorted === 'asc') return <ChevronUp className="h-4 w-4" />;
    if (isSorted === 'desc') return <ChevronDown className="h-4 w-4" />;
    return (
      <span className="h-4 w-4 opacity-0">
        <ChevronDown className="h-4 w-4" />
      </span>
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {toolbar ? (
          toolbar
        ) : (
          <>
            {toolbarLeading}
            {/* {showGlobalFilter && (
              <div className="relative max-w-sm flex-1">
                <input
                  type="text"
                  placeholder={globalFilterPlaceholder}
                  value={globalFilter ?? ''}
                  onChange={(event) => onGlobalFilterChange?.(event.target.value)}
                  className="bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-lg border px-4 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            )} */}
            {showColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger className="max-w-full! sm:ml-auto">
                  <Button
                    variant="outline"
                    size="default"
                    className="flex w-full items-center justify-between gap-2 sm:w-auto"
                  >
                    Columns <MoreHorizontal className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-w-full!">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {toolbarTrailing}
            {onCreateAppointment && (
              <Button onClick={onCreateAppointment} className="flex items-center gap-2">
                <CalendarPlus className="size-4" />
                New appointment
              </Button>
            )}
          </>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.isPlaceholder) return null;
                  return (
                    <TableHead key={header.id} className="cursor-pointer select-none">
                      {header.column.getCanSort() && (
                        <button
                          onClick={() =>
                            header.column.toggleSorting(header.column.getIsSorted() === 'asc')
                          }
                          className="hover:text-primary flex items-center gap-1"
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={cn('font-medium', header.column.getCanSort() && 'pr-6')}
                            >
                              {typeof header.column.columnDef.header === 'function'
                                ? header.column.columnDef.header(header.getContext())
                                : header.column.columnDef.header}
                            </div>
                          )}
                          {renderSortIcon(header.column)}
                        </button>
                      )}
                      {!header.column.getCanSort() && (
                        <div className="font-medium">
                          {typeof header.column.columnDef.header === 'function'
                            ? header.column.columnDef.header(header.getContext())
                            : header.column.columnDef.header}
                        </div>
                      )}
                      {/* Column filter input for filterable columns */}
                      {/* {header.column.getCanFilter() && (
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder={`Filter ${header.column.id}...`}
                            value={(header.column.getFilterValue() as string) ?? ''}
                            onChange={(event) => header.column.setFilterValue(event.target.value)}
                            className="bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-lg border px-2 py-1 text-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      )} */}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.column.columnDef.cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {rowCount > 0 && (
        <div className="text-muted-foreground flex items-center justify-between px-4 py-2 text-sm">
          <div>
            <span>
              Showing{' '}
              <strong>
                {pagination?.pageIndex
                  ? pagination.pageIndex * (pagination.pageSize ?? 10) + 1
                  : 1}{' '}
              </strong>
              to{' '}
              <strong>
                {Math.min(
                  (pagination?.pageIndex ?? 0 + 1) * (pagination?.pageSize ?? 10),
                  rowCount
                )}{' '}
              </strong>
              of <strong>{rowCount}</strong> results
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={String(pagination?.pageSize ?? 10)}
              onValueChange={(value) =>
                onPaginationChange?.({ ...pagination!, pageSize: Number(value), pageIndex: 0 })
              }
            >
              <SelectTrigger className="h-8 w-[100px]">
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPaginationChange?.({ ...pagination!, pageIndex: 0 })}
                disabled={!pagination || pagination.pageIndex === 0}
                aria-label="First page"
              >
                <ChevronUp className="h-4 w-4 rotate-90" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPaginationChange?.({
                    ...pagination!,
                    pageIndex: (pagination?.pageIndex ?? 1) - 1,
                  })
                }
                disabled={!pagination || pagination.pageIndex === 0}
                aria-label="Previous page"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <span className="px-2">
                Page <strong>{(pagination?.pageIndex ?? 0) + 1}</strong> of{' '}
                <strong>{Math.ceil(rowCount / (pagination?.pageSize ?? 10))}</strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPaginationChange?.({
                    ...pagination!,
                    pageIndex: (pagination?.pageIndex ?? 0) + 1,
                  })
                }
                disabled={
                  !pagination ||
                  (pagination.pageIndex ?? 0) >=
                    Math.ceil(rowCount / (pagination?.pageSize ?? 10)) - 1
                }
                aria-label="Next page"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPaginationChange?.({
                    ...pagination!,
                    pageIndex: Math.ceil(rowCount / (pagination?.pageSize ?? 10)) - 1,
                  })
                }
                disabled={
                  !pagination ||
                  (pagination.pageIndex ?? 0) >=
                    Math.ceil(rowCount / (pagination?.pageSize ?? 10)) - 1
                }
                aria-label="Last page"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
