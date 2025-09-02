import type { SelectOption } from "../index";

export type UserType = "user" | "bot";

export type MessengerMessage = {
    id?: string;
    type: UserType;
    content?: string;
    image?: string | null;  // base64
    createdAt?: number;
    [key: string]: unknown;
};

export type SettingOption = SelectOption;

export type SettingField =
    | { id: string; label: string; type: "text"; defaultValue?: string }
    | { id: string; label: string; type: "number"; min?: number; max?: number; step?: number; defaultValue?: number }
    | { id: string; label: string; type: "select"; options: SettingOption[]; defaultValue?: string }
    | { id: string; label: string; type: "checkbox"; defaultValue?: boolean }
    | { id: string; label: string; type: "radio"; defaultValue?: boolean };

export type FilterSpec = {
    id: string;
    label: string;
    options: SelectOption[];
    multiple?: boolean;
    predicate: (msg: MessengerMessage, value: string) => boolean;
};

export type MessengerSettings = Record<string, string | number | boolean>;

export type MessengerHandle = {
    addMessages: (msgs: MessengerMessage[]) => void;
    clear: () => void;
    getSettings: () => MessengerSettings;
    speakLast: () => void;
    setSetting: (id: string, value: string | number | boolean) => void;
};

export type OnSendArgs = { text: string; isImage: boolean; settings: MessengerSettings };

export type MessengerProps = {
    onSend: (args: OnSendArgs) => Promise<void> | void;
    isLoading?: boolean;
    persist?: boolean;
    isIndexDb?: boolean;
    storageKey?: string;
    enableTTS?: boolean;
    ttsDefaultOn?: boolean;
    ttsLang?: string;
    ttsVoiceIncludes?: string[];
    enableSTT?: boolean;
    sttLang?: string;
    inputPlaceholder?: string;
    initialMessages?: MessengerMessage[];
    settingsSchema?: SettingField[];
    filters?: FilterSpec[];
    LabelDeleteHistory: string;
    renderMessage?: (m: MessengerMessage) => React.ReactNode;
    labelUser?: Record<UserType, string>;
    ttsVoiceName?: string;
    ttsPitch?: number;
    ttsRate?: number;
    ttsVolume?: number;
    labelSendButton?: string;
    childrenButtons?: React.ReactNode;
    setUserInput?: MessengerMessage;
    isLightColor?: boolean;
};
