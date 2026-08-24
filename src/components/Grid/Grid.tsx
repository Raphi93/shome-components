'use client';

import { Dispatch, ReactNode, useContext, useState } from 'react';
import clx from 'classnames';

import { GridColumnContext, GridContext } from '../../context/gridContext';
import { useGetColumnFieldsMaxWidth } from '../GridColumn/ColumnResizer/ColumnResizer';
import { ActionReducer } from '../../utils/Grid.stateReducer';

import style from './Grid.module.scss';

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
