'use client';

import React, { useCallback, useRef, useState } from 'react';
import { type Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import {
  faBold, faItalic, faUnderline, faStrikethrough, faCode,
  faSuperscript, faSubscript,
  faListUl, faListOl, faIndent, faOutdent,
  faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify,
  faHighlighter, faLink, faLinkSlash, faQuoteLeft,
  faRotateLeft, faRotateRight,
  faImage, faFaceSmile, faDroplet,
  faMinus, faEraser, faTable,
  faExpand, faCompress, faTerminal,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import type { FontOption, ToolbarItem } from './TextEditor.type';
import s from './TextEditor.module.scss';

// ─── Default color palette ────────────────────────────────────────────────────

const DEFAULT_COLORS = [
  '#000000','#333333','#666666','#999999','#cccccc','#ffffff',
  '#ff0000','#ff4444','#ff8888','#ffcccc',
  '#ff6600','#ff9933','#ffcc66','#ffe5b4',
  '#ffff00','#ffff66','#ffffaa','#ffffcc',
  '#00aa00','#33cc33','#66ff66','#ccffcc',
  '#0000ff','#3366ff','#6699ff','#cce0ff',
  '#800080','#9933cc','#cc66ff','#f0ccff',
  '#008080','#009999','#33cccc','#99eeee',
];

// ─── Emoji data ───────────────────────────────────────────────────────────────
// Array of objects — emoji as STRING VALUES (not object keys) to avoid babel parse errors.
// Tab icons use unicode escapes; emoji values use literal characters (safe as string values).

interface EmojiGroup {
  label: string;
  tab: string; // unicode escape = safe as object key alternative
  emojis: string[];
}

/* eslint-disable max-len */
const EMOJI_GROUPS: EmojiGroup[] = [
  {
    // 😀 Smileys & Emotion
    label: 'Smileys & Emotion', tab: '\uD83D\uDE00',
    emojis: [
      '😀','😁','😂','🤣','😃','😄','😅','😆','😇','😉','😊','😋','😌','😍','🥰','😎','😏',
      '😐','😑','😒','😓','😔','😕','😖','😗','😘','😙','😚','😛','😜','🤪','😝','😞','😟',
      '😠','😡','😢','😣','😤','😥','😦','😧','😨','😩','🤯','😪','😫','🥱','😬','😭','😮',
      '😯','😰','😱','😲','😳','😴','😵','😶','😷','🤐','🤑','🤒','🤓','🤔','🤕','🤗','🤧',
      '🥴','🥺','🤠','🥳','🤡','🤫','🤭','🧐','🤨','🫠','🫡','🫢','🫣','🫤','🫥','🥹','🤥',
    ],
  },
  {
    // 👋 People & Body
    label: 'People & Body', tab: '\uD83D\uDC4B',
    emojis: [
      '👋','🤚','✋','🖐','👌','✌','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝','👍','👎',
      '✊','👊','🤛','🤜','🤝','🙌','👏','🤲','🙏','✍','💅','🤳','💪','🦾','🫶','🫂',
      '👀','👁','👂','👃','🦻','👅','🦷','🦴','🦵','🦶','💋','🫦',
      '🧑','👦','👧','👨','👩','🧔','👴','👵','🧓','👶','🧒','🧕','👮','💂','🕵','👷','🤴','👸',
      '🦸','🦹','🧙','🧝','🧛','🧟','🧞','🧜','🧚','👼','🎅','🤶','🧑‍🎄','🥷',
    ],
  },
  {
    // 🐶 Animals & Nature
    label: 'Animals & Nature', tab: '\uD83D\uDC36',
    emojis: [
      '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈',
      '🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄',
      '🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐',
      '🦞','🦀','🐡','🐟','🐠','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🦣','🐘',
      '🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌',
      '🐕','🐩','🦮','🐈','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊','🐇','🦝','🦨','🦡','🦫',
      '🦦','🦥','🐁','🐀','🐿','🦔','🐾','🐉','🌵','🌲','🌳','🌴','🌱','🌿','🍀','🍃','🍂',
      '🍁','🍄','🐚','🌾','💐','🌷','🌹','🥀','🌺','🌸','🌼','🌻','🌞','🌝','🌛','🌜','🌚',
      '🌙','🌟','⭐','🌠','⛅','🌤','🌧','⛈','🌩','🌨','❄','⛄','🌬','🌀','🌈','🌊','🌫',
    ],
  },
  {
    // 🍎 Food & Drink
    label: 'Food & Drink', tab: '\uD83C\uDF4E',
    emojis: [
      '🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅',
      '🥑','🍆','🥦','🥬','🥒','🌶','🫑','🌽','🥕','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖',
      '🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🌭','🍔','🍟','🍕','🫓','🥪',
      '🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪',
      '🍤','🍙','🍚','🍘','🍥','🥮','🍢','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪',
      '🌰','🥜','🍯','🧃','🥤','🧋','🍵','☕','🫖','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉',
      '🍾','🧊','🥄','🍴','🍽','🫙',
    ],
  },
  {
    // ⚽ Activities
    label: 'Activities', tab: '\u26BD',
    emojis: [
      '⚽','🏀','🏈','⚾','🥎','🏐','🏉','🥏','🎾','🪃','🏸','🏒','🏑','🥍','🏏','⛳','🎣',
      '🤿','🎽','🎿','🛷','🥌','🪂','🏋','🤸','⛹','🤺','🤾','🏌','🏇','🧘','🏊','🏄','🚵',
      '🚴','🤼','🤽','🤾','🧗','🏆','🥇','🥈','🥉','🏅','🎖','🏵','🎗','🎫','🎟','🎪','🤹',
      '🎭','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🪘','🎷','🎺','🪗','🎸','🪕','🎻','🎲','♟',
      '🎯','🎳','🎮','🕹','🧩','🧸','🪆','🪅','🪄','🎰',
    ],
  },
  {
    // 🚗 Travel & Places
    label: 'Travel & Places', tab: '\uD83D\uDE97',
    emojis: [
      '🚗','🚕','🚙','🚌','🚎','🏎','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🦽','🦼','🛺',
      '🚲','🛴','🛹','🛼','🚏','⛽','🚧','🚦','🚥','🛑','🚨','🚔','🚍','🚘','🚖','🚡','🚠',
      '🚟','🚃','🚋','🚞','🚝','🚄','🚅','🚈','🚂','🚆','🚇','🚊','🚉','✈','🛫','🛬','🛩',
      '💺','🚁','🛸','🛶','⛵','🚤','🛥','🛳','⛴','🚢','⚓','🗺','🏔','⛰','🌋','🗻','🏕',
      '🏖','🏜','🏝','🏞','🏟','🏛','🏗','🏘','🏚','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨',
      '🏩','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽','⛪','🕌','🛕','⛩','🕍','🌁','🌃',
      '🌄','🌅','🌆','🌇','🌉','🌌','🎆','🎇','🎑','🗾','🗿',
    ],
  },
  {
    // 💡 Objects
    label: 'Objects', tab: '\uD83D\uDCA1',
    emojis: [
      '⌚','📱','📲','💻','⌨','🖥','🖨','🖱','🖲','💽','💾','💿','📀','🧮','📷','📸','📹',
      '🎥','📽','🎞','📞','☎','📟','📠','📺','📻','🧭','⏱','⏲','⏰','🕰','⌛','⏳','📡',
      '🔋','🪫','🔌','💡','🔦','🕯','🪔','🧯','🛢','💰','💴','💵','💶','💷','💸','💳','🪙',
      '📈','📉','📊','📋','📌','📍','📎','🖇','📏','📐','✂','🗃','🗄','🗑','🔒','🔓','🔏',
      '🔐','🔑','🗝','🔨','🪓','⛏','⚒','🛠','⚔','🛡','🔧','🪛','🔩','⚙','🗜','🔗','⛓',
      '🪤','🧲','🔬','🔭','🩺','🩹','💊','💉','🩸','🧬','🦠','🧫','🧪','🌡','🧹','🧺','🧻',
      '🪠','🧼','🫧','🪥','🧽','🪒','🪮','🛒','🪑','🛁','🚿','🪢','🧵','🧶','🪡','🧷',
      '🎈','🎉','🎊','🎀','🎁','🎗','📦','📫','📪','📬','📭','📮','📯','📢','📣','🔔','🔕',
      '🎵','🎶','🎙','🎚','🎛','📻','🎼','🎤','🎧','🎷','🎸','🎹','🎺','🪗','🥁','🪘',
    ],
  },
  {
    // ❤️ Symbols
    label: 'Symbols', tab: '\u2764\uFE0F',
    emojis: [
      '❤','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣','💕','💞','💓','💗','💖','💘','💝',
      '💟','☮','✝','☪','🕉','✡','🔯','🕎','☯','☦','🛐','⛎','♈','♉','♊','♋','♌','♍',
      '♎','♏','♐','♑','♒','♓','🆔','⚛','🉑','☢','☣','📴','📳','🈶','🈚','🈸','🈺','🈷',
      '✴','🆚','🉐','㊙','㊗','🈴','🈵','🈹','🈲','🅰','🅱','🆎','🅾','🆑','🆘','🆙','🆒',
      '🆓','🆕','🆖','🆗','🔀','🔁','🔂','▶','⏩','⏭','⏯','◀','⏪','⏮','🔼','⏫','🔽',
      '⏬','⏸','⏹','⏺','🔅','🔆','📶','🔱','⚜','🔰','♻','✅','❎','🚫','⛔','❗','❕',
      '❓','❔','‼','⁉','🔞','📵','🚳','🚭','🚯','🚱','🚷','⚠','🔃','🔄','🔙','🔚','🔛',
      '🔜','🔝','🆙','🔛','⭕','✔','✖','〽','✳','❇','🔸','🔹','🔺','🔻','💠','🔶','🔷',
      '🔴','🔵','🟠','🟡','🟢','🟣','⚫','⚪','🟤','🔲','🔳','▪','▫','◾','◽','◼','◻',
      '⬛','⬜','🟥','🟧','🟨','🟩','🟦','🟪','🟫',
    ],
  },
];
/* eslint-enable max-len */

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

// ─── Image helpers ────────────────────────────────────────────────────────────

type ImageAlignment = 'none' | 'left' | 'center' | 'right';

function compressToBase64(file: File, maxW: number, maxH: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const blobUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (maxW > 0 && w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      if (maxH > 0 && h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = blobUrl;
  });
}

function buildImageStyle(alignment: ImageAlignment, width: string, height: string): string {
  const parts: string[] = [];
  const wNum = parseInt(width, 10);
  const hNum = parseInt(height, 10);
  if (width)  parts.push(`width: ${wNum > 0 ? `${wNum}px` : width}`);
  if (height) parts.push(`height: ${hNum > 0 ? `${hNum}px` : height}`);
  else if (width) parts.push('height: auto');
  if (alignment === 'left')   parts.push('float: left; margin: 0 1rem 0.5rem 0');
  if (alignment === 'center') parts.push('display: block; margin: 0.5rem auto');
  if (alignment === 'right')  parts.push('float: right; margin: 0 0 0.5rem 1rem');
  return parts.join('; ');
}

// ─── ImageDialog ──────────────────────────────────────────────────────────────

interface ImageDialogProps {
  onInsert: (attrs: { src: string; alt?: string; style?: string }) => void;
  onClose: () => void;
}

function ImageDialog({ onInsert, onClose }: ImageDialogProps) {
  const [tab, setTab]           = useState<'url' | 'file'>('url');
  const [url, setUrl]           = useState('');
  const [alt, setAlt]           = useState('');
  const [width, setWidth]       = useState('');
  const [height, setHeight]     = useState('');
  const [alignment, setAlignment] = useState<ImageAlignment>('none');
  const [preview, setPreview]   = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    const maxW = parseInt(width, 10) || 1200;
    const maxH = parseInt(height, 10) || 0;
    const b64 = await compressToBase64(file, maxW, maxH);
    setPreview(b64);
  }, [width, height]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) processFile(file);
  };

  const handleAdd = () => {
    const src = tab === 'url' ? url.trim() : preview;
    if (!src) return;
    const style = buildImageStyle(alignment, width, height) || undefined;
    onInsert({ src, alt: alt.trim() || undefined, style });
    onClose();
  };

  const ALIGNMENTS: { value: ImageAlignment; label: string }[] = [
    { value: 'none',   label: 'Inline' },
    { value: 'left',   label: 'Links'  },
    { value: 'center', label: 'Mitte'  },
    { value: 'right',  label: 'Rechts' },
  ];

  return (
    <div className={s.imageDialog} onMouseDown={(e) => e.stopPropagation()}>

      {/* ── Tabs ── */}
      <div className={s.imageTabs}>
        <button type="button" className={`${s.imageTab}${tab === 'url'  ? ` ${s.active}` : ''}`} onClick={() => setTab('url')}>URL</button>
        <button type="button" className={`${s.imageTab}${tab === 'file' ? ` ${s.active}` : ''}`} onClick={() => setTab('file')}>Upload</button>
      </div>

      <div className={s.imageForm}>

        {/* ── URL input ── */}
        {tab === 'url' && (
          <div className={s.imageField}>
            <label className={s.imageLabel}>URL <span className={s.imageRequired}>*</span></label>
            <input
              className={s.imageInput}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              autoFocus
            />
          </div>
        )}

        {/* ── File upload / drop zone ── */}
        {tab === 'file' && (
          <div
            className={`${s.imageDropZone}${dragging ? ` ${s.dragging}` : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            {preview
              ? <img src={preview} alt="preview" className={s.imagePreview} />
              : <span className={s.imageDropHint}>Bild hier ablegen oder klicken</span>
            }
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
            />
          </div>
        )}

        {/* ── Alt text ── */}
        <div className={s.imageField}>
          <label className={s.imageLabel}>Alt Text</label>
          <input className={s.imageInput} type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Bildbeschreibung…" />
        </div>

        {/* ── Width / Height ── */}
        <div className={s.imageRow}>
          <div className={s.imageField}>
            <label className={s.imageLabel}>Breite (px)</label>
            <input className={`${s.imageInput} ${s.imageInputSmall}`} type="number" min="1" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="auto" />
          </div>
          <div className={s.imageField}>
            <label className={s.imageLabel}>Höhe (px)</label>
            <input className={`${s.imageInput} ${s.imageInputSmall}`} type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="auto" />
          </div>
        </div>

        {/* ── Alignment ── */}
        <div className={s.imageField}>
          <label className={s.imageLabel}>Position</label>
          <div className={s.imageAlignRow}>
            {ALIGNMENTS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`${s.imageAlignBtn}${alignment === value ? ` ${s.active}` : ''}`}
                onClick={() => setAlignment(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className={s.imageActions}>
          <button
            type="button"
            className={s.imageAddBtn}
            onClick={handleAdd}
            disabled={tab === 'url' ? !url.trim() : !preview}
          >
            Einfügen
          </button>
          <button type="button" className={s.imageCancelBtn} onClick={onClose}>Abbrechen</button>
        </div>

      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Sep() {
  return <div className={s.toolbarSeparator} />;
}

interface BtnProps {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

function Btn({ active, disabled, label, onClick, children }: BtnProps) {
  return (
    <Tooltip placement="bottom">
      <TooltipTrigger
        disabled={disabled}
        className={`${s.toolbarBtn}${active ? ` ${s.active}` : ''}`}
        onMouseDown={(e: React.MouseEvent) => { e.preventDefault(); if (!disabled) onClick(); }}
      >
        <div className={s.toolbarBtnInner}>{children}</div>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

// ─── Color Picker popover ────────────────────────────────────────────────────

function ColorPicker({ colors, current, onSelect }: { colors: string[]; current: string; onSelect: (c: string) => void }) {
  return (
    <div className={s.colorPicker} onMouseDown={(e) => e.preventDefault()}>
      <div className={s.colorGrid}>
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            className={`${s.colorSwatch}${current === c ? ` ${s.active}` : ''}`}
            style={{ background: c }}
            title={c}
            onClick={() => onSelect(c)}
          />
        ))}
      </div>
      <button type="button" className={s.colorReset} onClick={() => onSelect('')}>Reset</button>
    </div>
  );
}

// ─── Emoji Picker popover ────────────────────────────────────────────────────

function EmojiPicker({ onSelect }: { onSelect: (e: string) => void }) {
  const [groupIdx, setGroupIdx] = useState(0);
  const group = EMOJI_GROUPS[groupIdx];
  return (
    <div className={s.emojiPicker} onMouseDown={(e) => e.preventDefault()}>
      <div className={s.emojiTabs}>
        {EMOJI_GROUPS.map((g, i) => (
          <button
            key={g.label}
            type="button"
            title={g.label}
            className={`${s.emojiTab}${groupIdx === i ? ` ${s.active}` : ''}`}
            onClick={() => setGroupIdx(i)}
          >
            {g.tab}
          </button>
        ))}
      </div>
      <div className={s.emojiLabel}>{group.label}</div>
      <div className={s.emojiGrid}>
        {group.emojis.map((em) => (
          <button key={em} type="button" className={s.emojiItem} onClick={() => onSelect(em)}>
            {em}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── TextEditorToolbar ───────────────────────────────────────────────────────

interface Props {
  editor: Editor | null;
  hide?: ToolbarItem[];
  fonts?: FontOption[];
  colors?: string[];
  emoji?: boolean;
  fullscreen?: boolean;
  onFullscreen?: () => void;
}

export function TextEditorToolbar({ editor, hide = [], fonts, colors = DEFAULT_COLORS, emoji = false, fullscreen = false, onFullscreen }: Props) {
  const { t } = useTranslation();
  const [colorOpen, setColorOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useClickOutside(colorRef, () => setColorOpen(false));
  useClickOutside(emojiRef, () => setEmojiOpen(false));
  useClickOutside(imageRef, () => setImageOpen(false));

  if (!editor) return null;

  const vis = (item: ToolbarItem) => !hide.includes(item);
  const hasSep = (...items: ToolbarItem[]) => items.some(vis);

  // ── Heading value ──────────────────────────────────────────────────────────
  const headingVal = (() => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) return `h${i}`;
    }
    return 'p';
  })();

  const applyBlock = (val: string) => {
    if (val === 'p') { editor.chain().focus().setParagraph().run(); return; }
    const lv = parseInt(val.replace('h', ''), 10) as 1|2|3|4|5|6;
    editor.chain().focus().toggleHeading({ level: lv }).run();
  };

  // ── Font size ──────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentSize: string = (editor.getAttributes('textStyle') as any)?.fontSize?.replace('px', '') ?? '';

  const applySize = (sz: string) => {
    if (!sz) { editor.chain().focus().unsetMark('textStyle').run(); return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor.chain().focus() as any).setFontSize(`${sz}px`).run();
  };

  // ── Font family ────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentFont: string = (editor.getAttributes('textStyle') as any)?.fontFamily ?? '';

  // ── Text color ─────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentColor: string = (editor.getAttributes('textStyle') as any)?.color ?? '';

  const applyColor = (c: string) => {
    if (!c) editor.chain().focus().unsetColor().run();
    else editor.chain().focus().setColor(c).run();
    setColorOpen(false);
  };

  // ── Link ───────────────────────────────────────────────────────────────────
  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt(t('Enter URL'), prev ?? 'https://');
    if (url === null) return;
    if (!url) editor.chain().focus().extendMarkRange('link').unsetLink().run();
    else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // ── Image ──────────────────────────────────────────────────────────────────
  const insertImage = (attrs: { src: string; alt?: string; style?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor.chain().focus() as any).setImage(attrs).run();
  };

  return (
    <div className={s.toolbar}>

      {/* ── Inline: B I U S {} x² x₂ ─────────────────────────────────── */}
      {hasSep('bold','italic','underline','strike','code','superscript','subscript') && (
        <div className={s.toolbarGroup}>
          {vis('bold')        && <Btn active={editor.isActive('bold')}        label={t('Bold')}          onClick={() => editor.chain().focus().toggleBold().run()}>        <FontAwesomeIcon icon={faBold} /></Btn>}
          {vis('italic')      && <Btn active={editor.isActive('italic')}      label={t('Italic')}        onClick={() => editor.chain().focus().toggleItalic().run()}>      <FontAwesomeIcon icon={faItalic} /></Btn>}
          {vis('underline')   && <Btn active={editor.isActive('underline')}   label={t('Underline')}     onClick={() => editor.chain().focus().toggleUnderline().run()}>   <FontAwesomeIcon icon={faUnderline} /></Btn>}
          {vis('strike')      && <Btn active={editor.isActive('strike')}      label={t('Strikethrough')} onClick={() => editor.chain().focus().toggleStrike().run()}>      <FontAwesomeIcon icon={faStrikethrough} /></Btn>}
          {vis('code')        && <Btn active={editor.isActive('code')}        label={t('Inline code')}   onClick={() => editor.chain().focus().toggleCode().run()}>        <FontAwesomeIcon icon={faCode} /></Btn>}
          {vis('superscript') && <Btn active={editor.isActive('superscript')} label={t('Superscript')}   onClick={() => editor.chain().focus().toggleSuperscript().run()}><FontAwesomeIcon icon={faSuperscript} /></Btn>}
          {vis('subscript')   && <Btn active={editor.isActive('subscript')}   label={t('Subscript')}     onClick={() => editor.chain().focus().toggleSubscript().run()}>   <FontAwesomeIcon icon={faSubscript} /></Btn>}
        </div>
      )}

      {/* ── Block type: Normal / H1–H6 ────────────────────────────────── */}
      {vis('blockType') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            <select
              className={`${s.toolbarSelect} ${s.selectBlock}`}
              value={headingVal}
              title={t('Text style')}
              onChange={(e) => applyBlock(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <option value="p">Normal</option>
              {[1,2,3,4,5,6].map((n) => <option key={n} value={`h${n}`}>H{n}</option>)}
            </select>
          </div>
        </>
      )}

      {/* ── Font size ─────────────────────────────────────────────────── */}
      {vis('fontSize') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            <select
              className={`${s.toolbarSelect} ${s.selectSize}`}
              value={currentSize}
              title={t('Font size')}
              onChange={(e) => applySize(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <option value="">–</option>
              {[8,9,10,11,12,14,16,18,20,22,24,28,32,36,48,60,72,96].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* ── Font family ───────────────────────────────────────────────── */}
      {vis('fontFamily') && fonts && fonts.length > 0 && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            <select
              className={`${s.toolbarSelect} ${s.selectFont}`}
              value={currentFont}
              title={t('Font family')}
              onChange={(e) => {
                if (e.target.value) editor.chain().focus().setFontFamily(e.target.value).run();
                else editor.chain().focus().unsetFontFamily().run();
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <option value="">{t('Default')}</option>
              {fonts.map((f) => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* ── Lists ─────────────────────────────────────────────────────── */}
      {hasSep('bulletList','orderedList') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            {vis('bulletList')  && <Btn active={editor.isActive('bulletList')}  label={t('Bullet list')}  onClick={() => editor.chain().focus().toggleBulletList().run()}>  <FontAwesomeIcon icon={faListUl} /></Btn>}
            {vis('orderedList') && <Btn active={editor.isActive('orderedList')} label={t('Ordered list')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><FontAwesomeIcon icon={faListOl} /></Btn>}
          </div>
        </>
      )}

      {/* ── Alignment ─────────────────────────────────────────────────── */}
      {hasSep('alignLeft','alignCenter','alignRight','alignJustify') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            {vis('alignLeft')    && <Btn active={editor.isActive({ textAlign: 'left' })}    label={t('Align left')}    onClick={() => editor.chain().focus().setTextAlign('left').run()}>    <FontAwesomeIcon icon={faAlignLeft} /></Btn>}
            {vis('alignCenter')  && <Btn active={editor.isActive({ textAlign: 'center' })}  label={t('Align center')}  onClick={() => editor.chain().focus().setTextAlign('center').run()}>  <FontAwesomeIcon icon={faAlignCenter} /></Btn>}
            {vis('alignRight')   && <Btn active={editor.isActive({ textAlign: 'right' })}   label={t('Align right')}   onClick={() => editor.chain().focus().setTextAlign('right').run()}>   <FontAwesomeIcon icon={faAlignRight} /></Btn>}
            {vis('alignJustify') && <Btn active={editor.isActive({ textAlign: 'justify' })} label={t('Justify')}       onClick={() => editor.chain().focus().setTextAlign('justify').run()}><FontAwesomeIcon icon={faAlignJustify} /></Btn>}
          </div>
        </>
      )}

      {/* ── Color picker ──────────────────────────────────────────────── */}
      {vis('colorPicker') && (
        <>
          <Sep />
          <div className={s.toolbarGroup} ref={colorRef} style={{ position: 'relative' }}>
            <Btn active={colorOpen} label={t('Text color')} onClick={() => setColorOpen((o) => !o)}>
              <span className={s.colorIcon}>
                <FontAwesomeIcon icon={faDroplet} />
                <span className={s.colorBar} style={{ background: currentColor || 'currentColor' }} />
              </span>
            </Btn>
            {colorOpen && <ColorPicker colors={colors} current={currentColor} onSelect={applyColor} />}
          </div>
        </>
      )}

      {/* ── Highlight ─────────────────────────────────────────────────── */}
      {vis('highlight') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            <Btn active={editor.isActive('highlight')} label={t('Highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()}>
              <FontAwesomeIcon icon={faHighlighter} />
            </Btn>
          </div>
        </>
      )}

      {/* ── Link / Unlink ─────────────────────────────────────────────── */}
      {hasSep('link','unlink') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            {vis('link')   && <Btn active={editor.isActive('link')}       label={t('Set link')}    onClick={setLink}><FontAwesomeIcon icon={faLink} /></Btn>}
            {vis('unlink') && <Btn disabled={!editor.isActive('link')}    label={t('Remove link')} onClick={() => editor.chain().focus().unsetLink().run()}><FontAwesomeIcon icon={faLinkSlash} /></Btn>}
          </div>
        </>
      )}

      {/* ── Blockquote ────────────────────────────────────────────────── */}
      {vis('blockquote') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            <Btn active={editor.isActive('blockquote')} label={t('Quote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              <FontAwesomeIcon icon={faQuoteLeft} />
            </Btn>
          </div>
        </>
      )}

      {/* ── Emoji ─────────────────────────────────────────────────────── */}
      {emoji && (
        <>
          <Sep />
          <div className={s.toolbarGroup} ref={emojiRef} style={{ position: 'relative' }}>
            <Btn active={emojiOpen} label={t('Emoji')} onClick={() => setEmojiOpen((o) => !o)}>
              <FontAwesomeIcon icon={faFaceSmile} />
            </Btn>
            {emojiOpen && (
              <EmojiPicker
                onSelect={(em) => { editor.chain().focus().insertContent(em).run(); setEmojiOpen(false); }}
              />
            )}
          </div>
        </>
      )}

      {/* ── Undo / Redo ───────────────────────────────────────────────── */}
      {hasSep('undo','redo') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            {vis('undo') && <Btn disabled={!editor.can().undo()} label={t('Undo')} onClick={() => editor.chain().focus().undo().run()}><FontAwesomeIcon icon={faRotateLeft} /></Btn>}
            {vis('redo') && <Btn disabled={!editor.can().redo()} label={t('Redo')} onClick={() => editor.chain().focus().redo().run()}><FontAwesomeIcon icon={faRotateRight} /></Btn>}
          </div>
        </>
      )}

      {/* ── Indent / Outdent ──────────────────────────────────────────── */}
      {hasSep('indent','outdent') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            {vis('outdent') && <Btn label={t('Outdent')} onClick={() => editor.chain().focus().liftListItem('listItem').run()}><FontAwesomeIcon icon={faOutdent} /></Btn>}
            {vis('indent')  && <Btn label={t('Indent')}  onClick={() => editor.chain().focus().sinkListItem('listItem').run()}><FontAwesomeIcon icon={faIndent} /></Btn>}
          </div>
        </>
      )}

      {/* ── Code block ────────────────────────────────────────────────── */}
      {vis('codeBlock') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            <Btn active={editor.isActive('codeBlock')} label={t('Code block')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
              <FontAwesomeIcon icon={faTerminal} />
            </Btn>
          </div>
        </>
      )}

      {/* ── Horizontal rule ───────────────────────────────────────────── */}
      {vis('horizontalRule') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            <Btn label={t('Horizontal rule')} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
              <FontAwesomeIcon icon={faMinus} />
            </Btn>
          </div>
        </>
      )}

      {/* ── Clear formatting ──────────────────────────────────────────── */}
      {vis('clearFormatting') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            <Btn label={t('Clear formatting')} onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
              <FontAwesomeIcon icon={faEraser} />
            </Btn>
          </div>
        </>
      )}

      {/* ── Table ─────────────────────────────────────────────────────── */}
      {vis('table') && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            <Btn
              active={editor.isActive('table')}
              label={editor.isActive('table') ? t('Delete table') : t('Insert table')}
              onClick={() => {
                if (editor.isActive('table')) editor.chain().focus().deleteTable().run();
                else editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
              }}
            >
              <FontAwesomeIcon icon={faTable} />
            </Btn>
          </div>
        </>
      )}

      {/* ── Image ─────────────────────────────────────────────────────── */}
      {vis('image') && (
        <>
          <Sep />
          <div className={s.toolbarGroup} ref={imageRef} style={{ position: 'relative' }}>
            <Btn active={imageOpen} label={t('Insert image')} onClick={() => setImageOpen((o) => !o)}>
              <FontAwesomeIcon icon={faImage} />
            </Btn>
            {imageOpen && (
              <ImageDialog onInsert={insertImage} onClose={() => setImageOpen(false)} />
            )}
          </div>
        </>
      )}

      {/* ── Fullscreen ────────────────────────────────────────────────── */}
      {vis('fullscreen') && onFullscreen && (
        <>
          <Sep />
          <div className={s.toolbarGroup}>
            <Btn active={fullscreen} label={fullscreen ? t('Exit fullscreen') : t('Fullscreen')} onClick={onFullscreen}>
              <FontAwesomeIcon icon={fullscreen ? faCompress : faExpand} />
            </Btn>
          </div>
        </>
      )}

    </div>
  );
}
