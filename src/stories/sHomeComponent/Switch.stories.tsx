// stories/Switch.stories.tsx
import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../../components";

type SwitchProps = React.ComponentProps<typeof Switch>;

const meta: Meta<typeof Switch> = {
  title: "sHome Components/Inputs/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    checked: {
      description: "Current on/off state.",
      control: "boolean",
      table: { category: "Props" },
    },
    onChange: {
      description: "Called with the next state on toggle.",
      table: { category: "Events" },
      action: "toggled",
    },
    size: {
      description: "Size of the switch.",
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      table: { category: "Props" },
    },
    disabled: {
      description: "Disable interactions.",
      control: "boolean",
      table: { category: "Props" },
    },
    label: {
      description: "Optional label text / node.",
      control: "text",
      table: { category: "Props" },
    },
    labelPosition: {
      description: "Label position relative to the switch.",
      control: { type: "select" },
      options: ["left", "right"],
      table: { category: "Props" },
    },
  },
  args: {
    checked: false,
    size: "md",
    disabled: false,
    label: "",
    labelPosition: "right",
  },
};
export default meta;

type Story = StoryObj<typeof Switch>;

function ControlledTemplate(args: SwitchProps) {
  const [on, setOn] = useState<boolean>(!!args.checked);
  useEffect(() => setOn(!!args.checked), [args.checked]);
  const handleToggle = (next: boolean) => {
    setOn(next);
    args.onChange?.(next);
  };
  return (
    <div style={{ display: "grid", gap: 12, placeItems: "center", width: 360 }}>
      <Switch {...args} checked={on} onChange={handleToggle} />
      <div style={{ fontFamily: "sans-serif" }}>State: {on ? "On" : "Off"}</div>
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <ControlledTemplate {...args} />,
};

export const WithLabelRight: Story = {
  args: { label: "Dark mode" },
  render: (args) => <ControlledTemplate {...args} />,
};

export const WithLabelLeft: Story = {
  args: { label: "Notifications", labelPosition: "left" },
  render: (args) => <ControlledTemplate {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, label: "Disabled" },
  render: (args) => <ControlledTemplate {...args} />,
};

export const Themed: Story = {
  render: (args) => {
    const [on, setOn] = useState(false);
    return (
      <div
        style={{
          ["--switch-track-off" as any]: "#8b5cf6",
          ["--switch-track-on" as any]: "#22c55e",
          ["--switch-knob-off" as any]: "#111827",
          ["--switch-knob-on" as any]: "#0f766e",
          ["--switch-border" as any]: "#111827",
          ["--switch-focus" as any]: "rgba(34,197,94,.35)",
          padding: 24,
          borderRadius: 12,
          background: "#f8fafc",
          display: "grid",
          gap: 12,
          placeItems: "center",
          width: 360,
        }}
      >
        <Switch
          {...args}
          checked={on}
          onChange={(v) => {
            setOn(v);
            args.onChange?.(v);
          }}
          label="Custom themed"
        />
        <div style={{ fontFamily: "sans-serif", color: "#111827" }}>
          Customized tokens — {on ? "On" : "Off"}
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: (args) => {
    const [s, setS] = useState({ sm: false, md: true, lg: false });
    return (
      <div style={{ display: "grid", gap: 16, placeItems: "center", width: 360 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Small</span>
          <Switch
            {...args}
            size="sm"
            checked={s.sm}
            onChange={(v) => {
              setS((x) => ({ ...x, sm: v }));
              args.onChange?.(v);
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Medium</span>
          <Switch
            {...args}
            size="md"
            checked={s.md}
            onChange={(v) => {
              setS((x) => ({ ...x, md: v }));
              args.onChange?.(v);
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Large</span>
          <Switch
            {...args}
            size="lg"
            checked={s.lg}
            onChange={(v) => {
              setS((x) => ({ ...x, lg: v }));
              args.onChange?.(v);
            }}
          />
        </div>
      </div>
    );
  },
};
