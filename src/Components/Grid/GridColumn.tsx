'use client';

import { ComponentProps, CSSProperties, ReactNode, useContext } from 'react';
import clx from 'classnames';

import { GridColumnContext, GridContext } from '../../context/gridContext';
import { Checkbox } from '../FieldWrapper/Checkbox';

import { ColumnResizer, useResizeColumn } from './ColumnResizer/ColumnResizer';

import styles from './Grid.module.scss';

export function GridColumn({
  children,
  dataId,
  className,
  width,
  minWidth,
  maxWidth,
  align,
  verticalAlign,
  sticky,
  onClick,
  styles: customStyles,
  isResizeIfOverflow,
}: {
  children?: ReactNode | ((item: any) => ReactNode);
  dataId?: string;
  className?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  sticky?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  styles?: CSSProperties;
  isResizeIfOverflow?: boolean;
}) {
  const { item, currentlyResizingField } = useContext(GridColumnContext);
  const { sortedKeys } = useContext(GridContext);

  const isColumnSorted = dataId && sortedKeys?.includes(dataId);

  const { isResizingAvailable, handleMouseDown, expandedWidth } = useResizeColumn({
    isResizeIfOverflow,
    dataId,
    maxWidth,
  });

  const style: CSSProperties = {
    width: isResizingAvailable ? expandedWidth : width,
    minWidth,
    maxWidth: isResizingAvailable ? expandedWidth : maxWidth,
    textAlign: align,
    verticalAlign,
    ...customStyles,
  };

  return (
    <td
      className={clx(
        {
          [styles.stickyCol]: sticky,
          [styles.expandedCol]: isResizeIfOverflow,
          [styles.sortedColumn]: isColumnSorted,
        },
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children
        ? typeof children === 'function'
          ? children(item)
          : children
        : dataId
          ? item[dataId]
          : 'dataId not found'}
      {isResizingAvailable && (
        <ColumnResizer isActive={currentlyResizingField === dataId!} onMouseDown={handleMouseDown} />
      )}
    </td>
  );
}

export function CheckColumn({ className, ...rest }: ComponentProps<typeof GridColumn>) {
  const { dispatchChecked, checkedList } = useContext(GridContext);
  const { item } = useContext(GridColumnContext);

  if (!dispatchChecked || !checkedList) return null;

  const onPropagation = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    <GridColumn onClick={onPropagation} className={clx(styles.autoCursor, className)} {...rest}>
      <Checkbox
        isWrapped={false}
        value={checkedList.includes(item.id)}
        onChange={(e) => dispatchChecked({ type: e.target.checked ? 'add' : 'remove', value: item.id })}
      />
    </GridColumn>
  );
}
