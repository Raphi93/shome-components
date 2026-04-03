'use client';

import {
  ComponentProps,
  CSSProperties,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import clx from 'classnames';

import { ThreeStateCheckbox } from '../FieldWrapper/ThreeStateCheckbox/ThreeStateCheckbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';

import { hideShowClone, setWidths, syncHorizontalScroll } from './Grid.functions';

// TODO: move to separate
import style from './Grid.module.scss';
import { GridContext } from '../../context/gridContext';
import { PaginationContext } from '../../context/paginationContext';
import { Pagination } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

export function GridHeader({ children }: { children?: ReactNode }) {
  return <div className={[style.header, 'branding-grid-header'].join(' ')}>{children}</div>;
}

export function GridHead({
  children,
  keepHeader,
  hasTr = true,
}: {
  children?: ReactNode;
  /**
   * Keeps clone of table's first row of `<th>` elements in view while scrolling, to help user with reading data from tables containing large number of rows.
   */
  keepHeader?: boolean;
  hasTr?: boolean;
}) {
  if (keepHeader) {
    return <GridHeadKeepHeader>{children}</GridHeadKeepHeader>;
  }
  return <thead>{hasTr ? <tr>{children}</tr> : <>{children}</>}</thead>;
}

function GridHeadKeepHeader({ children }: { children?: ReactNode }) {
  // Set widths for cloned header elements
  const clonedHeadRef = useRef<HTMLTableSectionElement>(null);
  const headRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    setWidths(clonedHeadRef.current!, headRef.current!);
    hideShowClone(clonedHeadRef.current!, headRef.current!);
    syncHorizontalScroll(clonedHeadRef.current!, headRef.current!);

    const onResize = () => {
      setWidths(clonedHeadRef.current!, headRef.current!);
    };

    const onScroll = () => {
      hideShowClone(clonedHeadRef.current!, headRef.current!);
    };

    window.addEventListener('scroll', onScroll);

    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });

    resizeObserver.observe(headRef.current?.parentElement?.parentElement!);
  });

  return (
    <>
      <tbody className={`${style['grid-head-clone']} ${style['js-visible']}`} ref={clonedHeadRef}>
        <tr>{children}</tr>
      </tbody>
      <thead ref={headRef} className={style.wildThing}>
        <tr>{children}</tr>
      </thead>
    </>
  );
}

export function CheckAllColumn({ styles, className }: { styles?: CSSProperties; className?: string }) {
  const { data, multiSelect, dispatchChecked, checkedList } = useContext(GridContext);

  const checkboxValue = useMemo(() => {
    if (checkedList?.length === data?.length) return true;

    if (checkedList?.length && data?.length) return null;

    return false;
  }, [checkedList?.length, data?.length]);

  if (!dispatchChecked || !checkedList) return null;

  return (
    <GridHeadColumn styles={styles} className={className}>
      {multiSelect && (
        <>
          <ThreeStateCheckbox
            isWrapped={false}
            value={checkboxValue}
            onRawChange={() => {
              dispatchChecked({
                type: !checkboxValue ? 'check-all' : 'uncheck-all',
                allValues: data.map((d) => d.id),
              });
            }}
          />
        </>
      )}
    </GridHeadColumn>
  );
}

export function GridSwitchingDatesHeadColumn({
  isUpdateDateShown,
  setIsUpdateDateShown,
  title,
  ...rest
}: { isUpdateDateShown?: boolean; setIsUpdateDateShown: Dispatch<SetStateAction<boolean>> } & ComponentProps<
  typeof GridHeadColumn
>) {
  const { t } = useTranslation();

  return (
    <GridHeadColumn {...rest}>
      <div className={style['date-column-content']}>
        <span className={style['date-column-title']}>{title}</span>

        <Tooltip>
          <TooltipTrigger
            className={style['switch-date']}
            onClick={(e) => {
              e.stopPropagation();
              setIsUpdateDateShown((prev) => !prev);
            }}
          >
            <span className={style['switch-date-icon']}>🔄</span>
          </TooltipTrigger>
          <TooltipContent>{t('Switch the column view between updated and created dates')}</TooltipContent>
        </Tooltip>
      </div>
    </GridHeadColumn>
  );
}

export function GridHeadColumn({
  title,
  sortKey,
  sortedBy,
  onSort,
  pagination,
  sticky,
  children,
  styles,
  hasMultiSort,
  className,
}: {
  /** Title */
  title?: string;
  /** Sorting key */
  sortKey?: string;
  /** Sorting by */
  sortedBy?: string;
  /** Executes a sorting function when invoked */
  onSort?: (sortKey?: string) => void;
  /** Adds pagination */
  pagination?: Pagination;
  /** Make column sticky, can be one column per table */
  sticky?: boolean;
  children?: ReactNode;
  styles?: CSSProperties;
  hasMultiSort?: boolean;
  className?: string;
}) {
  if (!sortKey) {
    return (
      <th style={styles} className={clx({ [style.stickyCol]: sticky }, className)}>
        {title}
        {children}
      </th>
    );
  }

  return (
    <GridHeadColumnPaged
      styles={styles}
      title={title}
      sortKey={sortKey}
      sortedBy={sortedBy}
      onSort={onSort}
      pagination={pagination}
      hasMultiSort={hasMultiSort}
      className={className}
    >
      {children}
    </GridHeadColumnPaged>
  );
}

export function GridHeadColumnPaged({
  title,
  sortKey,
  sortedBy,
  onSort,
  pagination,
  sticky,
  children,
  styles,
  hasMultiSort,
  className,
}: {
  title?: string;
  sortKey: string;
  sortedBy?: string;
  onSort?: (sort?: string) => void;
  pagination?: Pagination;
  sticky?: boolean;
  children?: ReactNode;
  styles?: CSSProperties;
  hasMultiSort?: boolean;
  className?: string;
}) {
  const contextPagination = useContext(PaginationContext);
  const { setSortedKeys } = useContext(GridContext);

  if (!pagination && contextPagination) {
    pagination = contextPagination;
  }

  const effectiveSortedBy = sortedBy ?? pagination?.sort ?? '';
  const effectiveOnSort = onSort ?? pagination?.setSort;

  const handleMultiSort = () => {
    const sortedKeys = effectiveSortedBy ? effectiveSortedBy.split(',').filter(Boolean) : [];
    const currentSortIndex = sortedKeys.findIndex((key) => key.startsWith(sortKey));
    const isSortedBy = currentSortIndex !== -1;

    let isSortedDesc = false;
    if (isSortedBy) {
      isSortedDesc = sortedKeys[currentSortIndex].endsWith(' DESC');
    }

    const newSortKeys = [...sortedKeys];

    if (isSortedBy) {
      if (isSortedDesc) {
        // DESC -> remove
        newSortKeys.splice(currentSortIndex, 1);
      } else {
        // ASC -> DESC
        newSortKeys[currentSortIndex] = `${sortKey} DESC`;
      }
    } else {
      // not sorted -> ASC
      newSortKeys.push(sortKey);
    }

    const nextSort = newSortKeys.join(',');
    effectiveOnSort?.(nextSort ? nextSort : undefined);
  };

  const handleSingleSort = () => {
    const current = (effectiveSortedBy ?? '').trim();

    const isAsc = current === sortKey;
    const isDesc = current === `${sortKey} DESC`;

    // ASC -> DESC
    if (isAsc) {
      effectiveOnSort?.(`${sortKey} DESC`);
      return;
    }

    // DESC -> NONE (sort löschen)
    if (isDesc) {
      effectiveOnSort?.(undefined);
      return;
    }

    // NONE oder anderer Key -> ASC
    effectiveOnSort?.(sortKey);
  };

  const isSorted = hasMultiSort
    ? effectiveSortedBy
        ?.split(',')
        .filter(Boolean)
        .some((key) => key.startsWith(sortKey))
    : sortKey === (effectiveSortedBy?.endsWith(' DESC') ? effectiveSortedBy.substring(0, effectiveSortedBy.length - 5) : effectiveSortedBy);

  const isSortedDesc = hasMultiSort
    ? effectiveSortedBy
        ?.split(',')
        .filter(Boolean)
        .find((key) => key.startsWith(sortKey))
        ?.endsWith(' DESC')
    : effectiveSortedBy?.endsWith(' DESC') && isSorted;

  const classes = [style.sortable, className].filter(Boolean);

  useEffect(() => {
    if (isSorted) {
      setSortedKeys?.((prev) => Array.from(new Set([...prev, sortKey])));
    } else {
      setSortedKeys?.((prev) => prev.filter((key) => key !== sortKey));
    }
  }, [isSorted, setSortedKeys, sortKey]);

  if (isSorted) {
    classes.push(isSortedDesc ? style['sorted-desc'] : style.sorted);
  }

  return (
    <th
      style={styles}
      className={classes.join(' ')}
      onClick={hasMultiSort ? handleMultiSort : handleSingleSort}
    >
      {title}
      {children}
      {isSorted && <FontAwesomeIcon icon={isSortedDesc ? faArrowDown : faArrowUp} />}
    </th>
  );
}