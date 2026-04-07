import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '..';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UsePaginationQueryOptions {
  /**
   * URL parameter prefix. Useful when two pagers share the same page,
   * e.g. `prefix: "orders_"` → `?orders_pageNumber=2`.
   */
  prefix?: string;
  /** Default sort field/direction string. Applied when the URL param is absent. */
  defaultSort?: string;
  /** Default page size. @default 25 */
  defaultPageSize?: number;
  /**
   * When `true` (default) uses `router.replace` instead of `router.push`,
   * so pagination changes don't create browser history entries.
   */
  replace?: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Syncs pagination state (page number, page size, filter, sort) with the
 * current URL's query string using Next.js App Router.
 *
 * All state changes call `router.replace` by default so pagination does NOT
 * create back-stack entries. Pass `replace: false` to use `router.push`.
 *
 * Spaces in filter/sort strings are encoded as `%20` (not `+`) to match
 * what most backends expect.
 *
 * @example
 * const pagination = usePaginationQuery({ defaultPageSize: 50, defaultSort: 'name asc' });
 *
 * <PagedGrid pagination={pagination} totalCount={total} culture="de-CH">
 *   ...
 * </PagedGrid>
 */
export function usePaginationQuery(params?: UsePaginationQueryOptions): Pagination {
  const prefix        = params?.prefix        ?? '';
  const defaultSort   = params?.defaultSort   ?? '';
  const defaultPageSize = params?.defaultPageSize ?? 25;
  const replace       = params?.replace       ?? true;

  const defaultPageNumber = 1;
  const pageNumberKey = prefix + 'pageNumber';
  const pageSizeKey   = prefix + 'pageSize';
  const filterKey     = prefix + 'filter';
  const sortKey       = prefix + 'sort';

  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  /** Commits the next URLSearchParams to the URL. */
  const commit = useCallback(
    (next: URLSearchParams) => {
      // URLSearchParams encodes spaces as "+" — replace with "%20" for backend compat.
      const qs  = next.toString().replace(/\+/g, '%20');
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (replace) router.replace(url, { scroll: false });
      else         router.push(url,    { scroll: false });
    },
    [pathname, replace, router]
  );

  const pageNumber = Number(searchParams.get(pageNumberKey)) || defaultPageNumber;
  const pageSize   = Number(searchParams.get(pageSizeKey))   || defaultPageSize;
  const filter     = searchParams.get(filterKey) || '';

  // Use defaultSort only when the param is truly missing (null), not when it's
  // explicitly set to empty string '' (which would mean "no sort").
  const rawSort = searchParams.get(sortKey);
  const sort    = rawSort === null ? defaultSort : rawSort;

  const setPageSize = useCallback(
    (newPageSize: number) => {
      const next = new URLSearchParams(searchParams.toString());
      if (pageSize < newPageSize) {
        const newPageNumber = Math.ceil(pageNumber / (newPageSize / pageSize));
        if (newPageNumber === defaultPageNumber) next.delete(pageNumberKey);
        else next.set(pageNumberKey, String(newPageNumber));
      }
      if (newPageSize === defaultPageSize) next.delete(pageSizeKey);
      else next.set(pageSizeKey, String(newPageSize));
      commit(next);
    },
    [commit, defaultPageNumber, defaultPageSize, pageNumber, pageNumberKey, pageSize, pageSizeKey, searchParams]
  );

  const setPageNumber = useCallback(
    (newPageNumber: number) => {
      const next = new URLSearchParams(searchParams.toString());
      if (newPageNumber === defaultPageNumber) next.delete(pageNumberKey);
      else next.set(pageNumberKey, String(newPageNumber));
      commit(next);
    },
    [commit, defaultPageNumber, pageNumberKey, searchParams]
  );

  const setFilter = useCallback(
    (newFilter: string | undefined) => {
      const next = new URLSearchParams(searchParams.toString());
      if (!newFilter) {
        next.delete(filterKey);
      } else {
        next.delete(pageNumberKey); // reset to page 1 on new filter
        next.set(filterKey, newFilter);
      }
      commit(next);
    },
    [commit, filterKey, pageNumberKey, searchParams]
  );

  const setSort = useCallback(
    (newSort: string | undefined) => {
      const next = new URLSearchParams(searchParams.toString());
      if (newSort === undefined) next.delete(sortKey);
      else next.set(sortKey, newSort);
      commit(next);
    },
    [commit, searchParams, sortKey]
  );

  return useMemo(
    () => ({ pageNumber, pageSize, filter, sort, setPageSize, setPageNumber, setFilter, setSort }),
    [filter, pageNumber, pageSize, setFilter, setPageNumber, setPageSize, setSort, sort]
  );
}
