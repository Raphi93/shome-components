'use client';

import { ReactNode, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import clx from 'classnames';
import { faBackwardFast, faForwardFast, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PaginationContext } from '../../context/paginationContext';
import { useNumberFormat } from '../../hooks/numberFormat';
import { Button } from '../Button';

import type { PagerProps, ShownPaginationInfoProps } from './Pager.type';
export type { PagerProps, ShownPaginationInfoProps, TPaginationInfoVariant } from './Pager.type';

import style from './Pager.module.scss';

export const SUPPORTED_PAGE_SIZES = [5, 10, 25, 50, 100] as const;

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
}: PagerProps) {
  const { t } = useTranslation();
  const contextPagination = useContext(PaginationContext);
  if (!pagination && contextPagination) {
    pagination = contextPagination;
  }
  const pageNumberFinal = pageNumber ?? pagination?.pageNumber ?? 1;
  const pageSizeFinal = pageSize ?? pagination?.pageSize ?? 25;
  const onPaginationFinal = onPagination ?? pagination?.setPageNumber ?? (() => {});
  onPageSizeChange = onPageSizeChange ?? pagination?.setPageSize;

  const pageCountRaw = Math.ceil(Math.max(0, entryCount) / Math.max(1, pageSizeFinal));
  const pageCount = Math.max(1, pageCountRaw);

  // Clamp the current page to the valid range so disabled states are always correct.
  const pageNumberClamped = Math.min(Math.max(1, pageNumberFinal), pageCount);

  const isFirstPage = pageNumberClamped === 1;
  const isLastPage = pageNumberClamped === pageCount;

  return (
    <div className={clx(style.pagination, { [style.connected]: isConnected }, className)}>
      <div className={style.buttons}>
         <Button
          title={t("First page")}
          className={style["first-page-button"]}
          disabled={isFirstPage}
          small
          width="2rem"
          color="light"
          border
          isLightColor={true}
          onClick={() => onPaginationFinal(1)}
        >
          <FontAwesomeIcon icon={faBackwardFast} style={{ fontSize: '0.8rem' }} />
        </Button>

        <Button
          title={t("Previous page")}
          className={style["previous-page-button"]}
          disabled={isFirstPage}
          small
          width="2rem"
          color='light'
          border
          isLightColor={true}
          onClick={() => onPaginationFinal(pageNumberClamped - 1)}
        >
          <FontAwesomeIcon icon={faPlay} transform="flip-h" style={{ fontSize: '0.8rem' }} />
        </Button>

        {listPages(pageNumberClamped, pageCount, maximumButtonCount).map((a, i) =>
          a === -1 ? (
            <span key={i} className={style.ellipsis}>
              …
            </span>
          ) : (
            <Button
              key={i}
              disabled={a === pageNumberClamped}
              className={style["page-number-button"]}
              small
              border
              style={{ minWidth: '2rem' }}
              color={a === pageNumberClamped ? 'primary' : 'light'}
              onClick={() => onPaginationFinal(a)}
              isLightColor={a !== pageNumberClamped}
              text={a.toString()}
            />
          )
        )}

        <Button
          title={t("Next page")}
          className={style["next-page-button"]}
          disabled={isLastPage}
          small
          width="2rem"
          color="light"
          border
          onClick={() => onPaginationFinal(pageNumberClamped + 1)}
          isLightColor={true}
        >
          <FontAwesomeIcon icon={faPlay} style={{ fontSize: '0.8rem' }} />
        </Button>

        <Button
          title={t("Last page")}
          disabled={isLastPage}
          className={style["last-page-button"]}
          small
          width="2rem"
          color="light"
          border
          isLightColor={true}
          onClick={() => onPaginationFinal(pageCount)}
        >
          <FontAwesomeIcon icon={faForwardFast} style={{ fontSize: '0.8rem' }} />
        </Button>
      </div>

      {onPageSizeChange ? (
        <div className={style['page-size']}>
          {!isCompactPagination && <label>{t('Page size')}</label>}
          <select onChange={(a) => onPageSizeChange!(Number(a.target.value))} value={pageSizeFinal}>
            {SUPPORTED_PAGE_SIZES.map((b: number) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <ShownPaginationInfo variant={paginationInfoFormat} entryCount={entryCount} pageCount={pageCountRaw} />
    </div>
  );
}

function listPages(pageNumber: number, pageCount: number, maxShow: number): number[] {
  if (pageCount <= 1) return [1];

  const result: number[] = [];

  maxShow = Math.max(3, maxShow);
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

export function ShownPaginationInfo({ variant, entryCount, pageCount, culture }: ShownPaginationInfoProps) {
  const { t } = useTranslation();
  const numberFormat = useNumberFormat(culture);
  let content: ReactNode | null = null;

  if (variant === 'none') {
    return <></>;
  }

  if (variant === 'both') {
    content = (
      <>
        <strong>{numberFormat(entryCount)}</strong> {t('Items in')} <strong>{numberFormat(pageCount)}</strong>{' '}
        {t('Pages')}
      </>
    );
  }

  if (variant === 'items') {
    content = (
      <>
        <strong>{numberFormat(entryCount)}</strong> {t('Items')}
      </>
    );
  }

  if (variant === 'pages') {
    content = (
      <>
        <strong>{numberFormat(pageCount)}</strong> {t('Pages')}
      </>
    );
  }



  return <div className={style.info}>{content}</div>;
}
