import React, { useMemo, useState, useEffect } from "react";
import "./Grid.css";

export type ColumnType = "string" | "number" | "date" | "dateTime" | "node";

export interface ColumnDef {
    key: string;
    label: string;
    type?: ColumnType;
    format?: (value: any, row: any) => React.ReactNode;
    width?: string;
    align?: "left" | "right" | "center";
    hideOn?: "tablet" | "mobile" | "all";
    percentKey?: string;
}

export interface GridProps {
    rows: any[];
    columns: ColumnDef[];
    rowKey?: string;
    zebra?: boolean;
    dense?: boolean;
    minTableWidth?: number;
    onRowClick?: (row: any) => void;
    borders?: "row" | "all" | "none";
    selectable?: boolean;
    selectedKeys?: Array<string | number>;
    onSelectionChange?: (keys: Array<string | number>) => void;
    secondary?: boolean;
}

const nf = new Intl.NumberFormat();
const byType: Record<ColumnType, (v: any) => React.ReactNode> = {
    string: (v) => v ?? "",
    number: (v) => (typeof v === "number" ? nf.format(v) : v ?? ""),
    date: (v) => (v ? new Date(v).toLocaleDateString() : ""),
    dateTime: (v) => (v ? new Date(v).toLocaleString() : ""),
    node: (v) => v,
};

export const Grid: React.FC<GridProps> = ({
    rows,
    columns,
    rowKey = "id",
    zebra = true,
    dense = false,
    minTableWidth = 980,
    onRowClick,
    borders = "row",
    selectable = false,
    selectedKeys,
    onSelectionChange,
    secondary = false,
}) => {
    const [internalSelected, setInternalSelected] = useState<Array<string | number>>([]);

    const isControlled = Array.isArray(selectedKeys);
    const selected = isControlled ? (selectedKeys as Array<string | number>) : internalSelected;
    useEffect(() => {
        if (isControlled) return;
        // reset Auswahl wenn rows wechseln
        setInternalSelected([]);
    }, [rows, isControlled]);

    const allKeys = useMemo(
        () => rows.map((r) => (r?.[rowKey] ?? r?.id ?? String(Math.random())) as string | number),
        [rows, rowKey]
    );

    const isAllSelected = selectable && selected.length > 0 && selected.length === allKeys.length;

    const setSelected = (next: Array<string | number>) => {
        if (isControlled) onSelectionChange?.(next);
        else setInternalSelected(next);
    };

    const toggleAll = () => {
        if (!selectable) return;
        setSelected(isAllSelected ? [] : allKeys);
    };

    const toggleOne = (key: string | number) => {
        if (!selectable) return;
        const set = new Set(selected);
        set.has(key) ? set.delete(key) : set.add(key);
        setSelected(Array.from(set));
    };

    const cellAlign = (c: ColumnDef) =>
        c.align ?? (c.type === "number" || c.label === "%" ? "right" : "left");

    return (
        <section
            className={[
                "grid",
                zebra ? "grid--zebra" : "",
                dense ? "grid--dense" : "",
                borders === "all" ? "grid--all-borders" : "",
                borders === "none" ? "grid--no-borders" : "",
                secondary ? "grid--secondary" : "", // NEW
            ].join(" ")}
        >
            <div className="grid__scroll" style={{ minWidth: minTableWidth }}>
                <table className="grid__table">
                    <thead>
                        <tr>
                            {selectable && (
                                <th className="grid__th grid__th--select" style={{ width: "3rem" }}>
                                    <input
                                        type="checkbox"
                                        aria-label="Alle auswählen"
                                        checked={isAllSelected}
                                        onChange={toggleAll}
                                    />
                                </th>
                            )}
                            {columns.map((c) => (
                                <th
                                    key={c.key}
                                    className={`grid__th ${c.hideOn ? `grid-hide-${c.hideOn}` : ""}`}
                                    style={{ width: c.width }}
                                    title={c.label}
                                >
                                    {c.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => {
                            const key = (row?.[rowKey] ?? i) as string | number;
                            const clickable = !!onRowClick;
                            return (
                                <tr
                                    key={key}
                                    className={clickable ? "grid__tr grid__tr--click" : "grid__tr"}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {selectable && (
                                        <td className="grid__td grid__td--select" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                aria-label="Zeile auswählen"
                                                checked={selected.includes(key)}
                                                onChange={() => toggleOne(key)}
                                            />
                                        </td>
                                    )}
                                    {columns.map((c) => {
                                        const raw = row[c.key];
                                        const base = c.format ? c.format(raw, row) : byType[c.type ?? "string"](raw);
                                        const percent =
                                            c.percentKey && row[c.percentKey] != null ? `${row[c.percentKey]}%` : null;
                                        return (
                                            <td
                                                key={`${key}-${c.key}`}
                                                className={[
                                                    "grid__td",
                                                    `grid__td--${cellAlign(c)}`,
                                                    c.hideOn ? `grid-hide-${c.hideOn}` : "",
                                                ].join(" ")}
                                                style={{ width: c.width }}
                                            >
                                                {base}
                                                {percent && <span className="grid__percent">{percent}</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};