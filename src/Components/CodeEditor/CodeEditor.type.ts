export type CodeEditorTheme = 'vs-dark' | 'light' | 'hc-black';

export interface CodeEditorTab {
  /** Unique identifier */
  id: string;
  /** Display name shown in the tab */
  filename: string;
  /** Language identifier for syntax highlighting (e.g. 'typescript', 'json', 'css') */
  language?: string;
  /** File content */
  value: string;
  /** Whether the file has unsaved changes */
  modified?: boolean;
}

export interface CodeEditorProps {
  /** Tabs / open files. When omitted a single file editor is shown. */
  tabs?: CodeEditorTab[];
  /** Active tab id (controlled). When omitted the first tab is active. */
  activeTab?: string;
  /** Called when the active tab changes */
  onTabChange?: (id: string) => void;
  /** Called when a tab is closed */
  onTabClose?: (id: string) => void;

  /** Single-file mode: content value */
  value?: string;
  /** Single-file mode: called when content changes */
  onChange?: (value: string) => void;

  /** Language for syntax highlighting (single-file mode) */
  language?: string;
  /** Editor colour theme */
  theme?: CodeEditorTheme;
  /** Show / hide line numbers @default true */
  lineNumbers?: boolean;
  /** Show / hide minimap @default true */
  minimap?: boolean;
  /** Word wrap @default false */
  wordWrap?: boolean;
  /** Read-only mode @default false */
  readOnly?: boolean;
  /** Editor height in px or CSS string @default '400px' */
  height?: string | number;
  /** Show status bar at the bottom @default true */
  statusBar?: boolean;
  /** Custom class on the container */
  className?: string;
}
