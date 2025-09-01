// stories/Grid.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

// adjust paths if needed
import { Grid } from "../../components/Grid/Grid";
import type { ColumnDef } from "../../components/Grid/Grid";

/**
 * Column model
 * ```
 * export type ColumnDef = {
 *   key: string;                       // row key to read
 *   label: string;                     // header text
 *   width?: string;                    // e.g. "10rem", "180px", "minmax(10rem,1fr)"
 *   align?: "left" | "center" | "right";
 * };
 * ```
 */

// Columns
const columns: ColumnDef[] = [
  { key: "addressNumber", label: "Adressnummer", width: "12rem" },
  { key: "name", label: "Name" },
  { key: "status", label: "Status", width: "8rem", align: "center" },
  { key: "language", label: "Sprache", width: "7rem", align: "center" },
];

// Rows (each row must have a unique `id`)
const rows = [
  { id: 1,  addressNumber: "13857641", name: "Bremgarten, 4712 Laupersdorf", status: "aktiv", language: "🇩🇪" },
  { id: 2,  addressNumber: "13857640", name: "Madame, Lucie Thidévant, 2362 Montfaucon", status: "aktiv", language: "🇫🇷" },
  { id: 3,  addressNumber: "13857637", name: "Monsieur, Gilles Zanoni, 1232 Confignon", status: "aktiv", language: "🇫🇷" },
  { id: 4,  addressNumber: "13857636", name: "Herr, Andreas Buergi, 3267 Seedorf BE", status: "aktiv", language: "🇩🇪" },
  { id: 5,  addressNumber: "13857634", name: "Monsieur, Pierre Oesch, 1530 Payerne", status: "aktiv", language: "🇫🇷" },
  { id: 6,  addressNumber: "13857631", name: "Herr, Stefan Blaser, 4106 Therwil", status: "aktiv", language: "🇩🇪" },
  { id: 7,  addressNumber: "13857628", name: "Herr, Gerd Böger, 3125 Toffen", status: "aktiv", language: "🇩🇪" },
  { id: 8,  addressNumber: "13857626", name: "Signor Filippo Donati, filipo@idonati.ch", status: "aktiv", language: "🇮🇹" },
  { id: 9,  addressNumber: "13857625", name: "Herr, Jörg Steinmann, 8357 Aadorf", status: "aktiv", language: "🇩🇪" },
  { id:10,  addressNumber: "13857613", name: "Herr, Christian Ernst, 8105 Regensdorf", status: "aktiv", language: "🇩🇪" },
  { id:11,  addressNumber: "13857599", name: "Madame & Monsieur, 2034 Peseux", status: "aktiv", language: "🇫🇷" },
  { id:12,  addressNumber: "13857592", name: "Monsieur & Madame, 1632 Riaz", status: "aktiv", language: "🇫🇷" },
];

const meta: Meta<typeof Grid> = {
  title: "sHome Components/Grid/Grid",
  component: Grid,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Data grid with zebra rows, selectable mode, compact density, and border styles.
Theming uses CSS variables (primary + secondary token sets). You pass \`columns\` and \`rows\`.
Each row **must** include a unique \`id\`.

**Props**
- \`rows: Array<{ id: string|number } & Record<string, unknown>>\`
- \`columns: ColumnDef[]\` (see type above)
- \`zebra?: boolean\` — alternate row background
- \`dense?: boolean\` — tighter row height
- \`selectable?: boolean\` — adds checkbox column; emits \`onSelectionChange(keys)\`
- \`borders?: "row" | "all" | "none"\`
- \`minTableWidth?: number\` — min width before horizontal scroll
- \`secondary?: boolean\` — switches to secondary color tokens

**Primary CSS variables**
\`\`\`css
--grid-bg --grid-fg --grid-border
--grid-header-bg --grid-header-fg
--grid-row-alt --grid-row-hover
--grid-radius --grid-shadow
--grid-pad-y --grid-pad-x
--grid-font-size --grid-font-head-size
--grid-checkbox-accent --grid-border-strong
\`\`\`

**Secondary overrides (used when \`secondary\` is true)**
\`\`\`css
--grid-header-bg-secondary --grid-header-fg-secondary
--grid-row-alt-secondary --grid-row-hover-secondary
--grid-font-size-secondary --grid-font-head-size-secondary
\`\`\`
        `.trim(),
      },
    },
  },
  argTypes: {
    rows: {
      description: "Array of row objects (requires unique `id`).",
      control: false,
      table: { category: "Data" },
    },
    columns: {
      description: "Column definitions (key/label/width/align).",
      control: false,
      table: { category: "Data" },
    },
    zebra: {
      description: "Alternate row background.",
      control: "boolean",
      table: { category: "Display" },
    },
    dense: {
      description: "Reduce row height (compact).",
      control: "boolean",
      table: { category: "Display" },
    },
    selectable: {
      description: "Show checkbox column and enable selection callbacks.",
      control: "boolean",
      table: { category: "Selection" },
    },
    onSelectionChange: {
      description: "Called with a Set of selected row ids.",
      action: "selectionChanged",
      table: { category: "Events" },
    },
    borders: {
      description: "Border style.",
      control: { type: "select" },
      options: ["row", "all", "none"],
      table: { category: "Display" },
    },
    minTableWidth: {
      description: "Minimum table width in px before horizontal scroll.",
      control: "number",
      table: { category: "Layout" },
    },
    secondary: {
      description: "Use the secondary token set.",
      control: "boolean",
      table: { category: "Theme" },
    },
  },
  args: {
    zebra: true,
    dense: false,
    minTableWidth: 1100,
    borders: "row",
    secondary: false,
  },
};
export default meta;

type Story = StoryObj<typeof Grid>;

/** Basic: 90% viewport width with max-width override */
export const Basic: Story = {
  args: { rows, columns },
  render: (args) => (
    <div
      style={
        {
          width: "90vw",
          margin: "0 auto",
          ["--layout-content-max-width" as any]: "90vw",
        } as React.CSSProperties
      }
    >
      <Grid {...args} />
    </div>
  ),
  parameters: { docs: { description: { story: "Default look with zebra rows." } } },
};

/** Selectable: shows checkboxes and logs selected keys */
export const Selectable: Story = {
  args: { rows, columns, selectable: true },
  render: (args) => (
    <div
      style={{ width: "90vw", margin: "0 auto", ["--layout-content-max-width" as any]: "90vw" }}
    >
      <Grid
        {...args}
        onSelectionChange={(keys) => {
          // eslint-disable-next-line no-console
          console.log("Selected keys:", keys);
        }}
      />
    </div>
  ),
  parameters: { docs: { description: { story: "Enable selection and listen for changes." } } },
};

/** Dense rows (compact height) */
export const Dense: Story = {
  args: { rows, columns, dense: true },
  render: (args) => (
    <div
      style={{ width: "90vw", margin: "0 auto", ["--layout-content-max-width" as any]: "90vw" }}
    >
      <Grid {...args} />
    </div>
  ),
  parameters: { docs: { description: { story: "Compact density." } } },
};

/** Full grid lines */
export const AllBorders: Story = {
  args: { rows, columns, borders: "all" },
  render: (args) => (
    <div
      style={{ width: "90vw", margin: "0 auto", ["--layout-content-max-width" as any]: "90vw" }}
    >
      <Grid {...args} />
    </div>
  ),
  parameters: { docs: { description: { story: "Show all cell borders." } } },
};

/** No lines */
export const NoBorders: Story = {
  args: { rows, columns, borders: "none" },
  render: (args) => (
    <div
      style={{ width: "90vw", margin: "0 auto", ["--layout-content-max-width" as any]: "90vw" }}
    >
      <Grid {...args} />
    </div>
  ),
  parameters: { docs: { description: { story: "Borderless table." } } },
};

/** Secondary look using secondary tokens */
export const Secondary: Story = {
  args: { rows, columns, secondary: true },
  render: (args) => <Grid {...args} />,
  parameters: { docs: { description: { story: "Uses secondary color scheme." } } },
};

/** Secondary + token overrides (live CSS var customization) */
export const SecondaryCustomized: Story = {
  args: { rows, columns, secondary: true },
  render: (args) => (
    <div
      style={
        {
          maxWidth: "80%",
          margin: "0 auto",
          ["--grid-header-bg-secondary" as any]: "#0ea5e9",
          ["--grid-header-fg-secondary" as any]: "#ffffff",
          ["--grid-row-alt-secondary" as any]: "rgba(14,165,233,.08)",
          ["--grid-row-hover-secondary" as any]: "rgba(14,165,233,.14)",
          ["--grid-checkbox-accent" as any]: "#0ea5e9",
        } as React.CSSProperties
      }
    >
      <Grid {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates theming by overriding secondary CSS variables inline (no code changes in the component).",
      },
    },
  },
};
