// stories/PageGrid.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import React, { useMemo, useState } from "react";

// Pfade ggf. anpassen:
import { PageGrid } from "../../components/Grid/PageGrid";
import type { Pagination } from "../../components/Grid/PageGrid";
import type { ColumnDef } from "../../components/Grid/Grid";

/* --------------------------------------------
   Columns (gleich wie im einfachen Grid)
--------------------------------------------- */
const columns: ColumnDef[] = [
    { key: "addressNumber", label: "Adressnummer", width: "12rem" },
    { key: "name", label: "Name" },
    { key: "status", label: "Status", width: "8rem", align: "center" },
    { key: "language", label: "Sprache", width: "7rem", align: "center" },
];

/* --------------------------------------------
   Demo-Daten (wir simulieren ein Backend)
--------------------------------------------- */
type Row = { id: number; addressNumber: string; name: string; status: "aktiv" | "inaktiv"; language: "🇩🇪" | "🇫🇷" | "🇮🇹" | "🇬🇧" };

const ALL_DATA: Row[] = Array.from({ length: 250 }, (_, i) => {
    const id = i + 1;
    const langs = ["🇩🇪", "🇫🇷", "🇮🇹", "🇬🇧"];
    const statuses = ["aktiv", "inaktiv"] as const;
    return {
        id,
        addressNumber: String(13000000 + id),
        name: `Kontakt ${id}, ${1000 + (id % 9000)} Musterstadt`,
        status: statuses[id % 7 === 0 ? 1 : 0],
        language: langs[id % langs.length] as Row["language"],
    };
});

/* sehr simpler Sorter: "name" | "addressNumber" | "status" | "language" | ""  */
function sortRows(rows: Row[], sort: string) {
    switch (sort) {
        case "name": return [...rows].sort((a, b) => a.name.localeCompare(b.name));
        case "addressNumber": return [...rows].sort((a, b) => a.addressNumber.localeCompare(b.addressNumber));
        case "status": return [...rows].sort((a, b) => a.status.localeCompare(b.status));
        case "language": return [...rows].sort((a, b) => a.language.localeCompare(b.language));
        default: return rows;
    }
}

/* Filter: substring (case-insensitive) auf name + addressNumber */
function filterRows(rows: Row[], filter: string) {
    const f = (filter ?? "").trim().toLowerCase();
    if (!f) return rows;
    return rows.filter(r =>
        r.name.toLowerCase().includes(f) ||
        r.addressNumber.toLowerCase().includes(f)
    );
}

/* --------------------------------------------
   Storybook Meta
--------------------------------------------- */
const meta: Meta<typeof PageGrid> = {
    title: "sHome Components/Grid/PageGrid",
    component: PageGrid,
    parameters: { layout: "fullscreen" },
    argTypes: {
        selectable: { control: "boolean" },
        zebra: { control: "boolean" },
        dense: { control: "boolean" },
        borders: { control: { type: "select" }, options: ["row", "all", "none"] },
        secondary: { control: "boolean" },
        compact: { control: "boolean" },
        maximumButtonCount: { control: "number" },
        pageSizes: { control: "object" },
    },
    args: {
        selectable: true,
        zebra: true,
        dense: false,
        borders: "row",
        secondary: false,
        compact: false,
        maximumButtonCount: 7,
        pageSizes: [10, 25, 50, 100],
    },
};
export default meta;

type Story = StoryObj<typeof PageGrid>;

/* --------------------------------------------
   Basic (server-seitig kontrolliert, simuliert)
--------------------------------------------- */
export const Basic: Story = {
    render: (args) => {
        // Pagination-State wie in deinem Typ
        const [pageNumber, setPageNumber] = useState<number>(1);
        const [pageSize, setPageSize] = useState<number>(25);
        const [filter, setFilter] = useState<string>("");
        const [sort, setSort] = useState<string>("");

        // „Backend“-Berechnung (synchron simuliert)
        const { pageData, totalCount } = useMemo(() => {
            const filtered = filterRows(ALL_DATA, filter);
            const sorted = sortRows(filtered, sort);
            const total = sorted.length;
            const start = (pageNumber - 1) * pageSize;
            const end = start + pageSize;
            return { pageData: sorted.slice(start, end), totalCount: total };
        }, [pageNumber, pageSize, filter, sort]);

        const pagination: Pagination = {
            pageNumber,
            pageSize,
            filter,
            sort,
            setPageNumber,
            setPageSize,
            setFilter: (newFilter: string | undefined) => setFilter(newFilter ?? ""),
            setSort: (newSort: string | undefined) => setSort(newSort ?? ""),
        };

        // Layout auf 90% Breite + Max-Width-Var für dein Grid-Scroll
        const wrapStyle = {
            width: "90vw",
            margin: "2rem auto",
            ["--layout-content-max-width" as any]: "90vw",
        } as React.CSSProperties & Record<string, string>;


        return (
            <div style={wrapStyle}>
                {/* Simple Filter/Sort UI für die Demo */}

                <PageGrid
                    {...args}
                    columns={columns}
                    data={pageData}
                    totalCount={totalCount}
                    pagination={pagination}
                    maximumButtonCount={args.maximumButtonCount}
                />
            </div>
        );
    },
};
