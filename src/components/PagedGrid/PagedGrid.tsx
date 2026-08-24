'use client';

import { ReactNode, useEffect, useReducer } from 'react';

import { PaginationContext } from '../../context/paginationContext';
import { Grid } from '../Grid/Grid';
import { Pager } from '../Pager/Pager';
import { ShownPaginationInfo } from '../ShownPaginationInfo/ShownPaginationInfo';
import { checkedReducer, checkedSingleReducer } from '../../utils/Grid.stateReducer';
import { Pagination } from '../../types';
import type { TPaginationInfoVariant } from '../../types/Pager.types';

import style from '../Grid/Grid.module.scss';

export type PagedGridProps = {
  totalCount: number;
  pagination: Pagination;
  children: ReactNode;
  paginationTopInfoVariant?: TPaginationInfoVariant;
  paginationBottomInfoVariant?: TPaginationInfoVariant;
  maximumButtonCount?: number;
  isCompactPagination?: boolean;
  defaultPageSize?: number;
  multiSelect?: boolean;
  isSelect?: boolean;
  data?: any[];
  onSelect?: (items: any) => void;
  hasTableTag?: boolean;
  culture: string;
  /**
   * Additional CSS class name for pagination styling
   */
  pagerClassName?: string;
  isCard?: boolean;
};

export function PagedGrid({
  totalCount,
  pagination,
  children,
  paginationTopInfoVariant = 'none',
  paginationBottomInfoVariant = 'both',
  maximumButtonCount = 10,
  isCompactPagination = false,
  defaultPageSize = 25,
  multiSelect = false,
  data,
  isSelect,
  onSelect,
  hasTableTag = true,
  pagerClassName,
  culture,
  isCard = false,
}: PagedGridProps) {
  const pageCount = Math.ceil(totalCount / pagination.pageSize);

  const [checkedList, dispatchChecked] = useReducer(multiSelect ? checkedReducer : checkedSingleReducer, []);

  const isCurrentPageSizeLessThenDefault = pagination.pageSize < defaultPageSize;
  const isPaginationShown =
    totalCount > defaultPageSize || (isCurrentPageSizeLessThenDefault && totalCount > pagination.pageSize);

  useEffect(() => {
    if (!onSelect) return;

    const selectedData = data
      ?.map((item) => {
        if (checkedList.includes(item.id)) return item;
      })
      .filter(Boolean);

    onSelect(selectedData);
  }, [checkedList]);

  useEffect(() => {
    dispatchChecked({ type: 'uncheck-all' });
  }, [data]);

  return (
    <PaginationContext.Provider value={pagination}>
      {paginationTopInfoVariant !== 'none' && (
        <div className={style['top-pagination-info']}>
          <ShownPaginationInfo variant={paginationTopInfoVariant} pageCount={pageCount} entryCount={totalCount} culture={culture} />
        </div>
      )}
      {isCard ? children : (
      <Grid
        hasPagination={true}
        multiSelect={multiSelect}
        checkedList={isSelect ? checkedList : undefined}
        dispatchChecked={isSelect ? dispatchChecked : undefined}
        data={data}
        hasTableTag={hasTableTag}
      >
        {children}
        </Grid>
      )}

      {isPaginationShown && (
        <Pager
          isCompactPagination={isCompactPagination}
          maximumButtonCount={maximumButtonCount}
          entryCount={totalCount}
          isConnected={true}
          paginationInfoFormat={paginationBottomInfoVariant}
          className={pagerClassName}
        />
      )}
    </PaginationContext.Provider>
  );
}
