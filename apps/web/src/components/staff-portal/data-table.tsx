'use client';

import * as React from 'react';
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type SortingState,
} from '@tanstack/react-table';
import { cell_getContext } from '@tanstack/table-core/static-functions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { features, type DataTableFeatures } from './data-table-features';

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  /** Optional search placeholder */
  searchPlaceholder?: string;
  /** Optional search key - which column to filter by default */
  searchKey?: string;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  searchKey,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  // Handle global search
  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar with search and column visibility */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full gap-2 sm:w-auto">
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(event) => handleGlobalFilterChange(event.target.value)}
            className="w-full max-w-sm sm:w-64"
            aria-label={searchPlaceholder}
          />
          {searchKey && (
            <Input
              placeholder={`Filter ${searchKey}...`}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
              className="w-full max-w-sm sm:w-64"
              aria-label={`Filter ${searchKey}`}
            />
          )}
        </div>

        {/* Column visibility dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm">
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
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex w-full cursor-pointer items-center gap-1 select-none"
                      >
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'asc' ? (
                            <span>▲</span>
                          ) : (
                            <span>▼</span>
                          )
                        ) : (
                          <span className="text-muted-foreground">⇅</span>
                        )}
                        {typeof header.column.columnDef.header === 'string'
                          ? header.column.columnDef.header
                          : header.column.columnDef.header?.({} as never)}
                      </button>
                    ) : (
                      <span>
                        {typeof header.column.columnDef.header === 'string'
                          ? header.column.columnDef.header
                          : header.column.columnDef.header?.({} as never)}
                      </span>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/20"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(
                            cell_getContext(cell) as unknown as {
                              cell: typeof cell;
                              column: typeof cell.column;
                              getValue: typeof cell.getValue;
                              renderValue: typeof cell.renderValue;
                              row: typeof cell.row;
                              table: typeof cell.table;
                            }
                          )
                        : cell.getValue()}
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

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Showing{' '}
          <strong>
            {table.state.pagination.pageIndex * table.state.pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.state.pagination.pageIndex + 1) * table.state.pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of <strong>{table.getFilteredRowModel().rows.length}</strong>
          </strong>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
