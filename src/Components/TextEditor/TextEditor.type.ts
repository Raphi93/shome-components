export type TextEditorFormat = 'html' | 'markdown';
export type TextEditorView = 'visual' | 'source';

export interface TextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  format?: TextEditorFormat;
  onFormatChange?: (format: TextEditorFormat) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}
