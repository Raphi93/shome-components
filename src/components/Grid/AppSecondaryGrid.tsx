import React, { CSSProperties } from 'react';

import styles from './AppSecondaryGrid.module.scss';
import { Grid, GridProps, PagedGridProps } from './Grid';
import { PaginationContext } from '../../context/paginationContext';
import { Pager, ShownPaginationInfo } from '../Pager';

type Props = GridProps & {
  isShown?: boolean;
  title?: string;
};

export const secondaryGridColors: CSSProperties = {
  color: 'var(--grid-head-color-secondary)',
  backgroundColor: 'var(--grid-head-background-secondary)',
  fontWeight: 'bold',
  fontSize: '1rem',
}

/**
 * AppSecondaryGrid component.
 *
 * Renders a secondary grid section with an optional title. If `isShown` is false,
 * the component returns null and nothing is rendered.
 *
 * The component always renders a Grid with the following props set:
 * - isHeaderColorsInverted
 * - compact
 * - fixedHead
 *
 * Any additional props provided are forwarded to the underlying Grid component.
 *
 * @param props.isShown - Controls visibility of the component. When false, returns null. Defaults to true.
 * @param props.title - Optional title text rendered as an <h2> above the Grid. When provided, it uses `styles.contentTitle`.
 * @param props.children - Child nodes rendered inside the Grid.
 * @param props.rest - Additional props forwarded to the Grid component.
 *
 * @returns JSX.Element | null
 */
export function AppSecondaryGrid({ isShown = true, title, children, ...rest }: Props) {
  if (!isShown) {
    return null;
  }

  return (
    <>
      {title && <h2 className={styles.contentTitle}>{title}</h2>}

      <Grid isHeaderColorsInverted compact fixedHead {...rest}>
        {children}
      </Grid>
    </>
  );
}

/**
 * Props for the AppSecondaryPagedGrid component.
 *
 * Extends PagedGridProps with additional presentation and paging defaults
 * specific to the "secondary" grid variant used in the application.
 *
 * @property isShown - If false, the grid should not be rendered. Defaults to true when omitted.
 * @property isHeaderColorsInverted - When true, the header color scheme is inverted (useful for dark backgrounds).
 * @property compact - When true, the grid uses a compact layout (reduced spacing and row heights).
 * @property defaultPageSize - Default number of items to display per page when the parent does not control paging. Should be a positive integer.
 *
 * @remarks
 * - All properties are optional; the component should provide sensible defaults when values are not supplied.
 * - This type extends PagedGridProps, so include any paging-related configuration from that base type when using these props.
 */
export type AppSecondaryPagedGridProps = PagedGridProps & {
  isShown?: boolean;
  isHeaderColorsInverted?: boolean;
  compact?: boolean;
  defaultPageSize?: number;
};
export function AppSecondaryPagedGrid({
  totalCount,
  pagination,
  children,
  paginationTopInfoVariant = 'none',
  paginationBottomInfoVariant = 'both',
  maximumButtonCount = 10,
  isCompactPagination = false,
  isHeaderColorsInverted = true,
  compact = true,
  isShown = true,
  defaultPageSize = 25,
  culture,
}: AppSecondaryPagedGridProps) {
  const pageCount = Math.ceil(totalCount / pagination.pageSize);

  const isCurrentPageSizeLessThenDefault = pagination.pageSize < defaultPageSize;
  const isPaginationShown =
    totalCount > defaultPageSize || (isCurrentPageSizeLessThenDefault && totalCount > pagination.pageSize);

  if (!isShown) {
    return null;
  }

  return (
    <PaginationContext.Provider value={pagination}>
      {paginationTopInfoVariant !== 'none' && (
        <div className={styles['top-pagination-info']}>
          <ShownPaginationInfo variant={paginationTopInfoVariant} pageCount={pageCount} entryCount={totalCount} culture={culture} />
        </div>
      )}
      <Grid hasPagination={true} compact={compact} isHeaderColorsInverted={isHeaderColorsInverted}>
        {children}
      </Grid>
      {isPaginationShown && (
        <Pager
          isCompactPagination={isCompactPagination}
          maximumButtonCount={maximumButtonCount}
          entryCount={totalCount}
          isConnected={true}
          paginationInfoFormat={paginationBottomInfoVariant}
        />
      )}
    </PaginationContext.Provider>
  );
}
