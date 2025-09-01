// stories/PageGrid.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import React, { useMemo, useState } from "react";

// adjust paths if needed:
import { PageGrid } from "../../components/Grid/PageGrid";
import type { Pagination } from "../../components/Grid/PageGrid";
import type { ColumnDef } from "../../components/Grid/Grid";

/**
 * Column model (same as Grid)
 * ```
 * export type ColumnDef = {
 *   key: string;
 *   label: string;
 *   width?: string;
 *   align?: "left" | "center" | "right";
 * };
 * ```
 *
 * PageGrid props (high-level)
 * - `columns: ColumnDef[]`
 * - `data: any[]` (current page slice)
 * - `totalCount: number` (for pager)
 * - `pagination: Pagination` (controlled state)
 * - `selectable?: boolean`
 * - `zebra?: boolean`
 * - `dense?: boolean`
 * - `borders?: "row" | "all" | "none"`
 * - `secondary?: boolean`
 * - `compact?: boolean` (smaller pager buttons)
 * - `pageSizes?: number[]`
 * - `maximumButtonCount?: number`
 *
 * Pagination type (controlled)
 * ```
 * export type Pagination = {
 *   pageNumber: number;
 *   pageSize: number;
 *   filter?: string;
 *   sort?: string;
 *   setPageNumber: (n: number) => void;
 *   setPageSize: (n: number) => void;
 *   setFilter?: (s?: string) => void;
 *   setSort?: (s?: string) => void;
 * }
 * ```
 */

// Columns
const columns: ColumnDef[] = [
  { key: "addressNumber", label: "Adressnummer", width: "12rem" },
  { key: "name", label: "Name" },
  { key: "status", label: "Status", width: "8rem", align: "center" },
  { key: "language", label: "Sprache", width: "7rem", align: "center" },
];

// Demo dataset (simulate backend)
type Row = {
  id: number;
  addressNumber: string;
  name: string;
  status: "aktiv" | "inaktiv";
  language: "🇩🇪" | "🇫🇷" | "🇮🇹" | "🇬🇧";
};

const ALL_DATA: Row[] = Array.from({ length: 250 }, (_, i) => {
  const id = i + 1;
  const langs = ["🇩🇪", "🇫🇷", "🇮🇹", "🇬🇧"] as const;
  const statuses = ["aktiv", "inaktiv"] as const;
  return {
    id,
    addressNumber: String(13000000 + id),
    name: `Kontakt ${id}, ${1000 + (id % 9000)} Musterstadt`,
    status: statuses[id % 7 === 0 ? 1 : 0],
    language: langs[id % langs.length],
  };
});

// helpers for “server-side” filter + sort
function sortRows(rows: Row[], sort: string) {
  switch (sort) {
    case "name":
      return [...rows].sort((a, b) => a.name.localeCompare(b.name));
    case "addressNumber":
      return [...rows].sort((a, b) => a.addressNumber.localeCompare(b.addressNumber));
    case "status":
      return [...rows].sort((a, b) => a.status.localeCompare(b.status));
    case "language":
      return [...rows].sort((a, b) => a.language.localeCompare(b.language));
    default:
      return rows;
  }
}
function filterRows(rows: Row[], filter: string) {
  const f = (filter ?? "").trim().toLowerCase();
  if (!f) return rows;
  return rows.filter(
    (r) => r.name.toLowerCase().includes(f) || r.addressNumber.toLowerCase().includes(f),
  );
}

const meta: Meta<typeof PageGrid> = {
  title: "sHome Components/Grid/PageGrid",
  component: PageGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Paginated data grid composed from \`Grid\` + a pager bar. You control the page state via a \`Pagination\` object (server-style).
This story simulates a backend by filtering, sorting and slicing a local array.

**Theming tokens**
Uses the same grid tokens as \`Grid\` (\\\`--grid-*\\\`) plus PageGrid tokens (\\\`--pg-*\\\`) like:
\`--pg-size\`, \`--pg-gap\`, \`--pg-active-bg\`, \`--pg-active-fg\`, \`--pg-radius\`, \`--pg-card-*\`.
Secondary look can be enabled with the boolean \`secondary\` prop.
        `.trim(),
      },
    },
  },
  argTypes: {
    // data wiring (no controls)
    columns: {
      description: "Column definitions.",
      control: false,
      table: { category: "Data" },
    },
    data: {
      description: "Current page rows (sliced).",
      control: false,
      table: { category: "Data" },
    },
    totalCount: {
      description: "Total number of rows in the dataset.",
      control: false,
      table: { category: "Data" },
    },
    pagination: {
      description:
        "Controlled pagination object: { pageNumber, pageSize, filter?, sort?, setPageNumber, setPageSize, setFilter?, setSort? }",
      control: false,
      table: { category: "Data" },
    },

    // visuals/behavior
    selectable: {
      description: "Enable row selection via checkboxes.",
      control: "boolean",
      table: { category: "Selection" },
    },
    zebra: {
      description: "Alternate row background.",
      control: "boolean",
      table: { category: "Display" },
    },
    dense: {
      description: "Compact row height.",
      control: "boolean",
      table: { category: "Display" },
    },
    borders: {
      description: "Border style.",
      control: { type: "select" },
      options: ["row", "all", "none"],
      table: { category: "Display" },
    },
    secondary: {
      description: "Use the secondary color scheme.",
      control: "boolean",
      table: { category: "Theme" },
    },
    compact: {
      description: "Smaller pager controls.",
      control: "boolean",
      table: { category: "Pager" },
    },
    maximumButtonCount: {
      description: "Max number buttons to show in the pager strip.",
      control: "number",
      table: { category: "Pager" },
    },
    pageSizes: {
      description: "Selectable page sizes.",
      control: "object",
      table: { category: "Pager" },
    },
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

/** Basic: server-style controlled pagination (filter/sort simulated) */
export const Basic: Story = {
  render: (args) => {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(25);
    const [filter, setFilter] = useState<string>("");
    const [sort, setSort] = useState<string>("");

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
      setFilter: (v?: string) => setFilter(v ?? ""),
      setSort: (v?: string) => setSort(v ?? ""),
    };

    const wrap = {
      width: "90vw",
      margin: "2rem auto",
      ["--layout-content-max-width" as any]: "90vw",
    } as React.CSSProperties & Record<string, string>;

    // simple inline filter/sort UI just to demonstrate controlled updates
    const toolbar = {
      display: "flex",
      gap: "0.75rem",
      alignItems: "center",
      marginBottom: "0.75rem",
      fontSize: 14,
    } as React.CSSProperties;

    return (
      <div style={wrap}>
        <div style={toolbar}>
          <label>
            Filter:&nbsp;
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Name oder Adressnummer…"
            />
          </label>
          <label>
            Sort:&nbsp;
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">—</option>
              <option value="name">Name</option>
              <option value="addressNumber">Adressnummer</option>
              <option value="status">Status</option>
              <option value="language">Sprache</option>
            </select>
          </label>
        </div>

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
  parameters: {
    docs: {
      description: {
        story:
          "Controlled pagination with simulated filter/sort on a 250-row dataset. Change page/size via the pager; filter/sort via the mini toolbar.",
      },
    },
  },
};

/** Secondary color scheme */
export const Secondary: Story = {
  args: { secondary: true },
  render: (args) => {
    // minimal controller
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const slice = ALL_DATA.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    const pagination: Pagination = {
        pageNumber,
        pageSize,
        setPageNumber,
        setPageSize,
        filter: "",
        sort: "",
        setFilter: function (newFilter: string | undefined): void {
            throw new Error("Function not implemented.");
        },
        setSort: function (newSort: string | undefined): void {
            throw new Error("Function not implemented.");
        }
    };
    return (
      <PageGrid
        {...args}
        columns={columns}
        data={slice}
        totalCount={ALL_DATA.length}
        pagination={pagination}
      />
    );
  },
  parameters: { docs: { description: { story: "Uses the secondary token set." } } },
};

/** Compact pager controls */
export const CompactPager: Story = {
  args: { compact: true, maximumButtonCount: 5, pageSizes: [10, 20, 50] },
  render: (args) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const slice = ALL_DATA.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    const pagination: Pagination = {
        pageNumber,
        pageSize,
        setPageNumber,
        setPageSize,
        filter: "",
        sort: "",
        setFilter: function (newFilter: string | undefined): void {
            throw new Error("Function not implemented.");
        },
        setSort: function (newSort: string | undefined): void {
            throw new Error("Function not implemented.");
        }
    };
    return (
      <PageGrid
        {...args}
        columns={columns}
        data={slice}
        totalCount={ALL_DATA.length}
        pagination={pagination}
      />
    );
  },
  parameters: {
    docs: { description: { story: "Smaller pager UI with fewer number buttons." } },
  },
};

/** Dense + all borders */
export const DenseAllBorders: Story = {
  args: { dense: true, borders: "all" },
  render: (args) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const slice = ALL_DATA.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    const pagination: Pagination = {
        pageNumber,
        pageSize,
        setPageNumber,
        setPageSize,
        filter: "",
        sort: "",
        setFilter: function (newFilter: string | undefined): void {
            throw new Error("Function not implemented.");
        },
        setSort: function (newSort: string | undefined): void {
            throw new Error("Function not implemented.");
        }
    };
    return (
      <PageGrid
        {...args}
        columns={columns}
        data={slice}
        totalCount={ALL_DATA.length}
        pagination={pagination}
      />
    );
  },
  parameters: {
    docs: { description: { story: "Compact rows and full grid lines." } },
  },
};

/** No borders */
export const NoBorders: Story = {
  args: { borders: "none" },
  render: (args) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const slice = ALL_DATA.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    const pagination: Pagination = {
        pageNumber,
        pageSize,
        setPageNumber,
        setPageSize,
        filter: "",
        sort: "",
        setFilter: function (newFilter: string | undefined): void {
            throw new Error("Function not implemented.");
        },
        setSort: function (newSort: string | undefined): void {
            throw new Error("Function not implemented.");
        }
    };
    return (
      <PageGrid
        {...args}
        columns={columns}
        data={slice}
        totalCount={ALL_DATA.length}
        pagination={pagination}
      />
    );
  },
  parameters: {
    docs: { description: { story: "Borderless table within the paginated layout." } },
  },
};
