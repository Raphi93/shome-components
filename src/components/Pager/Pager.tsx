import { ReactNode, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import clx from 'classnames';

import { Icons } from '../Icon/Icon';

import style from './Pager.module.scss';
import { ActionButton } from '../Button';
import { useNumberFormat } from '../../hooks/numberFormat';
import { PaginationContext } from '../../context/paginationContext';
import { Pagination } from '../../types';

const supportedPageSizes = [5, 10, 25, 50, 100];

export type TPaginationInfoVariant = 'both' | 'pages' | 'items' | 'none' | string; 

export function Pager({
  pageNumber,
  pageSize,
  entryCount,
  isConnected,
  onPagination,
  onPageSizeChange,
  pagination,
  maximumButtonCount = 10,
  paginationInfoFormat = 'both',
  isCompactPagination = false,
  className,
}: {
  /**
   * Current page number
   */
  pageNumber?: number;
  /**
   * Setting how many entries are displayed on page
   */
  pageSize?: number;
  /**
   * Count of all entries
   */
  entryCount: number;
  /**
   * Allows to connect pagination to previous component
   */
  isConnected?: boolean;
  onPagination?: (number: number) => void;
  onPageSizeChange?: (number: number) => void;
  pagination?: Pagination;
  maximumButtonCount?: number;
  paginationInfoFormat?: TPaginationInfoVariant;
  isCompactPagination?: boolean;
  /**
   * Additional CSS class name for styling
   */
  className?: string;
}) {
  const { t } = useTranslation();
  const contextPagination = useContext(PaginationContext);
  if (!pagination && contextPagination) {
    pagination = contextPagination;
  }
  const pageNumberFinal = pageNumber ?? pagination?.pageNumber ?? 1;
  const pageSizeFinal = pageSize ?? pagination?.pageSize ?? 25;
  const onPaginationFinal = onPagination ?? pagination?.setPageNumber ?? (() => {});
  onPageSizeChange = onPageSizeChange ?? pagination?.setPageSize;

  const pageCount = Math.ceil(entryCount / pageSizeFinal);
  const isFirstPage = pageNumberFinal === 1;
  const isLastPage = pageNumberFinal === pageCount;

  return (
    <div className={clx(style.pagination, { [style.connected]: isConnected }, className)}>
      <div className={style.buttons}>
        <ActionButton
          className={style.first}
          title={t('First page')}
          disabled={isFirstPage}
          small={true}
          secondary={true}
          icon={Icons.SkipBackward}
          onClick={() => onPaginationFinal(1)}
        />
        <ActionButton
          className={style.prev}
          title={t('Previous page')}
          disabled={isFirstPage}
          small={true}
          secondary={true}
          icon={Icons.ArrowCarbetBack}
          onClick={() => onPaginationFinal(pageNumberFinal - 1)}
        />

        {listPages(pageNumberFinal, pageCount, maximumButtonCount).map((a, i) =>
          a === -1 ? (
            <span key={i} className={style.ellipsis}>
              …
            </span>
          ) : (
            <ActionButton
              key={i}
              className={a === pageNumberFinal ? style.current : ''}
              disabled={a === pageNumberFinal}
              small={true}
              secondary={a !== pageNumberFinal}
              onClick={() => onPaginationFinal(a)}
              text={a.toString()}
            />
          )
        )}

        <ActionButton
          className={style.next}
          title={t('Next page')}
          disabled={isLastPage}
          small={true}
          secondary={true}
          icon={Icons.ArrowCarbetForward}
          onClick={() => onPaginationFinal(pageNumberFinal + 1)}
        />

        <ActionButton
          className={style.last}
          title={t('Last page')}
          disabled={isLastPage}
          small={true}
          secondary={true}
          icon={Icons.SkipForward}
          onClick={() => onPaginationFinal(pageCount)}
        />
      </div>

      {onPageSizeChange ? (
        <div className={style['page-size']}>
          {!isCompactPagination && <label>{t('Page size')}</label>}
          <select onChange={(a) => onPageSizeChange!(Number(a.target.value))} value={pageSizeFinal}>
            {supportedPageSizes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <ShownPaginationInfo variant={paginationInfoFormat} entryCount={entryCount} pageCount={pageCount} />
    </div>
  );
}

function listPages(pageNumber: number, pageCount: number, maxShow: number): number[] {
  const result = [];

  maxShow--;

  let startPage = Math.max(1, pageNumber - Math.floor(maxShow / 2));

  const pagesUsed = pageNumber - startPage;

  const isLastPortionShown = pageNumber > pageCount - Math.ceil(maxShow / 2);

  if (startPage > 1 && !isLastPortionShown) {
    // To prevent right button position skip when elipsis on left appears
    maxShow--;
  }

  const endPage = Math.min(pageCount, pageNumber + (maxShow - pagesUsed));

  if (endPage - startPage < maxShow) {
    startPage = Math.max(1, startPage - (maxShow - (endPage - startPage)));
  }

  // -1 sent in place of ellipse is hack to prevent creation of temporary objects and loading GC
  if (startPage !== 1) {
    result.push(-1);
  }

  for (let i = startPage; i <= endPage; i++) {
    result.push(i);
  }

  if (endPage !== pageCount) {
    result.push(-1);
  }

  return result;
}

export function ShownPaginationInfo({
  variant,
  entryCount,
  pageCount,
  culture,
}: {
  variant: TPaginationInfoVariant;
  entryCount?: number;
  pageCount?: number;
  culture?: string;
}) {
  const { t } = useTranslation();
  const numberFormat = useNumberFormat(culture);
  let content: ReactNode | null = null;

  if (variant === 'none') {
    return <></>;
  }

  // if (variant === 'both') {
  //   content = (
  //     <>
  //       <strong>{numberFormat(entryCount)}</strong> {t('Items in')} <strong>{numberFormat(pageCount)}</strong>{' '}
  //       {t('Pages')}
  //     </>
  //   );
  // }

  // if (variant === 'items') {
  //   content = (
  //     <>
  //       <strong>{numberFormat(entryCount)}</strong> {t('Items')}
  //     </>
  //   );
  // }

  // if (variant === 'pages') {
  //   content = (
  //     <>
  //       <strong>{numberFormat(pageCount)}</strong> {t('Pages')}
  //     </>
  //   );
  // }

  content = `${numberFormat(entryCount)} ${t('Items')}`;

  

  return <div className={style.info}>{content}</div>;
}
