export type TextEditorFormat = 'html' | 'markdown';
export type TextEditorView = 'visual' | 'source';

/**
 * Individual toolbar items that can be hidden.
 * All are shown by default — pass the ones you want to hide in `hide`.
 */
export type ToolbarItem =
  | 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'superscript' | 'subscript'
  | 'blockType'        // Normal / H1–H6 dropdown
  | 'fontSize'         // font size dropdown
  | 'fontFamily'       // font family dropdown (needs fonts prop)
  | 'bulletList' | 'orderedList'
  | 'indent' | 'outdent'
  | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify'
  | 'colorPicker'      // text color
  | 'highlight'
  | 'link' | 'unlink'
  | 'blockquote' | 'codeBlock'
  | 'horizontalRule'
  | 'clearFormatting'
  | 'table'
  | 'undo' | 'redo'
  | 'fullscreen'
  | 'image'
  | 'magicWand'
  | 'formatSelect'
  | 'viewMode'
  | 'emoji'
  | 'more';

export interface FontOption {
  label: string;
  value: string;
}

export interface TextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  format?: TextEditorFormat;
  onFormatChange?: (format: TextEditorFormat) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  id?: string;

  /**
   * Lock the editor to a single format and hide the format picker.
   * When omitted both HTML and Markdown are available.
   * @example onlyFormat="html"
   */
  onlyFormat?: TextEditorFormat;

  /**
   * Toolbar items to hide. All items are shown by default.
   * @example hide={['blockquote', 'highlight', 'strike']}
   */
  hide?: ToolbarItem[];

  /**
   * Font family options for the font dropdown.
   * When omitted the fontFamily dropdown is hidden automatically.
   */
  fonts?: FontOption[];

  /**
   * Custom color palette for the color picker (CSS color strings).
   */
  colors?: string[];

  /**
   * Optional brand key used to expose a brand font together with the standard fonts.
   */
  brand?: string;

  /**
   * Minimum height of the editor content area in px.
   * @default 120
   */
  minHeight?: number;

  /**
   * Maximum height of the editor content area in px.
   * When set, the content area becomes scrollable.
   */
  maxHeight?: number;

  /**
   * Show word and character count below the editor.
   * @default false
   */
  wordCount?: boolean;

  /**
   * Optional callback for the magic wand action in the toolbar.
   */
  onMagicWandClick?: () => void;
}
