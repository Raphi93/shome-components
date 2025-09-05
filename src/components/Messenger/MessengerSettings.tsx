import React from "react";
import { Checkbox, NumberInput, Radio, Select, StringInput, Button } from "../index";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import type { SettingField, MessengerSettings } from "./types";

type Props = {
    settingsSchema: SettingField[];
    settings: MessengerSettings;
    setSettings: React.Dispatch<React.SetStateAction<MessengerSettings>>;
    isIndexDb: boolean;
    onDeleteHistory: () => void;
    labelDeleteHistory: string;
    getTextValue: (f: SettingField) => string;
    getNumberValue: (f: SettingField) => number;
    getBooleanValue: (f: SettingField) => boolean;
    isLightColor?: boolean;
};

export function MessengerSettings({
    settingsSchema, settings, setSettings, isIndexDb, onDeleteHistory, labelDeleteHistory,
    getTextValue, getNumberValue, getBooleanValue, isLightColor
}: Props) {
    function renderField(f: SettingField) {
        switch (f.type) {
            case "text":
                return (
                    <div key={f.id} className="image-settings">
                        <StringInput label={f.label} value={getTextValue(f)} onChange={(v: string) => setSettings(s => ({ ...s, [f.id]: v }))} />
                    </div>
                );
            case "number":
                return (
                    <div key={f.id} className="image-settings">
                        <NumberInput showStepper={false}  label={f.label} value={getNumberValue(f)} onChange={(val: number | null) => setSettings(s => ({ ...s, [f.id]: val ?? 0 }))} min={(f as any).min} max={(f as any).max} step={1} />
                    </div>
                );
            case "select":
                return (
                    <div key={f.id} className="image-settings">
                        <Select label={f.label} options={(f as any).options} value={(settings[f.id] as string) ?? null} onChange={(v) => setSettings(s => ({ ...s, [f.id]: v as string }))} searchable={false} placeholder={f.label} />
                    </div>
                );
            case "checkbox":
                return (
                    <div key={f.id} className="image-settings">
                        <Checkbox label={f.label} checked={getBooleanValue(f)} onChange={(next) => setSettings(s => ({ ...s, [f.id]: next }))} />
                    </div>
                );
            case "radio":
                return (
                    <div key={f.id} className="image-settings">
                        <Radio label={f.label} checked={getBooleanValue(f)} onChange={() => setSettings(s => ({ ...s, [f.id]: !getBooleanValue(f) }))} name={f.id} value={String(f.id)} />
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="image-settings-wrapper">
            <div className="image-settings-container">
                <div className="image-settings-content">
                    {settingsSchema.map(renderField)}
                </div>
                {isIndexDb && (
                    <div className="image-settings-index-db">
                        <Button
                            color="danger"
                            icon={faTrash}
                            isLightColor={isLightColor}
                            onClick={onDeleteHistory}
                            text={labelDeleteHistory}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
