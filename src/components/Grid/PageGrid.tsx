import React, { useMemo } from "react";
import { Grid } from "./Grid";
import type { ColumnDef, GridProps } from "./Grid";
import "./PageGrid.css";

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

export interface PageGridProps
    extends Pick<
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
    maximumButtonCount?: number;
    compact?: boolean;
    pageSizes?: number[];
    showSizes?: boolean;
    showInfo?: boolean;
    children: React.ReactNode;
}

function buildPageListExact(current: number, total: number, maxNums: number): (number | -1)[] {
  const max = Math.max(3, Number.isFinite(maxNums) ? Math.floor(maxNums) : 3); // mind. 3
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

  const innerCount = max - 2;                 // Zahlen zwischen 1 und last
  const half = Math.floor(innerCount / 2);

  let start = current - half;
  let end   = start + innerCount - 1;

  // in den Bereich [2 .. total-1] clampen
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
    children,
}) => {
    const page = Math.max(1, pagination.pageNumber || 1);
    const size = Math.max(1, pagination.pageSize || 25);

    const totalPages = Math.max(1, Math.ceil(totalCount / size));
    const current = Math.min(page, totalPages);
    const pages = useMemo(
        () => buildPageListExact(current, totalPages, Math.max(5, maximumButtonCount)),
        [current, totalPages, maximumButtonCount]
    );

    const changePage = (p: number) => pagination.setPageNumber(Math.min(Math.max(1, p), totalPages));
    const changeSize = (s: number) => pagination.setPageSize(Math.max(1, s));

    return (
        <section
            className={[
                "page-grid",
                compact ? "page-grid--compact" : "",
                secondary ? "page-grid--secondary" : "",
            ].join(" ")}
        >
            {showInfo && (
                <div className="page-grid__count">
                    {totalCount.toLocaleString("de-CH")} Items
                </div>
            )}

            {/* Grid */}
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

            {/* Bottom bar: pager left, page size right */}
            <div className="page-grid__bar">
                <nav className="page-grid__pager" aria-label="Pagination">
                    <div className="page-grid__group">
                        <button className="page-grid__item" disabled={current === 1} onClick={() => changePage(1)} title="Erste Seite">«</button>
                        <button className="page-grid__item" disabled={current === 1} onClick={() => changePage(current - 1)} title="Zurück">‹</button>

                        {pages.map((p, i) =>
                            p === -1 ? (
                                <span key={`ellipsis-${i}`} className="page-grid__item page-grid__ellipsis">…</span>
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

                        <button className="page-grid__item" disabled={current === totalPages} onClick={() => changePage(current + 1)} title="Weiter">›</button>
                        <button className="page-grid__item" disabled={current === totalPages} onClick={() => changePage(totalPages)} title="Letzte Seite">»</button>
                    </div>
                </nav>

                {showSizes && (
                    <div className="page-grid__sizes">
                        <span className="page-grid__sizes-label">Seitenformat</span>
                        <select
                            className="page-grid__select"
                            value={size}
                            onChange={(e) => changeSize(Number(e.target.value))}
                        >
                            {pageSizes.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </section>
    );
};
