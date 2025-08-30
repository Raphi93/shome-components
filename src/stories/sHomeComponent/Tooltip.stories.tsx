// stories/Tooltip.stories.tsx
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { Placement } from "@floating-ui/react";

import { Tooltip, TooltipTrigger, TooltipContent } from "../../components/index";

const placements: Placement[] = [
  "top","bottom","left","right",
  "top-start","top-end","bottom-start","bottom-end",
  "left-start","left-end","right-start","right-end",
];

const meta: Meta<typeof Tooltip> = {
  title: "sHome Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    placement: {
      control: "select",
      options: placements,
    },
  },
  args: {
    placement: "top",
    initialOpen: false,
  },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

/* 1) Basic Hover/Focus */
export const Basic: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent>Basic tooltip text</TooltipContent>
    </Tooltip>
  ),
};

/* 2) Mit Placement (steuerbar über Controls) */
export const WithPlacement: Story = {
  args: { placement: "bottom" },
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger>Placement: {String(args.placement)}</TooltipTrigger>
      <TooltipContent>Position: {String(args.placement)}</TooltipContent>
    </Tooltip>
  ),
};

/* 3) asChild: bestehenden Button/Link/Icon als Trigger verwenden */
export const AsChild: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ padding: ".5rem 1rem", display: "inline-block" }}>
          Link als Trigger
        </a>
      </TooltipTrigger>
      <TooltipContent>Ich bin an den Link gecloned</TooltipContent>
    </Tooltip>
  ),
};

/* 4) Disabled-Target Workaround (Button in <span> wrappen) */
export const DisabledButtonWrapped: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <span style={{ display: "inline-block" }}>
          <button disabled style={{ padding: ".5rem 1rem" }}>Disabled</button>
        </span>
      </TooltipTrigger>
      <TooltipContent>Wrap disabled controls in a span</TooltipContent>
    </Tooltip>
  ),
};

/* 5) Controlled Open (open / onOpenChange) */
export const ControlledOpen: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <div style={{ marginBottom: "1rem", display: "flex", gap: ".5rem" }}>
          <button onClick={() => setOpen((v) => !v)}>Toggle</button>
          <span>open: {String(open)}</span>
        </div>
        <Tooltip {...args} open={open} onOpenChange={setOpen}>
          <TooltipTrigger>Controlled</TooltipTrigger>
          <TooltipContent>State is controlled by parent</TooltipContent>
        </Tooltip>
      </>
    );
  },
};

/* 6) Long Content (Wrap/Max-Width Demo) */
export const LongContent: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger>Long content</TooltipTrigger>
      <TooltipContent style={{ maxWidth: "18rem", lineHeight: 1.35 }}>
        Very long tooltip text that demonstrates wrapping and how your Tooltip.css styles handle larger content.  
        You can set a max-width here via inline style or your CSS class.
      </TooltipContent>
    </Tooltip>
  ),
};

/* 7) Multiple Tooltips nebeneinander */
export const ManyOnPage: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      {["A","B","C","D"].map((k) => (
        <Tooltip key={k} {...args} placement="top">
          <TooltipTrigger>Item {k}</TooltipTrigger>
          <TooltipContent>Tooltip {k}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

/* 8) In Scroll-Container (Portal + Positionierung testen) */
export const InScrollableContainer: Story = {
  render: (args) => (
    <div
      style={{
        width: "24rem",
        height: "12rem",
        overflow: "auto",
        border: "1px solid #ddd",
        padding: "1rem",
      }}
    >
      <div style={{ height: "24rem", display: "flex", alignItems: "flex-end" }}>
        <Tooltip {...args} placement="top-end">
          <TooltipTrigger>Am unteren Rand</TooltipTrigger>
          <TooltipContent>Should flip/shift within viewport.</TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

/* 9) Initial Open (uncontrolled) */
export const InitialOpen: Story = {
  args: { initialOpen: true },
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger>Initial open</TooltipTrigger>
      <TooltipContent>Opens by default via initialOpen</TooltipContent>
    </Tooltip>
  ),
};
