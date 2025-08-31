// stories/Select.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Select, SelectOption, SelectValue } from "../../components/index";

const options: SelectOption[] = [
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "it", label: "Italiano" },
  { value: "en", label: "English" },
  { value: "rm", label: "Rumantsch" },
];

const meta: Meta<typeof Select> = {
  title: "sHome Components/Inputs/Select",
  component: Select,
  parameters: { layout: "centered" },
  argTypes: {
    multiple: { control: "boolean" },
    clearable: { control: "boolean" },
    searchable: { control: "boolean" },
    secondary: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    maxDropdownHeight: { control: "number" },
    name: { control: "text" },
  },
  args: {
    options,
    multiple: false,
    clearable: true,
    searchable: true,
    secondary: false,
    disabled: false,
    placeholder: "Auswählen…",
    maxDropdownHeight: 280,
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

// kleiner State-Wrapper, damit das Select kontrolliert ist
function WithState(p: React.ComponentProps<typeof Select>) {
  const [val, setVal] = useState<SelectValue>(p.multiple ? [] : null);
  return (
    <div style={{ width: 360 }}>
      <Select {...p} value={val} onChange={setVal} />
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
        value: {Array.isArray(val) ? `[${val.join(", ")}]` : String(val)}
      </div>
    </div>
  );
}

/** Basis: Single-Select, Suche an */
export const Basic: Story = {
  render: (args) => <WithState {...args} />,
};

/** Multi-Select mit Chips/Tags */
export const Multiple: Story = {
  args: { multiple: true },
  render: (args) => <WithState {...args} />,
};

/** Sekundäres Theme (nutzt Variablen) */
export const Secondary: Story = {
  args: { secondary: true },
  render: (args) => <WithState {...args} />,
};

/** Deaktiviert */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <WithState {...args} />,
};

/** Ohne Suche (searchable=false) */
export const NoSearch: Story = {
  args: { searchable: false },
  render: (args) => <WithState {...args} />,
};

/** Passthrough: Such-Input erhält HTML-Attribute (id, aria, pattern, etc.) */
export const WithSearchInputProps: Story = {
  args: {
    multiple: true,
    searchInputProps: {
      id: "lang-search",
      placeholder: "Suchen…",
      "aria-label": "Sprachen suchen",
      autoComplete: "off",
      autoCorrect: "off",
      autoCapitalize: "none",
      spellCheck: false,
      inputMode: "search",
    },
  },
  render: (args) => <WithState {...args} />,
};

/** Form-Posting: Hidden-Inputs (name + hiddenInputProps) */
export const WithHiddenInputs: Story = {
  args: {
    multiple: true,
    name: "languages",
    hiddenInputProps: { form: "demo-form" },
  },
  render: (args) => (
    <div style={{ width: 380 }}>
      <form
        id="demo-form"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          // eslint-disable-next-line no-console
          console.log("FormData:", Array.from(data.entries()));
        }}
      >
        <WithState {...args} />
        <button type="submit" style={{ marginTop: 12 }}>
          Absenden
        </button>
      </form>
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
        Hinweis: Bei <code>multiple</code> wird pro Wert ein verstecktes Input mit
        dem gleichen <code>name</code> erzeugt.
      </div>
    </div>
  ),
};

/** Viele Optionen + kleinere Dropdown-Höhe */
export const LongList: Story = {
  args: {
    options: Array.from({ length: 60 }, (_, i) => ({
      value: `opt-${i + 1}`,
      label: `Option ${i + 1}`,
    })),
    maxDropdownHeight: 200,
  },
  render: (args) => <WithState {...args} />,
};

/** Design-Variablen live überschreiben (nur als Demo) */
export const ThemedVars: Story = {
  args: { multiple: true },
  render: (args) => (
    <div
      style={
        {
            width: 380,
            "--select-border": "#0d6efd",
            "--select-border-focus": "#0d6efd",
            "--select-tag-bg": "rgba(13,110,253,.12)",
            "--select-tag-fg": "#0d6efd",
            "--select-opt-selected-bg": "rgba(13,110,253,.14)",
            "--select-opt-selected-fg": "#0d6efd",
        } as unknown as React.CSSProperties & Record<string, string>
      }
    >
      <WithState {...args} />
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
        Diese Story zeigt, wie du die CSS-Variablen zur Laufzeit überschreiben kannst.
      </div>
    </div>
  ),
};
