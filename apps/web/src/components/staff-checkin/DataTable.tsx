"use client";

import * as React from "react";
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type SortingState,
  type RowSelectionState,
  type Updater,
} from "@tanstack/react-table";
import { cell_getContext } from "@tanstack/table-core/static-functions";
import { ChevronDown, ChevronUp, Search, Columns, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { features, type DataTableFeatures } from "./data-table-features";

// Extend RowData to require an id property for row identification
type DataTableRowData = RowData & {
  id: string;
};

interface DataTableProps<TData extends DataTableRowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  /** Optional search placeholder */
  searchPlaceholder?: string;
  /** Optional search key - which column to filter by default */
  searchKey?: string;
  /** Enable row selection */
  enableRowSelection?: boolean;
  /** Enable column visibility control */
  enableColumnVisibility?: boolean;
  /** Enable global filter/search */
  enableGlobalFilter?: boolean;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Custom empty state description */
  emptyDescription?: string;
  /** Initial page size */
  initialPageSize?: number;
  /** Show page size selector */
  showPageSizeSelector?: boolean;
  /** Available page sizes */
  pageSizeOptions?: number[];
  /** Custom className for the table container */
  className?: string;
  /** Called when row selection changes */
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  /** Whether to show row numbers */
  showRowNumbers?: boolean;
  /** Sticky header */
  stickyHeader?: boolean;
}

export function DataTable<TData extends DataTableRowData>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchKey,
  enableRowSelection = false,
  enableColumnVisibility = true,
  enableGlobalFilter = true,
  emptyMessage = "No results.",
  emptyDescription = "No matching records found.",
  initialPageSize = 10,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 25, 50, 100],
  className,
  onRowSelectionChange,
  showRowNumbers = false,
  stickyHeader = true,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // Handler for TanStack Table's onRowSelectionChange
  // This matches the expected signature: (updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => void
  const handleRowSelectionChange = React.useCallback(
    (updater: Updater<RowSelectionState>) => {
      setRowSelection((prev) =>
        typeof updater === "function" ? updater(prev) : updater
      );
    },
    []
  );

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: handleRowSelectionChange,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
      pagination,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
    },
  });

  // Handle global search
  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Get selected rows
  const selectedRows = React.useMemo(
    () => data.filter((row) => rowSelection[row.id]),
    [data, rowSelection]
  );

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onRowSelectionChange) {
      onRowSelectionChange(selectedRows);
    }
  }, [selectedRows, onRowSelectionChange]);

  // Toggle all rows selection
  const toggleAllRows = (checked: boolean) => {
    const newSelection: RowSelectionState = {};
    if (checked) {
      table.getRowModel().rows.forEach((row) => {
        newSelection[row.id] = true;
      });
    }
    setRowSelection(newSelection);
  };

  // Check if all visible rows are selected
  const allRowsSelected =
    table.getRowModel().rows.length > 0 &&
    table.getRowModel().rows.every((row) => rowSelection[row.id]);

  // Check if some rows are selected
  const someRowsSelected = table.getRowModel().rows.some((row) => rowSelection[row.id]);

  // Ref for the select-all checkbox to handle indeterminate state
  const selectAllCheckboxRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someRowsSelected && !allRowsSelected;
    }
  }, [someRowsSelected, allRowsSelected]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar with search, column visibility, and page size */}
      {(enableGlobalFilter || enableColumnVisibility || showPageSizeSelector) && (
        <div className="bg-muted/30 flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-2 gap-3 sm:flex-row sm:items-center">
            {enableGlobalFilter && (
              <div className="relative max-w-sm flex-1 sm:max-w-md">
                <Search
                  className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
                  aria-hidden="true"
                />
                <Input
                  placeholder={searchPlaceholder}
                  value={globalFilter}
                  onChange={(event) => handleGlobalFilterChange(event.target.value)}
                  className="h-10 pl-9 text-sm"
                  aria-label={searchPlaceholder}
                />
              </div>
            )}
            {searchKey && enableGlobalFilter && (
              <div className="relative max-w-sm flex-1">
                <Input
                  placeholder={`Filter ${searchKey}...`}
                  value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn(searchKey)?.setFilterValue(event.target.value)
                  }
                  className="h-10 text-sm"
                  aria-label={`Filter ${searchKey}`}
                />
              </div>
            )}
          </div>

          <div className="flex min-w-[20%] flex-1 flex-wrap items-center gap-2">
            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm" className="h-10 gap-1.5">
                    <Columns className="size-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Columns</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <p className="text-muted-foreground px-2 py-1 text-xs font-semibold tracking-wider uppercase">
                    Toggle Columns
                  </p>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="py-1.5 text-sm capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {typeof column.columnDef.header === "string"
                          ? column.columnDef.header
                          : column.columnDef.header?.({} as never)}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {showPageSizeSelector && (
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(value) =>
                  setPagination((prev) => ({ ...prev, pageSize: Number(value), pageIndex: 0 }))
                }
              >
                <SelectTrigger className="h-10 w-auto">
                  <SelectValue placeholder="Page size" />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} per page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="border-border bg-card overflow-hidden rounded-xl border">
        <div
          className="scrollbar-clinical overflow-x-auto"
          style={stickyHeader ? { maxHeight: "calc(100vh - 300px)" } : {}}
        >
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-border bg-muted/30 border-b">
                  {enableRowSelection && showRowNumbers && (
                    <TableHead className="h-10 w-12 px-2 text-center align-middle font-medium">
                      <input
                        type="checkbox"
                        ref={selectAllCheckboxRef}
                        checked={allRowsSelected}
                        onChange={(e) => toggleAllRows(e.target.checked)}
                        aria-label="Select all rows"
                        className="border-border text-primary focus:ring-primary/20 h-4 w-4 rounded"
                      />
                    </TableHead>
                  )}
                  {showRowNumbers && !enableRowSelection && (
                    <TableHead className="text-muted-foreground h-10 w-10 px-2 text-center align-middle font-medium">
                      #
                    </TableHead>
                  )}
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-foreground h-10 px-3 text-left align-middle font-semibold whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className="hover:text-primary flex w-full cursor-pointer items-center gap-1.5 transition-colors select-none"
                          aria-label={`Sort by ${typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : "column"}`}
                        >
                          <span className="truncate">
                            {typeof header.column.columnDef.header === "string"
                              ? header.column.columnDef.header
                              : header.column.columnDef.header?.({} as never)}
                          </span>
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="text-primary size-4" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="text-primary size-4" aria-hidden="true" />
                            )
                          ) : (
                            <span className="text-muted-foreground size-4" aria-hidden="true">
                              <ChevronUp className="size-3" />
                              <ChevronDown className="size-3" />
                            </span>
                          )}
                        </button>
                      ) : (
                        <span>
                          {typeof header.column.columnDef.header === "string"
                            ? header.column.columnDef.header
                            : header.column.columnDef.header?.({} as never)}
                        </span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-border divide-y">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "transition-colors duration-150",
                      "hover:bg-muted/30",
                      "data-[state=selected]:bg-primary/5",
                      "data-[state=selected]:border-l-primary data-[state=selected]:border-l-2",
                      "focus-within:ring-primary/20 focus-within:ring-offset-background focus-within:ring-2 focus-within:ring-offset-2"
                    )}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        if (enableRowSelection) {
                          row.toggleSelected();
                        }
                      }
                    }}
                  >
                    {enableRowSelection && (
                      <TableCell className="w-12 px-2 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={row.getIsSelected()}
                          onChange={(e) => {
                            e.stopPropagation();
                            row.toggleSelected();
                          }}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Select row"
                          className="border-border text-primary focus:ring-primary/20 h-4 w-4 rounded"
                        />
                      </TableCell>
                    )}
                    {showRowNumbers && !enableRowSelection && (
                      <TableCell className="text-muted-foreground w-10 px-2 text-center align-middle font-mono text-xs tabular-nums">
                        {rowIndex + 1 + pagination.pageIndex * pagination.pageSize}
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-3 py-3 align-middle whitespace-nowrap">
                        {typeof cell.column.columnDef.cell === "function"
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
                    colSpan={
                      columns.length + (enableRowSelection ? 1 : 0) + (showRowNumbers ? 1 : 0)
                    }
                    className="h-32 py-8 text-center"
                  >
                    <div className="text-muted-foreground flex flex-col items-center gap-2">
                      <svg
                        className="text-muted-foreground/50 size-10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M3 15h18" />
                        <path d="M9 3v18" />
                        <path d="M15 3v18" />
                      </svg>
                      <p className="text-sm font-medium">{emptyMessage}</p>
                      <p className="text-xs">{emptyDescription}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="border-border bg-muted/30 flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground text-sm">
            Showing
            <span className="mx-1 font-medium">
              {table.getRowModel().rows.length === 0
                ? "0"
                : pagination.pageIndex * pagination.pageSize + 1}
            </span>
            to{" "}
            <span className="mx-1 font-medium">
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </span>
            of{" "}
            <span className="mx-1 font-medium">{table.getFilteredRowModel().rows.length}</span>
            results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
              className="h-9 px-3"
            >
              <ChevronsLeft className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
              className="h-9 px-3"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronsRight className="size-4" aria-hidden="true" />
            </Button>
            <span className="text-muted-foreground px-2 text-xs">
              Page {pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </div>
        </div>
      </div>

      {/* Selection Bar - shows when rows are selected */}
      {enableRowSelection && selectedRows.length > 0 && (
        <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-xl border p-3">
          <span className="text-primary text-sm font-medium">
            {selectedRows.length} row{selectedRows.length !== 1 ? "s" : ""} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRowSelection({})}
            className="text-primary hover:bg-primary/10"
          >
            Clear selection
          </Button>
        </div>
      )}
    </div>
  );
}