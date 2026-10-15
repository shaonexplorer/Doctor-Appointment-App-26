'use client';

import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/react-table';

/**
 * TanStack Table v9 feature declarations for the admin users table.
 * Uses server-side filtering, sorting, and pagination.
 * Anything not registered here is tree-shaken out of the bundle.
 */
export const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  // Include row models for type system - they're used for client-side operations
  // but we also use manual flags to delegate to server
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

// Pass this as the first generic argument to ColumnDef, Column, Table, and Row
// so each type knows which feature APIs are available.
export type DataTableFeatures = typeof features;