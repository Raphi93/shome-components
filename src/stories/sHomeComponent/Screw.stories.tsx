import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Screw, ScrewCircle } from "../../components/Screw/Screw";
import type { ScrewSize } from "../../components/Screw/Screw";

type Variant = "rect" | "circle";

type DemoProps = {
  size: ScrewSize;
  variant: Variant;
  className?: string;
};

const meta: Meta<DemoProps> = {
  title: "sHome Components/Decor/Screw",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Decorative corner screws. Colors are tokenized; size is controlled via the `size` prop. Place inside a relatively positioned container.",
      },
    },
  },
  argTypes: {
    size: {
      description: "Visual size (sets --screw-size).",
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xlg"],
      table: { category: "Props" },
    },
    variant: {
      description: "Choose between rectangular or circular offsets.",
      control: { type: "radio" },
      options: ["rect", "circle"],
      table: { category: "Props" },
    },
    className: {
      description: "Extra class applied to each screw element.",
      control: "text",
      table: { category: "Props" },
    },
  },
  args: {
    size: "md",
    variant: "rect",
  },
};
export default meta;

type Story = StoryObj<DemoProps>;

function Frame({
  children,
  style,
}: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
  return (
    <div
      style={{
        position: "relative",
        width: 360,
        height: 200,
        border: "1px dashed #cbd5e1",
        borderRadius: 12,
        background: "#fff",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const Template = (args: DemoProps) => (
  <Frame>
    {args.variant === "rect" ? (
      <Screw size={args.size} className={args.className} />
    ) : (
      <ScrewCircle size={args.size} className={args.className} />
    )}
  </Frame>
);

export const Basic: Story = {
  name: "Rectangle",
  args: { variant: "rect" },
  render: (args) => <Template {...args} />,
};

export const Circle: Story = {
  args: { variant: "circle" },
  render: (args) => <Template {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      }}
    >
      {(["xs", "sm", "md", "lg", "xlg"] as ScrewSize[]).map((s) => (
        <React.Fragment key={s}>
          <Frame>
            <Screw size={s} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                color: "#475569",
                fontFamily: "sans-serif",
              }}
            >
              Rect • {s}
            </div>
          </Frame>
          <Frame>
            <ScrewCircle size={s} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                color: "#475569",
                fontFamily: "sans-serif",
              }}
            >
              Circle • {s}
            </div>
          </Frame>
        </React.Fragment>
      ))}
    </div>
  ),
};

export const Themed: Story = {
  render: () => (
    <Frame
      style={
        {
          ["--screw-face-light" as any]: "#8e9aa6",
          ["--screw-face-dark" as any]: "#2a2e34",
          ["--screw-slot" as any]: "#0b0d10",
          background:
            "repeating-linear-gradient(45deg,#f8fafc,#f8fafc 10px,#f1f5f9 10px,#f1f5f9 20px)",
        } as React.CSSProperties
      }
    >
      <Screw size="lg" />
    </Frame>
  ),
};
