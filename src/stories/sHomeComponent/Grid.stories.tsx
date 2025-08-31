// stories/Grid.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

// Pfade ggf. anpassen:
import { Grid } from "../../components/Grid/Grid";
import type { ColumnDef } from "../../components/Grid/Grid";

// Spalten
const columns: ColumnDef[] = [
  { key: "addressNumber", label: "Adressnummer", width: "12rem" },
  { key: "name", label: "Name" },
  { key: "status", label: "Status", width: "8rem", align: "center" },
  { key: "language", label: "Sprache", width: "7rem", align: "center" },
];

// Daten
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
  parameters: { layout: "fullscreen" },
  argTypes: {
    zebra: { control: "boolean" },
    dense: { control: "boolean" },
    selectable: { control: "boolean" },
    minTableWidth: { control: "number" },
    borders: {
      control: { type: "select" },
      options: ["row", "all", "none"],
    },
    secondary: { control: "boolean" }, // ← NEU
  },
  args: {
    zebra: true,
    dense: false,
    minTableWidth: 1100,
    borders: "row",
    secondary: false, // default: Primary Look
  },
};
export default meta;

type Story = StoryObj<typeof Grid>;

/** Basis-Story: Wrapper auf 90% des Displays + Max-Width-Override */
export const Basic: Story = {
  args: { rows, columns },
  render: (args) => {
    const containerStyle = {
      width: "90vw",
      margin: "0 auto",
      "--layout-content-max-width": "90vw",
    } as React.CSSProperties & Record<string, string>;
    return (
      <div style={containerStyle}>
        <Grid {...args} />
      </div>
    );
  },
};

/** Auswahl-Story mit Action-Callback */
export const Selectable: Story = {
  args: {
    rows,
    columns,
    selectable: true,
  },
  render: (args) => (
    <div style={{ width: "90vw", margin: "0 auto", ["--layout-content-max-width" as any]: "90vw" }}>
      <Grid
        {...args}
        onSelectionChange={(keys) => {
          // eslint-disable-next-line no-console
          console.log("Selected keys:", keys);
        }}
      />
    </div>
  ),
};

/** Kompakte Zeilen */
export const Dense: Story = {
  args: {
    rows,
    columns,
    dense: true,
  },
  render: (args) => (
    <div style={{ width: "90vw", margin: "0 auto", ["--layout-content-max-width" as any]: "90vw" }}>
      <Grid {...args} />
    </div>
  ),
};

/** Volle Gridlines */
export const AllBorders: Story = {
  args: {
    rows,
    columns,
    borders: "all",
  },
  render: (args) => (
    <div style={{ width: "90vw", margin: "0 auto", ["--layout-content-max-width" as any]: "90vw" }}>
      <Grid {...args} />
    </div>
  ),
};

/** Keine Linien */
export const NoBorders: Story = {
  args: {
    rows,
    columns,
    borders: "none",
  },
  render: (args) => (
    <div style={{ width: "90vw", margin: "0 auto", ["--layout-content-max-width" as any]: "90vw" }}>
      <Grid {...args} />
    </div>
  ),
};

/** Secondary Look (Boolean-Prop `secondary`) */
export const Secondary: Story = {
  args: {
    rows,
    columns,
    secondary: true,
  },
  render: (args) => (
    <div style={{ width: "90vw", margin: "0 auto", ["--layout-content-max-width" as any]: "90vw" }}>
      <Grid {...args} />
    </div>
  ),
};

/** Secondary + individuell verstellte Tokens */
export const SecondaryCustomized: Story = {
  args: {
    rows,
    columns,
    secondary: true,
  },
  render: (args) => {
    const style = {
      width: "90vw",
      margin: "0 auto",
    } as React.CSSProperties & Record<string, string>;
    return (
      <div style={style}>
        <Grid {...args} />
      </div>
    );
  },
};
