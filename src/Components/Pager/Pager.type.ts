import type { Pagination } from '../../types';

export type TPaginationInfoVariant = 'both' | 'pages' | 'items' | 'none' | string;

export interface PagerProps {
  pageNumber?: number;
  pageSize?: number;
  entryCount: number;
  isConnected?: boolean;
  onPagination?: (number: number) => void;
  onPageSizeChange?: (number: number) => void;
  pagination?: Pagination;
  maximumButtonCount?: number;
  paginationInfoFormat?: TPaginationInfoVariant;
  isCompactPagination?: boolean;
  className?: string;
}

export interface ShownPaginationInfoProps {
  variant: TPaginationInfoVariant;
  entryCount?: number;
  pageCount?: number;
  culture?: string;
}
