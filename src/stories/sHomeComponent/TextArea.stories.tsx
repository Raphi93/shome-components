import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Checkbox } from "../../components/index"; // ggf. Pfad anpassen

type Props = React.ComponentProps<typeof Checkbox>;

const meta: Meta<typeof Checkbox> = {
  title: "sHome Components/Inputs/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    secondary: { control: "boolean" },
    description: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    className: { control: false },
    name: { control: "text" },
    value: { control: "text" },
    onChange: { action: "change" },
  },
  args: {
    label: "Option",
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    secondary: false,
    description: "",
    size: "md",
  },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

// kleiner State-Wrapper für kontrollierte Demo
function WithState(p: Props) {
  const [val, setVal] = useState<boolean>(!!p.checked);
  return <Checkbox {...p} checked={val} onChange={setVal} />;
}

export const Basic: Story = {
  render: (args) => <WithState {...args} />,
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
  render: (args) => <WithState {...args} />,
};

export const WithDescription: Story = {
  args: { description: "Zusätzliche Beschreibungstextzeile." },
  render: (args) => <WithState {...args} />,
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <WithState {...args} size="sm" label="Klein (sm)" />
      <WithState {...args} size="md" label="Mittel (md)" />
      <WithState {...args} size="lg" label="Groß (lg)" />
    </div>
  ),
};

export const SecondaryTheme: Story = {
  args: { secondary: true, label: "Sekundäres Theme" },
  render: (args) => <WithState {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, label: "Deaktiviert" },
  render: (args) => <WithState {...args} />,
};
