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
      options: ["small", "medium", "large"],
      table: { category: "Props" },
    },
  },
  args: {
    checked: false,
    size: "medium",
  },
};
export default meta;

type Story = StoryObj<typeof Switch>;

/** Controlled template that stays in sync with Storybook args */
function ControlledSwitchTemplate(args: SwitchProps) {
  const [on, setOn] = useState<boolean>(!!args.checked);

  // keep local state in sync when the control panel changes
  useEffect(() => {
    setOn(!!args.checked);
  }, [args.checked]);

  const handleToggle = (next: boolean) => {
    setOn(next);
    args.onChange?.(next); // emit to SB actions panel
  };

  return (
    <div style={{ display: "grid", gap: 12, placeItems: "center", width: 360 }}>
      <Switch {...args} checked={on} onChange={handleToggle} />
      <div style={{ fontFamily: "sans-serif" }}>State: {on ? "On" : "Off"}</div>
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <ControlledSwitchTemplate {...args} />,
};

export const WithLabel: Story = {
  render: (args) => {
    const [on, setOn] = useState(true);
    useEffect(() => { if (typeof args.checked === "boolean") setOn(args.checked); }, [args.checked]);
    return (
      <label style={{ display: "inline-flex", gap: 8, alignItems: "center", width: 360, justifyContent: "center" }}>
        <span>Dark mode</span>
        <Switch
          {...args}
          checked={on}
          onChange={(v) => {
            setOn(v);
            args.onChange?.(v);
          }}
        />
      </label>
    );
  },
};

/** Keyboard accessible wrapper example */
export const KeyboardAccessibleWrapper: Story = {
  name: "Keyboard Accessible (role = switch)",
  render: (args) => {
    const [on, setOn] = useState(false);
    const toggle = () => {
      const next = !on;
      setOn(next);
      args.onChange?.(next);
    };
    return (
      <div
        role="switch"
        aria-checked={on}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggle();
          }
        }}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, outline: "none" }}
      >
        <span style={{ fontFamily: "sans-serif" }}>Notifications</span>
        <Switch {...args} checked={on} onChange={(v) => { setOn(v); args.onChange?.(v); }} />
      </div>
    );
  },
};

/** Themed via your public tokens (use --switch-* instead of base colors) */
export const Themed: Story = {
  render: (args) => {
    const [on, setOn] = useState(false);
    return (
      <div
        style={{
          ["--switch-track-off" as any]: "#8b5cf6",      // off track (violett)
          ["--switch-track-on" as any]: "#22c55e",       // on track (green)
          ["--switch-knob-off" as any]: "#111827",       // knob/border off
          ["--switch-knob-on" as any]: "#0f766e",        // knob on
          ["--switch-border" as any]: "#111827",
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
        />
        <div style={{ fontFamily: "sans-serif", color: "#111827" }}>
          Customized tokens — {on ? "On" : "Off"}
        </div>
      </div>
    );
  },
};

/** Show all sizes using the size prop */
export const Sizes: Story = {
  render: (args) => {
    const [states, setStates] = useState({ small: false, medium: true, large: false });
    return (
      <div style={{ display: "grid", gap: 16, placeItems: "center", width: 360 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Small</span>
          <Switch
            {...args}
            size="small"
            checked={states.small}
            onChange={(v) => {
              setStates((s) => ({ ...s, small: v }));
              args.onChange?.(v);
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Medium</span>
          <Switch
            {...args}
            size="medium"
            checked={states.medium}
            onChange={(v) => {
              setStates((s) => ({ ...s, medium: v }));
              args.onChange?.(v);
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Large</span>
          <Switch
            {...args}
            size="large"
            checked={states.large}
            onChange={(v) => {
              setStates((s) => ({ ...s, large: v }));
              args.onChange?.(v);
            }}
          />
        </div>
      </div>
    );
  },
};
