import React from "react";
import classNames from "classnames";

import styles from "./FieldSet.module.scss";

export type FieldSetProps = {
  title: string;
  children: React.ReactNode;
  headerChildren?: React.ReactNode;
  headerClassName?: string;
  className?: string;
  childrenClassName?: string;
  disabled?: boolean;
};

export function FieldSet({
  title,
  children,
  headerChildren,
  headerClassName,
  className,
  childrenClassName,
  disabled,
}: FieldSetProps) {
  return (
    <fieldset
      className={classNames(styles["header-cards-container"], styles["special-card"], className)}
      disabled={disabled}
    >
      <div className={classNames(styles["header-container"], headerClassName)}>
        <div className={styles["header-title"]}>{title}</div>
        {headerChildren && <div className={styles["header-children"]}>{headerChildren}</div>}
      </div>

      <div className={classNames(styles["children-container"], childrenClassName)}>{children}</div>
    </fieldset>
  );
}

export type sizeType = 10 | 20 | 25 | 30 | 40 | 50 | 60 | 70 | 75 | 80 | 90 | 100;

export const sizeMapper: Record<string, sizeType> = {
  xxs: 10,
  xs: 20,
  s: 25,
  m: 30,
  l: 50,
  xl: 70,
  xxl: 75,
  xxxl: 100,
};

export function FieldSetColumn({
  size,
  minWidth,
  children,
  className,
}: {
  size: sizeType;
  minWidth?: number | string;
  children: React.ReactNode;
  className?: string;
}) {
  const mw = typeof minWidth === "number" ? `${minWidth}px` : minWidth;

  return (
    <div
      className={classNames(styles["field-set-column"], styles[`size-${size}`], className)}
      style={mw ? ({ ["--fsc-min-width" as any]: mw } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}