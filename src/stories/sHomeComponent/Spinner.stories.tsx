// src/stories/Spinner.stories.tsx
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "../../components"; // falls anders, Pfad anpassen

type SpinnerProps = React.ComponentProps<typeof Spinner>;

const meta: Meta<typeof Spinner> = {
    title: "sHome Components/Spinner",
    component: Spinner,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "Lightweight loading spinner. Can render block (default) or inline. Colors are controlled via CSS variables (`--spinner-center-bg`, `--spinner-color-1..4`).",
            },
        },
    },
    argTypes: {
        inline: {
            description: "Render inline with surrounding text/content.",
            control: "boolean",
            table: { category: "Props" },
        },
        label: {
            description: "ARIA label for screen readers.",
            control: "text",
            table: { category: "Accessibility" },
        },
        className: {
            description: "Optional class hook.",
            control: false,
            table: { category: "Props" },
        },
    },
    args: {
        inline: false,
        label: "Loading",
    },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Basic: Story = {
    render: (args: SpinnerProps) => <Spinner />,
};

export const ThemedColors: Story = {
    name: "Themed (colors via CSS variables)",
    render: (args: SpinnerProps) => (
        <div
            style={
                {
                    // nur existierende Variablen benutzen
                    ["--spinner-color-1" as any]: "#8b5cf6",
                    ["--spinner-color-2" as any]: "#0ea5e9",
                    ["--spinner-color-3" as any]: "#10b981",
                    ["--spinner-color-4" as any]: "#f59e0b",
                    ["--spinner-center-bg" as any]: "#ffffff",
                    padding: 16,
                    borderRadius: 12,
                    width: 200,
                    background:
                        "repeating-linear-gradient(45deg,#f8fafc,#f8fafc 10px,#f1f5f9 10px,#f1f5f9 20px)",
                } as React.CSSProperties
            }
        >
            <Spinner />
        </div>
    ),
};

export const OnDarkBackground: Story = {
    render: (args: SpinnerProps) => (
        <div
            style={{
                background: "#111827",
                padding: 24,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                width: 200,
            }}
        >
            <div
                style={
                    {
                        ["--spinner-center-bg" as any]: "#111827",
                        ["--spinner-color-1" as any]: "#60a5fa",
                        ["--spinner-color-2" as any]: "#a78bfa",
                        ["--spinner-color-3" as any]: "#34d399",
                        ["--spinner-color-4" as any]: "#fbbf24",
                    } as React.CSSProperties
                }
            >
                <Spinner />
            </div>
        </div>
    ),
};
