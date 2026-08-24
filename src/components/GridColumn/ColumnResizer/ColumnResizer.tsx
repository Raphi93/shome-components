'use client';

import { HTMLAttributes, useContext, useLayoutEffect, useMemo, useState } from 'react';
import clx from 'classnames';

import styles from './ColumnResizer.module.scss';
import { GridColumnContext } from '../../../context/gridContext';

export const ColumnResizer = (props: HTMLAttributes<HTMLDivElement> & { isActive?: boolean }) => {
  const { isActive, ...rest } = props;

  return (
    <div
      className={clx(styles['column-resizer'], {
        [styles['active']]: isActive,
      })}
      {...rest}
    />
  );
};

export const useResizeColumn = ({
  maxWidth,
  dataId,
  isResizeIfOverflow,
}: {
  maxWidth?: string;
  dataId?: string;
  isResizeIfOverflow?: boolean;
}) => {
  const { maxAllowedExpandedWidthFields, expandedWidthFields, setExpandedWidthFields, setCurrentlyResizingField } = useContext(GridColumnContext);

  useLayoutEffect(() => {
    if (maxWidth && dataId && !expandedWidthFields[dataId]) {
      const columnMaxWidth = parseInt(maxWidth);
      setExpandedWidthFields((prev) => ({ ...prev, [dataId]: columnMaxWidth }));
    }
  }, [dataId, maxWidth, setExpandedWidthFields, expandedWidthFields]);

  const maxExpandedWidth = maxAllowedExpandedWidthFields[dataId!];

  const startWidthNumber = maxWidth ? parseInt(maxWidth) : 0;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentlyResizingField(dataId!);

    const startX = e.clientX;

    const handleMouseMove = (event: MouseEvent) => {
      const minWidth = 50;

      const changedPosition = event.clientX - startX;

      const newWidth = Math.max(expandedWidthFields[dataId!] + changedPosition, minWidth, startWidthNumber);
      const widthWithAllowedLimits = Math.min(maxExpandedWidth, newWidth) + 2;

      setExpandedWidthFields((prev) => ({ ...prev, [dataId!]: widthWithAllowedLimits }));
    };

    const preventRowClick = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.addEventListener('click', preventRowClick, { capture: true, once: true });

      setCurrentlyResizingField(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const isResizingAvailable = !!dataId && isResizeIfOverflow && startWidthNumber < maxExpandedWidth;

  return { isResizingAvailable, handleMouseDown, expandedWidth: dataId ? expandedWidthFields[dataId] : maxWidth };
};

export const useGetColumnFieldsMaxWidth = ({ data }: { data: any[] }) => {
  const [expandedWidthFields, setExpandedWidthFields] = useState({});
  const [currentlyResizingField, setCurrentlyResizingField] = useState<string | null>(null);

  const getMaxWidthOfItem = (item: any, key: string) => {
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.innerText = item[key];
    document.body.appendChild(tempSpan);

    const itemWidth = tempSpan.offsetWidth + 16;
    document.body.removeChild(tempSpan);
    return itemWidth;
  };

  function setObjectWithValues(obj: Record<string, any>, value: any): Record<string, any> {
    const newObj: Record<string, number> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = value;
      }
    }
    return newObj;
  }

  const maxAllowedExpandedWidthFields = useMemo(() => {
    const keysToMaxWidth: Record<string, number> = {};

    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        const currentItemWidth = getMaxWidthOfItem(item, key);

        if (!keysToMaxWidth[key] || keysToMaxWidth[key] < currentItemWidth) {
          keysToMaxWidth[key] = currentItemWidth;
        }
      });
    });

    setExpandedWidthFields(setObjectWithValues(keysToMaxWidth, 0));

    return keysToMaxWidth;
  }, [data]);

  return {
    expandedWidthFields,
    setExpandedWidthFields,
    currentlyResizingField,
    setCurrentlyResizingField,
    maxAllowedExpandedWidthFields,
  };
};
