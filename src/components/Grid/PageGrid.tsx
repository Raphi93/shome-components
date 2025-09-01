import React, { useMemo } from "react";
import { Grid } from "./Grid";
import type { ColumnDef, GridProps } from "./Grid";
import "./PageGrid.css";
import { Select, SelectOption, SelectValue } from "../Input/Select/Select";

export type Pagination = {
  pageNumber: number;
  pageSize: number;
  filter: string;
  sort: string;
  setPageSize: (newPageSize: number) => void;
  setPageNumber: (newPageNumber: number) => void;
  setFilter: (newFilter: string | undefined) => void;
  setSort: (newSort: string | undefined) => void;
};

type LocaleLike = string | string[] | undefined;

export interface PageGridProps extends Pick<
  GridProps,
  | "rowKey"
  | "zebra"
  | "dense"
  | "borders"
  | "selectable"
  | "onRowClick"
  | "secondary"
  | "minTableWidth"
> {
  columns?: ColumnDef[];
  data?: any[];
  totalCount: number;
  pagination: Pagination;
  withoutGrid?: boolean;
  children?: React.ReactNode;
  maximumButtonCount?: number;
  compact?: boolean;
  pageSizes?: number[];
  showSizes?: boolean;
  showInfo?: boolean;
  itemsLabel?: string | ((count: number, formatted: string) => React.ReactNode);
  pageSizeLabel?: string;
  countLocale?: LocaleLike;
  countFormatter?: (count: number) => string;
}

function buildPageListExact(current: number, total: number, maxNums: number): (number | -1)[] {
  const max = Math.max(3, Number.isFinite(maxNums) ? Math.floor(maxNums) : 3);
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  const innerCount = max - 2;
  const half = Math.floor(innerCount / 2);
  let start = current - half;
  let end = start + innerCount - 1;
  if (start < 2) {
    start = 2;
    end = start + innerCount - 1;
  }
  if (end > total - 1) {
    end = total - 1;
    start = end - innerCount + 1;
  }
  const list: (number | -1)[] = [1];
  if (start > 2) list.push(-1);
  for (let p = start; p <= end; p++) list.push(p);
  if (end < total - 1) list.push(-1);
  list.push(total);
  return list;
}

export const PageGrid: React.FC<PageGridProps> = ({
  columns,
  data,
  totalCount,
  pagination,
  rowKey = "id",
  zebra = true,
  dense = false,
  borders = "row",
  selectable = false,
  onRowClick,
  secondary = false,
  minTableWidth = 980,
  withoutGrid = false,
  maximumButtonCount = 5,
  compact = false,
  pageSizes = [5, 10, 25, 50, 100, 200, 1000],
  showSizes = true,
  showInfo = true,
  itemsLabel = "Items",
  pageSizeLabel = "Page Size",
  countLocale = "de-CH",
  countFormatter,
  children,
}) => {
  const page = Math.max(1, pagination.pageNumber || 1);
  const size = Math.max(1, pagination.pageSize || 25);
  const totalPages = Math.max(1, Math.ceil(totalCount / size));
  const current = Math.min(page, totalPages);

  const sizeOptions: SelectOption[] = useMemo(
    () => pageSizes.map((s) => ({ value: String(s), label: String(s) })),
    [pageSizes]
  );

  const pages = useMemo(
    () => buildPageListExact(current, totalPages, Math.max(3, maximumButtonCount)),
    [current, totalPages, maximumButtonCount]
  );

  const formattedCount = useMemo(() => {
    if (typeof countFormatter === "function") return countFormatter(totalCount);
    try {
      return totalCount.toLocaleString(countLocale);
    } catch {
      return totalCount.toLocaleString();
    }
  }, [totalCount, countLocale, countFormatter]);

  const itemsNode =
    typeof itemsLabel === "function"
      ? itemsLabel(totalCount, formattedCount)
      : <>{formattedCount} {itemsLabel}</>;

  const changePage = (p: number) => pagination.setPageNumber(Math.min(Math.max(1, p), totalPages));
  const changeSize = (newSize: number) => { pagination.setPageSize(newSize); pagination.setPageNumber(1); };

  const onPageSizeChange = (val: SelectValue) => {
    const v = Array.isArray(val) ? val[0] : val;
    if (v) changeSize(Number(v));
  };

  return (
    <section className={["page-grid", compact ? "page-grid--compact" : "", secondary ? "page-grid--secondary" : ""].join(" ")}>
      <div className="page-grid__wrap">
        {showInfo && <div className="page-grid__count">{itemsNode}</div>}

        {!withoutGrid ? (
          <Grid
            columns={columns ?? []}
            rows={data ?? []}
            rowKey={rowKey}
            zebra={zebra}
            dense={dense}
            borders={borders}
            selectable={selectable}
            onRowClick={onRowClick}
            secondary={secondary}
            minTableWidth={minTableWidth}
          />
        ) : (
          <>{children}</>
        )}

        <div className="page-grid__bar">
          <nav className="page-grid__pager" aria-label="Pagination">
            <div className="page-grid__group">
              <button className="page-grid__item" disabled={current === 1} onClick={() => changePage(1)}>«</button>
              <button className="page-grid__item" disabled={current === 1} onClick={() => changePage(current - 1)}>‹</button>

              {pages.map((p, i) =>
                p === -1 ? (
                  <span key={`e-${i}`} className="page-grid__item page-grid__ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={["page-grid__item", p === current ? "is-active" : ""].join(" ")}
                    onClick={() => changePage(p)}
                  >
                    {p}
                  </button>
                )
              )}

              <button className="page-grid__item" disabled={current === totalPages} onClick={() => changePage(current + 1)}>›</button>
              <button className="page-grid__item" disabled={current === totalPages} onClick={() => changePage(totalPages)}>»</button>
            </div>
          </nav>

          {showSizes && (
            <div className="page-grid__sizes">
              <span className="page-grid__sizes-label">{pageSizeLabel}</span>
              <div style={{ minWidth: 90 }}>
                <Select
                  options={sizeOptions}
                  value={String(size)}
                  onChange={onPageSizeChange}
                  multiple={false}
                  searchable={false}
                  clearable={false}
                  placeholder={pageSizeLabel}
                  secondary={secondary}
                  name="pageSize"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
