import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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

  const commit = useCallback(
    (next: URLSearchParams) => {
      // URLSearchParams serialisiert Spaces als "+"
      // Backend erwartet aber echtes Space => %20
      const qs = next.toString().replace(/\+/g, '%20');
      const url = qs ? `${pathname}?${qs}` : pathname;

      if (replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [pathname, replace, router]
  );

  const pageNumber = Number(searchParams.get(pageNumberKey)) || defaultPageNumber;
  const pageSize = Number(searchParams.get(pageSizeKey)) || defaultPageSize;
  const filter = searchParams.get(filterKey) || '';

  // DefaultSort nur dann nehmen, wenn Param wirklich fehlt (null),
  // nicht wenn er leer ist (''), falls du später NO-SORT brauchst.
  const rawSort = searchParams.get(sortKey);
  const sort = rawSort === null ? defaultSort : rawSort;

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

      if (newSort === undefined) next.delete(sortKey);
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