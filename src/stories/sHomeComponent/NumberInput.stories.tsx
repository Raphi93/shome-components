// stories/NumberInput.stories.tsx
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { faHashtag, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { NumberInput } from "../../components/index";

const meta: Meta<typeof NumberInput> = {
  title: "sHome Components/Inputs/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Zahlenfeld im StringInput-Stil mit Floating-Label, optionalem Left-Icon und Stepper. " +
          "Unterstützt `min`, `max`, `step`, optionale Dezimalstellen (`decimals`) sowie Clamping beim Blur/Stepper. " +
          "Eingabe läuft über `type=\"text\"` + `inputMode=\"decimal\"` für bessere Mobile-Keypads.",
      },
    },
  },
  argTypes: {
    label: {
      description: "Beschriftung (Floating-Label).",
      control: "text",
      table: { category: "Props" },
    },
    value: {
      description: "Kontrollierter Wert (`number | null`).",
      control: false,
      table: { category: "Props" },
    },
    onChange: {
      description: "Änderungs-Handler `(value: number | null) => void`.",
      table: { category: "Events" },
      action: "changed",
    },
    noBorder: {
      description: "Schmale Variante mit nur Bottom-Border.",
      control: "boolean",
      table: { category: "Appearance" },
    },
    defaultValue: {
      description: "Initialer Wert (nur initial; Komponente bleibt kontrolliert).",
      control: { type: "number" },
      table: { category: "Props" },
    },
    iconLeft: {
      description: "Optionales FontAwesome-Icon links.",
      control: false,
      table: { category: "Appearance" },
    },
    step: {
      description: "Schrittweite für den Stepper.",
      control: { type: "number" },
      table: { category: "Behavior", defaultValue: { summary: "1" } },
    },
    min: {
      description: "Untergrenze; Werte werden beim Commit geclamped.",
      control: { type: "number" },
      table: { category: "Constraints" },
    },
    max: {
      description: "Obergrenze; Werte werden beim Commit geclamped.",
      control: { type: "number" },
      table: { category: "Constraints" },
    },
    decimals: {
      description: "Rundet beim Commit auf diese Nachkommastellen.",
      control: { type: "number" },
      table: { category: "Behavior" },
    },
    showStepper: {
      description: "Zeigt/versteckt die +/−-Buttons rechts.",
      control: "boolean",
      table: { category: "Behavior", defaultValue: { summary: "true" } },
    },
    preventWheel: {
      description: "Unterbindet Scroll-Änderung (blurt das Feld beim Scrollen).",
      control: "boolean",
      table: { category: "Behavior", defaultValue: { summary: "true" } },
    },
  },
};
export default meta;

type Story = StoryObj<typeof NumberInput>;

export const Basic: Story = {
  render: () => {
    const [n, setN] = useState<number | null>(0);
    return (
      <div style={{ width: 360 }}>
        <NumberInput label="Amount" value={n} onChange={setN} />
      </div>
    );
  },
};

export const WithIconLeft: Story = {
  render: () => {
    const [n, setN] = useState<number | null>(12);
    return (
      <div style={{ width: 360 }}>
        <NumberInput label="Order #" value={n} onChange={setN} iconLeft={faHashtag} />
      </div>
    );
  },
};

export const MinMaxStep: Story = {
  render: () => {
    const [n, setN] = useState<number | null>(5);
    return (
      <div style={{ width: 360 }}>
        <NumberInput label="Qty (1..10)" value={n} onChange={setN} min={1} max={10} step={1} />
      </div>
    );
  },
};

export const Decimals: Story = {
  render: () => {
    const [n, setN] = useState<number | null>(19.99);
    return (
      <div style={{ width: 360 }}>
        <NumberInput
          label="Price"
          value={n}
          onChange={setN}
          step={0.25}
          decimals={2}
          min={0}
          max={999}
          iconLeft={faDollarSign}
        />
      </div>
    );
  },
};

export const NoStepper_PreventWheel: Story = {
  render: () => {
    const [n, setN] = useState<number | null>(42);
    return (
      <div style={{ width: 360 }}>
        <NumberInput label="Value" value={n} onChange={setN} showStepper={false} preventWheel />
      </div>
    );
  },
};

export const NegativeValues: Story = {
  render: () => {
    const [n, setN] = useState<number | null>(-2.5);
    return (
      <div style={{ width: 360 }}>
        <NumberInput label="Delta (-10..10)" value={n} onChange={setN} min={-10} max={10} step={0.5} decimals={1} />
      </div>
    );
  },
};
