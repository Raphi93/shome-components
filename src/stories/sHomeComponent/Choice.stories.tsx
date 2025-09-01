// src/stories/sHomeComponent/Choice.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Checkbox } from "../../components/Input/Choice/Checkbox";
import { Radio } from "../../components/Input/Choice/Radio";

const meta: Meta<typeof Checkbox> = {
  title: "sHome Components/Inputs/Choice",
  component: Checkbox,
  subcomponents: { Radio },
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type CB = StoryObj<typeof Checkbox>;
type RD = StoryObj<typeof Radio>;

export const CheckboxBasic: CB = {
  name: "Checkbox – Basic",
  render: () => {
    const [v, setV] = useState(false);
    return <Checkbox label="AGB akzeptieren" checked={v} onChange={setV} />;
  },
};

export const CheckboxSizes: CB = {
  name: "Checkbox – Sizes",
  render: () => {
    const [a, setA] = useState(true);
    const [b, setB] = useState(true);
    const [c, setC] = useState(true);
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Checkbox size="sm" label="Small" checked={a} onChange={setA} />
        <Checkbox size="md" label="Medium" checked={b} onChange={setB} />
        <Checkbox size="lg" label="Large" checked={c} onChange={setC} />
      </div>
    );
  },
};

export const CheckboxIndeterminate: CB = {
  name: "Checkbox – Indeterminate",
  render: () => {
    const [all, setAll] = useState(false);
    const [ind, setInd] = useState(true);
    return (
      <Checkbox
        label="Alle auswählen"
        checked={all}
        indeterminate={ind}
        onChange={(next) => {
          setAll(next);
          setInd(false);
        }}
      />
    );
  },
};

export const CheckboxDisabled: CB = {
  name: "Checkbox – Disabled",
  render: () => <Checkbox label="Newsletter" checked onChange={() => {}} disabled />,
};

export const CheckboxSecondary: CB = {
  name: "Checkbox – Secondary",
  render: () => {
    const [v, setV] = useState(true);
    return <Checkbox label="Sekundär" checked={v} onChange={setV} secondary />;
  },
};

export const RadioGroup: RD = {
  name: "Radio – Group",
  render: () => {
    const [v, setV] = useState("de");
    return (
      <div style={{ display: "grid", gap: 10 }}>
        <Radio name="lang" value="de" label="Deutsch"  checked={v==="de"} onChange={()=>setV("de")} />
        <Radio name="lang" value="fr" label="Français" checked={v==="fr"} onChange={()=>setV("fr")} />
        <Radio name="lang" value="it" label="Italiano" checked={v==="it"} onChange={()=>setV("it")} />
      </div>
    );
  },
};

export const RadioSizes: RD = {
  name: "Radio – Sizes",
  render: () => {
    const [v1, setV1] = useState("a");
    const [v2, setV2] = useState("b");
    const [v3, setV3] = useState("c");
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Radio size="sm" name="g1" value="a" label="Small"  checked={v1==="a"} onChange={()=>setV1("a")} />
        <Radio size="md" name="g2" value="b" label="Medium" checked={v2==="b"} onChange={()=>setV2("b")} />
        <Radio size="lg" name="g3" value="c" label="Large"  checked={v3==="c"} onChange={()=>setV3("c")} />
      </div>
    );
  },
};

export const RadioSecondary: RD = {
  name: "Radio – Secondary",
  render: () => {
    const [v, setV] = useState("a");
    return (
      <div style={{ display: "grid", gap: 10 }}>
        <Radio name="opt" value="a" label="Option A" checked={v==="a"} onChange={()=>setV("a")} secondary />
        <Radio name="opt" value="b" label="Option B" checked={v==="b"} onChange={()=>setV("b")} secondary />
      </div>
    );
  },
};
