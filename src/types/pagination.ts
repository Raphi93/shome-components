/**
 * Full pagination state including setters.
 * Returned by `usePaginationQuery` and consumed by `<PagedGrid>` / `<Pager>`.
 */
export type Pagination = {
  pageNumber: number;
  pageSize: number;
  /** Active text filter string. */
  filter: string;
  /** Active sort expression, e.g. `"name asc"`. */
  sort: string;
  setPageSize: (newPageSize: number) => void;
  setPageNumber: (newPageNumber: number) => void;
  setFilter: (newFilter: string | undefined) => void;
  setSort: (newSort: string | undefined) => void;
};

/**
 * Standard server response shape for paginated lists.
 *
 * @template T  The list item type — must have an `id: string` field.
 */
export type PagedList<T> = {
  totalCount: number;
  list: T[];
};
