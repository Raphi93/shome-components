'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '../types';

interface IProps {
  prefix?: string;
  defaultSort?: string;
  defaultPageSize?: number;
  replace?: boolean; // default: true
}

export function usePaginationQuery(params?: IProps): Pagination {
  const prefix = params?.prefix ?? '';
  const defaultSort = params?.defaultSort ?? '';
  const defaultPageSize = params?.defaultPageSize ?? 25;
  const replace = params?.replace ?? true;

  const defaultPageNumber = 1;

  const pageNumberKey = prefix + 'pageNumber';
  const pageSizeKey = prefix + 'pageSize';
  const filterKey = prefix + 'filter';
  const sortKey = prefix + 'sort';

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageNumber = Number(searchParams.get(pageNumberKey)) || defaultPageNumber;
  const pageSize = Number(searchParams.get(pageSizeKey)) || defaultPageSize;
  const filter = searchParams.get(filterKey) || '';
  const sort = searchParams.get(sortKey) || defaultSort;

  const commit = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [pathname, replace, router]
  );

  const setPageSize = useCallback(
    (newPageSize: number) => {
      const next = new URLSearchParams(searchParams.toString());

      // wenn pageSize größer wird: pageNumber sauber umrechnen
      if (pageSize < newPageSize) {
        const newPageNumber = Math.ceil(pageNumber / (newPageSize / pageSize));
        if (newPageNumber === defaultPageNumber) next.delete(pageNumberKey);
        else next.set(pageNumberKey, String(newPageNumber));
      }

      if (newPageSize === defaultPageSize) next.delete(pageSizeKey);
      else next.set(pageSizeKey, String(newPageSize));

      commit(next);
    },
    [commit, defaultPageSize, defaultPageNumber, pageNumber, pageNumberKey, pageSize, pageSizeKey, searchParams]
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
        next.delete(pageNumberKey); // bei neuem Filter zurück auf Seite 1
        next.set(filterKey, newFilter);
      }

      commit(next);
    },
    [commit, filterKey, pageNumberKey, searchParams]
  );

  const setSort = useCallback(
    (newSort: string | undefined) => {
      const next = new URLSearchParams(searchParams.toString());

      if (!newSort) next.delete(sortKey);
      else next.set(sortKey, newSort);

      commit(next);
    },
    [commit, searchParams, sortKey]
  );

  return useMemo(
    () => ({
      pageNumber,
      pageSize,
      filter,
      sort,
      setPageSize,
      setPageNumber,
      setFilter,
      setSort,
    }),
    [filter, pageNumber, pageSize, setFilter, setPageNumber, setPageSize, setSort, sort]
  );
}