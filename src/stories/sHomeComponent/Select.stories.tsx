// stories/Select.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Select, type SelectOption, type SelectValue } from "../../components";

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
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Typed Select (single & multi) with search, clear button, disabled state, and form posting.
Controlled via \`value\` / \`onChange\`. Theming via CSS variables.

**Types**
\`\`\`ts
export type SelectValue = string | null | string[];
export type SelectOption = { value: string; label: string; disabled?: boolean };
\`\`\`

**Key CSS variables**
\`\`\`css
--select-bg --select-fg --select-border --select-border-focus --select-placeholder
--select-radius --select-shadow --select-pad-y --select-pad-x
--select-tag-bg --select-tag-fg --select-tag-remove-fg
--select-opt-hover --select-opt-selected-bg --select-opt-selected-fg
/* secondary theme */
--select-bg-secondary --select-fg-secondary --select-border-secondary
--select-opt-selected-bg-secondary --select-opt-selected-fg-secondary
\`\`\`
        `.trim(),
      },
    },
  },
  argTypes: {
    // value & options are controlled externally in stories
    value: {
      description: "Current value (string | null | string[] when multiple).",
      control: false,
      table: { category: "Props" },
    },
    options: {
      description: "List of options to render.",
      control: false,
      table: { category: "Props" },
    },
    onChange: {
      description: "Fires with the next value.",
      action: "changed",
      table: { category: "Events" },
    },
    multiple: {
      description: "Enable multi-select mode.",
      control: "boolean",
      table: { category: "Props" },
    },
    clearable: {
      description: "Show clear (×) button.",
      control: "boolean",
      table: { category: "Props" },
    },
    searchable: {
      description: "Enable search input.",
      control: "boolean",
      table: { category: "Props" },
    },
    secondary: {
      description: "Use secondary token set.",
      control: "boolean",
      table: { category: "Props" },
    },
    disabled: {
      description: "Disable the control.",
      control: "boolean",
      table: { category: "Props" },
    },
    placeholder: {
      description: "Placeholder text when empty.",
      control: "text",
      table: { category: "Props" },
    },
    maxDropdownHeight: {
      description: "Max dropdown height in px.",
      control: "number",
      table: { category: "Props" },
    },
    name: {
      description: "Hidden input name (for HTML form posting).",
      control: "text",
      table: { category: "Forms" },
    },
    searchInputProps: {
      description: "Props passed to the internal search <input>.",
      control: false,
      table: { category: "Accessibility" },
    },
    hiddenInputProps: {
      description: "Props passed to generated hidden <input> elements.",
      control: false,
      table: { category: "Forms" },
    },
  },
  args: {
    options,
    multiple: false,
    clearable: true,
    searchable: true,
    secondary: false,
    disabled: false,
    placeholder: "Choose…",
    maxDropdownHeight: 280,
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

// Small state wrapper so Select is controlled in all stories
function WithState(p: React.ComponentProps<typeof Select>) {
  const [val, setVal] = useState<SelectValue>(p.multiple ? [] : null);
  return (
    <div style={{ width: 360 }}>
      <Select {...p} value={val} onChange={setVal} />
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
        value: {Array.isArray(val) ? `[${val.join(", ")}]` : String(val)}
      </div>
    </div>
  );
}

/** Basic single-select with search */
export const Basic: Story = {
  render: (args) => <WithState {...args} />,
  parameters: { docs: { description: { story: "Basic single-select with search and clear." } } },
};

/** Multi-select with chips/tags */
export const Multiple: Story = {
  args: { multiple: true },
  render: (args) => <WithState {...args} />,
  parameters: { docs: { description: { story: "Multi-select mode renders tags." } } },
};

/** Secondary theme (uses secondary token set) */
export const Secondary: Story = {
  args: { secondary: true },
  render: (args) => <WithState {...args} />,
  parameters: { docs: { description: { story: "Uses secondary color tokens via CSS variables." } } },
};

/** Disabled state */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <WithState {...args} />,
  parameters: { docs: { description: { story: "Non-interactive disabled field." } } },
};

/** Without search box */
export const NoSearch: Story = {
  args: { searchable: false },
  render: (args) => <WithState {...args} />,
  parameters: { docs: { description: { story: "Search input is hidden." } } },
};

/** Many options + reduced dropdown height */
export const LongList: Story = {
  args: {
    options: Array.from({ length: 60 }, (_, i) => ({
      value: `opt-${i + 1}`,
      label: `Option ${i + 1}`,
    })),
    maxDropdownHeight: 200,
  },
  render: (args) => <WithState {...args} />,
  parameters: { docs: { description: { story: "Scroll within a tall option list." } } },
};

/** Pass-through props to the internal search input */
export const WithSearchInputProps: Story = {
  args: {
    multiple: true,
    searchInputProps: {
      id: "lang-search",
      placeholder: "Search…",
      "aria-label": "Search languages",
      autoComplete: "off",
      autoCorrect: "off",
      autoCapitalize: "none",
      spellCheck: false,
      inputMode: "search",
    },
  },
  render: (args) => <WithState {...args} />,
  parameters: { docs: { description: { story: "Props are forwarded to the search <input>." } } },
};

/** Hidden inputs for HTML form posting */
export const WithHiddenInputs: Story = {
  args: { multiple: true, name: "languages", hiddenInputProps: { form: "demo-form" } },
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
        <button type="submit" style={{ marginTop: 12 }}>Submit</button>
      </form>
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
        In <code>multiple</code> mode one hidden input per selected value is produced under the same <code>name</code>.
      </div>
    </div>
  ),
  parameters: { docs: { description: { story: "Demonstrates posting values with a native form." } } },
};

/** Live override of CSS variables */
export const ThemedVars: Story = {
  args: { multiple: true },
  render: (args) => (
    <div
      style={
        {
          width: 380,
          ["--select-border" as any]: "#0d6efd",
          ["--select-border-focus" as any]: "#0d6efd",
          ["--select-tag-bg" as any]: "rgba(13,110,253,.12)",
          ["--select-tag-fg" as any]: "#0d6efd",
          ["--select-opt-selected-bg" as any]: "rgba(13,110,253,.14)",
          ["--select-opt-selected-fg" as any]: "#0d6efd",
        } as React.CSSProperties
      }
    >
      <WithState {...args} />
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
        CSS variables overridden inline for demo purposes.
      </div>
    </div>
  ),
  parameters: { docs: { description: { story: "Theme via CSS variables without changing component code." } } },
};
