'use client';

import * as React from 'react';
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type RowData,
  type SortingState,
  type Updater,
  type Column,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Loader2, Search } from 'lucide-react';

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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  isLoading?: boolean;
  showColumnVisibility?: boolean;
  className?: string;

  /** Optional global search input rendered in the table toolbar. */
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };

  /** Optional status filter rendered in the table toolbar. */
  statusFilter?: {
    value: string;
    onChange: (value: string) => void;
    items: { value: string; label: string }[];
    placeholder?: string;
  };

  /** Optional add action rendered in the table toolbar. */
  addAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
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
  isLoading = false,
  showColumnVisibility = true,
  className,
  search,
  statusFilter,
  addAction,
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
      {/* Toolbar: global search, status filter, add action, and column visibility */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {search && (
            <div className="relative w-full max-w-md sm:w-auto">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder={search.placeholder ?? 'Search…'}
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                className="h-[38px] w-full pl-10 sm:w-auto"
              />
            </div>
          )}
          {statusFilter && (
            <div className="flex w-full items-end gap-2 sm:w-auto">
              <Label htmlFor="statusFilter" className="sr-only">
                Status filter
              </Label>
              <Select
                value={statusFilter.value}
                onValueChange={statusFilter.onChange}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={statusFilter.placeholder ?? 'All statuses'} />
                </SelectTrigger>
                <SelectContent>
                  {statusFilter.items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {showColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-auto">
                <Button variant="outline" size="default">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
          {addAction && (
            <Button onClick={addAction.onClick} disabled={addAction.disabled} className="w-fit">
              {addAction.label}
            </Button>
          )}
        </div>
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
                <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
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
      )}
    </div>
  );
}
