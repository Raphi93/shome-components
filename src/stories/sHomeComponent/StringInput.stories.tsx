// stories/StringInput.stories.tsx
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { StringInput } from "../../components/index";

const meta: Meta<typeof StringInput> = {
  title: "sHome Components/Inputs/StringInput",
  component: StringInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Textfeld mit Floating-Label, optionalem Left-Icon, Password-Toggle und **noBorder**-Variante. " +
          "Unterstützt `type=\"email\"` via Prop `email` für native Browser-Validierung.",
      },
    },
  },
  argTypes: {
    label: {
      description: "Beschriftung des Feldes (Floating-Label).",
      control: "text",
      table: { category: "Props" },
    },
    value: {
      description: "Kontrollierter Wert.",
      control: "text",
      table: { category: "Props" },
    },
    onChange: {
      description: "Change-Handler `(value: string) => void`.",
      table: { category: "Events" },
      action: "changed",
    },
    noBorder: {
      description: "Schmale Variante: nur Bottom-Border.",
      control: "boolean",
      table: { category: "Appearance" },
    },
    defaultValue: {
      description: "Initialer Wert (nur visuell; Komponente ist kontrolliert).",
      control: "text",
      table: { category: "Props" },
    },
    type: {
      description: "Input-Type, falls nicht `password`/`email` genutzt wird.",
      control: "text",
      table: { category: "Props", defaultValue: { summary: "text" } },
    },
    iconLeft: {
      description: "Optionales FontAwesome-Icon links.",
      control: false,
      table: { category: "Appearance" },
    },
    password: {
      description: "Password-Modus mit Show/Hide-Toggle.",
      control: "boolean",
      table: { category: "Behavior" },
    },
    email: {
      description: "Email-Modus (`type=email`, `inputMode=email`, `autoComplete=email`).",
      control: "boolean",
      table: { category: "Behavior" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof StringInput>;

export const Basic: Story = {
  name: "Basic",
  render: () => {
    const [v, setV] = useState("");
    return (
      <div style={{ width: 360 }}>
        <StringInput label="Label" value={v} onChange={setV} />
      </div>
    );
  },
};

export const WithIconLeft: Story = {
  name: "With iconLeft",
  render: () => {
    const [v, setV] = useState("");
    return (
      <div style={{ width: 360 }}>
        <StringInput label="Username" value={v} onChange={setV} iconLeft={faUser} />
      </div>
    );
  },
};

export const Password: Story = {
  render: () => {
    const [v, setV] = useState("");
    return (
      <div style={{ width: 360 }}>
        <StringInput label="Password" value={v} onChange={setV} password iconLeft={faLock} />
      </div>
    );
  },
};

export const NoBorder: Story = {
  render: () => {
    const [v, setV] = useState("");
    return (
      <div style={{ width: 360 }}>
        <StringInput label="E-Mail" email value={v} onChange={setV} noBorder />
      </div>
    );
  },
};

export const Prefilled: Story = {
  render: () => {
    const [v, setV] = useState("John Doe");
    return (
      <div style={{ width: 360 }}>
        <StringInput label="Name" value={v} onChange={setV} />
      </div>
    );
  },
};
