import { Dispatch, ReactNode, useContext, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clx from 'classnames';

import { GridColumnContext, GridContext } from '../../context/gridContext';
import { PaginationContext } from '../../context/paginationContext';
import { Pager, ShownPaginationInfo, TPaginationInfoVariant } from '../Pager/Pager';


import style from './Grid.module.scss';
import { useGetColumnFieldsMaxWidth } from './ColumnResizer/ColumnResizer';
import { ActionReducer, checkedReducer, checkedSingleReducer } from './stateReducer';
import { Pagination } from '../..';

export const TableEmptyImage = () => {
  return (
    <svg width="80" viewBox="0 0 184 152" xmlns="http://www.w3.org/2000/svg">
      <title>No data</title>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(24 31.67)">
          <ellipse fillOpacity=".8" fill="#F5F5F7" cx="67.797" cy="106.89" rx="67.797" ry="12.668"></ellipse>
          <path
            d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            fill="#AEB8C2"
          ></path>
          <path
            d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z"
            fill="url(#linearGradient-1)"
            transform="translate(13.56)"
          ></path>
          <path
            d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            fill="#F5F5F7"
          ></path>
          <path
            d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            fill="#DCE0E6"
          ></path>
        </g>
        <g transform="translate(149.65 15.383)" fill="#FFF">
          <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815"></ellipse>
          <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"></path>
        </g>
      </g>
    </svg>
  );
};


export type GridProps = {
  children?: ReactNode;
  /**
   * Adds pagination
   */
  hasPagination?: boolean;
  /**
   * Visual variant for conserving space
   */
  compact?: boolean;
  /**
   * Text inside TH is vertical
   */
  verticalHead?: boolean;
  /**
   * Inputs in table will stretch to 100% width of column
   */
  inputFullWidth?: boolean;
  /**
   * Grid width is defined by its content and is not stretched to maximum possible width
   */
  autoWidth?: boolean;
  /**
   * Adds clone of GridHead to stay fixed while scrolling through its content
   */
  fixedHead?: boolean;
  /**
   * Remove row highlighting on hover
   */
  noHover?: boolean;
  /**
   * Keeps clone of table's first row of `<th>` elements in view while scrolling, to help user with reading data from tables containing large number of rows.
   */
  keepHeader?: boolean;
  /** Table data array */
  data?: any;
  /** Allow multiple checkbox selections */
  multiSelect?: boolean;
  /** External state of checked items list */
  checkedList?: string[];
  /** External dispatcher for checked items list */
  dispatchChecked?: Dispatch<ActionReducer>;
  className?: string;
  isHeaderColorsInverted?: boolean;
  hasTableTag?: boolean;
};

export function Grid({
  children,
  hasPagination,
  compact,
  inputFullWidth,
  verticalHead,
  autoWidth,
  fixedHead,
  noHover,
  keepHeader,
  multiSelect,
  data,
  checkedList,
  dispatchChecked,
  className,
  isHeaderColorsInverted,
  hasTableTag = true,
}: GridProps) {
  const classes = getGridWrapperClass(
    hasPagination,
    compact,
    inputFullWidth,
    verticalHead,
    autoWidth,
    fixedHead,
    noHover,
    hasTableTag
  );

  const tableClasses = getGridClass(keepHeader);
  const [sortedKeys, setSortedKeys] = useState<string[]>([]);

  return (
    <div className={clx(classes.join(' '), { [style.inverted]: isHeaderColorsInverted }, className)}>
      <GridContext.Provider
        value={{
          multiSelect: multiSelect ?? false,
          data,
          checkedList,
          dispatchChecked,
          sortedKeys,
          setSortedKeys,
        }}
      >
        {hasTableTag ? <table className={tableClasses.join(' ')}>{children}</table> : <div>{children}</div>}
      </GridContext.Provider>
    </div>
  );
}

function getGridClass(keepHeader: boolean | undefined) {
  const tableClasses = [style.grid, 'branding-grid'];
  if (keepHeader) {
    tableClasses.push('keepHeader');
  }
  return tableClasses;
}

function getGridWrapperClass(
  hasPagination: boolean | undefined,
  compact: boolean | undefined,
  inputFullWidth: boolean | undefined,
  verticalHead: boolean | undefined,
  autoWidth: boolean | undefined,
  fixedHead: boolean | undefined,
  noHover: boolean | undefined,
  hasTableTag: boolean | undefined
) {
  const classes = [hasTableTag ? style.responsive : ''];
  if (hasPagination) {
    classes.push(style['has-pagination']);
  }

  if (compact) {
    classes.push(style.compact);
  }

  if (inputFullWidth) {
    classes.push(style['input-full-width']);
  }

  if (verticalHead) {
    classes.push(style['vertical-head']);
  }

  if (autoWidth) {
    classes.push(style['auto-width']);
  }

  if (fixedHead) {
    classes.push(style['fixed-head']);
  }

  if (noHover) {
    classes.push(style['no-hover']);
  }
  return classes;
}

export function GridFiltration({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={clx(style.filtration, className)}>{children}</div>;
}

export function GridBody({ children, className }: { children?: ReactNode; className?: string }) {
  return <tbody className={className}>{children}</tbody>;
}

export function GridDataBody({
  children,
  handleRowClick,
  className,
}: {
  children?: ReactNode;
  handleRowClick?: (item: any) => void;
  className?: string;
}) {
  const { data, checkedList } = useContext(GridContext);

  const {
    maxAllowedExpandedWidthFields,
    expandedWidthFields,
    setExpandedWidthFields,
    currentlyResizingField,
    setCurrentlyResizingField,
  } = useGetColumnFieldsMaxWidth({ data });

  return (
    <tbody className={className}>
      {data &&
        data.map((item: any) => {
          return (
            <GridColumnContext.Provider
              value={{
                item,
                maxAllowedExpandedWidthFields,
                expandedWidthFields,
                setExpandedWidthFields,
                currentlyResizingField,
                setCurrentlyResizingField,
              }}
              key={`row_${item.id}`}
            >
              <tr
                onClick={() => handleRowClick?.(item)}
                className={clx({
                  [style.row]: true,
                  [style.pointer]: !!handleRowClick,
                  [style.checked]: checkedList?.find((id) => id === item.id),
                })}
              >
                {children}
              </tr>
            </GridColumnContext.Provider>
          );
        })}
    </tbody>
  );
}

export function EmptyGrid(params: Parameters<typeof Grid>[0]) {
  const { t } = useTranslation();
  return (
    <Grid {...params}>
      <GridBody>
        <tr>
          <td
            style={{
              boxShadow: 'none',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              alignItems: 'center',
              justifyItems: 'center',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div style={{ padding: '20px' }}>
              <TableEmptyImage />
            </div>
            <div style={{ color: 'var(--color-gray-600)' }}>{t('No data')}</div>
          </td>
        </tr>
      </GridBody>
    </Grid>
  );
}

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
