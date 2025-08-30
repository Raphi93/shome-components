# shome-components

<p align="center">
  <img src="https://via.placeholder.com/1000x300?text=shome-components+Preview" alt="shome-components preview" />
</p>

<p align="center">
  <a href="#installation"><img alt="npm" src="https://img.shields.io/badge/install-npm-green" /></a>
  <img alt="types" src="https://img.shields.io/badge/TypeScript-ready-blue" />
  <img alt="css-modules" src="https://img.shields.io/badge/CSS%20Modules-yes-purple" />
  <img alt="license" src="https://img.shields.io/badge/license-MIT-lightgrey" />
</p>

A small, modern **React + TypeScript** component library with **CSS Variable** theming.
This README documents the **Button**, **Cards**, and **Tooltip** components in detail, including props, composition, and theming tokens.

> Language: The docs are in **English** to make API naming consistent. If you prefer German docs, say the word and I’ll localize them.

---

## Table of Contents

- [Installation](#installation)
- [Project Setup](#project-setup)
- [Design Tokens](#design-tokens)
- [Button](#button)

  - [Usage](#usage)
  - [Props](#props)
  - [Theming](#theming)
  - [Accessibility](#accessibility)
  - [Styling Hooks](#styling-hooks)

- [Cards](#cards)

  - [Import](#import)
  - [Quick Examples](#quick-examples)
  - [Component API](#component-api)
  - [Child Components](#child-components)
  - [CSS Variables (Cards)](#css-variables-cards)
  - [Class Name Hooks (Cards)](#class-name-hooks-cards)

- [Tooltip](#tooltip)

  - [Import](#import-1)
  - [Quick Examples](#quick-examples-1)
  - [API](#api)
  - [Theming (Tooltip)](#theming-tooltip)
  - [Accessibility](#accessibility-1)

- [FAQ](#faq)
- [License](#license)

---

## Installation

```bash
npm i shome-components
# Icons (optional, used by Button/CardIcon examples)
npm i @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/react-fontawesome
# Tooltip peer
npm i @floating-ui/react
```

Add default tokens once in your app (optional but recommended):

```ts
// e.g. main.tsx / app.tsx
import "shome-components/styles/tokens.css"; // provides defaults for CSS variables
```

---

## Project Setup

- **React 18+** and **TypeScript 5+** recommended
- **CSS Modules** + **SCSS** supported out of the box
- All components ship type definitions

---

## Design Tokens

Override any token at `:root` (or a wrapper element) to theme the library. These are sensible defaults:

```css
:root {
  /* geometry */
  --border-radius: 12px;

  /* shadows */
  --color-box-shadow: rgba(29, 34, 41, 0.1);

  /* typography */
  --font-size-smaller: 0.75rem;

  /* spacing */
  --spacing: 0.5rem;

  /* base */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-light: #a9b3c0;
  --color-gray: #6b7280;
  --color-gray-dark: #1d2229;

  /* primary / secondary */
  --color-primary: #393c40;
  --color-primary-dark: #303234;
  --color-primary-rgb: 57, 60, 64;

  --color-secondary: #0f766e;
  --color-secondary-dark: #0a544e;
  --color-secondary-rgb: 15, 118, 110;

  /* states */
  --color-success: #198754;
  --color-success-dark: #166e3a;
  --color-success-rgb: 25, 135, 84;

  --color-danger: #dc3545;
  --color-danger-dark: #b02a37;
  --color-danger-rgb: 220, 53, 69;

  --color-warning: #ffc107;
  --color-warning-dark: #cc9a06;
  --color-warning-rgb: 255, 193, 7;

  --color-info: #0d6efd;
  --color-info-dark: #0b5ed7;
  --color-info-rgb: 13, 110, 253;
}
```

---

# Button

A flexible, accessible button/link component for React with theming via CSS variables.
Supports **primary/secondary/status** variants, **light** alpha variants, **tooltip** wrapping, **loading** spinner, and an optional **expander chevron**.

## Usage

```tsx
import Button from "shome-components/Button/Button";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

export default function Example() {
  return (
    <>
      <Button
        text="Save"
        icon={faFloppyDisk}
        onClick={() => console.log("save")}
      />

      {/* Link mode */}
      <Button text="Docs" link="https://example.com" target="_blank" />

      {/* Secondary + Light variant */}
      <Button color="secondary" isLightColor text="Filter" />

      {/* Loading UX */}
      <Button text="Submit" isLoading onClick={async () => await doAsync()} />

      {/* Expander (controlled) */}
      <Button text="Details" expander expanderValue={true} />
    </>
  );
}
```

## Props

| Prop               | Type                                                                                  |     Default | Description                                                            |
| ------------------ | ------------------------------------------------------------------------------------- | ----------: | ---------------------------------------------------------------------- |
| `text`             | `string \| null`                                                                      |      `null` | Text label shown after the icon(s). Ignored if `children` is provided. |
| `icon`             | `IconProp \| null`                                                                    |      `null` | Primary Font Awesome icon.                                             |
| `icon2`            | `IconProp \| null`                                                                    |      `null` | Optional secondary icon next to the primary one.                       |
| `icon2Styles`      | `CSSProperties & Record<\`--fa-\${string}\`, string>\`                                |           — | Styles for the secondary icon (supports FA CSS custom props).          |
| `width`            | `string`                                                                              |    `"auto"` | Any valid CSS length. Unit is appended as `px` if omitted.             |
| `height`           | `string`                                                                              |    `"40px"` | Any valid CSS length. Unit is appended as `px` if omitted.             |
| `fontSize`         | `string`                                                                              |    `"1rem"` | Font size applied to icons/content.                                    |
| `disabled`         | `boolean`                                                                             |     `false` | Disables the button.                                                   |
| `color`            | `"primary" \| "secondary" \| "success" \| "danger" \| "warning" \| "info" \| "light"` | `"primary"` | Visual theme.                                                          |
| `isLightColor`     | `boolean`                                                                             |     `false` | Uses the “Light” (alpha) style of the selected `color`.                |
| `tooltip`          | `ReactNode \| null`                                                                   |      `null` | Wraps the button in a tooltip.                                         |
| `expander`         | `boolean`                                                                             |     `false` | Shows a chevron on the right (for expandable UIs).                     |
| `expanderValue`    | `boolean`                                                                             |     `false` | Controls expander rotation (`true` = open).                            |
| `link`             | `string \| null`                                                                      |      `null` | Renders an `<a>` instead of `<button>` when set.                       |
| `target`           | `"_self" \| "_blank"`                                                                 |   `"_self"` | Anchor target (only when `link` is set).                               |
| `isLoading`        | `boolean \| null`                                                                     |      `null` | Shows a spinner and temporarily disables the button on click.          |
| `loadingTimeoutMs` | `number`                                                                              |      `1500` | Duration to keep loading state after click.                            |
| `children`         | `ReactNode \| null`                                                                   |      `null` | Custom content; replaces default (icon/text/expander) layout.          |
| `...rest`          | `ButtonHTMLAttributes<HTMLButtonElement>`                                             |           — | Native button attributes.                                              |

## Theming

Button SCSS reads tokens with fallbacks. Either define **base tokens** (minimal) or override **button-specific tokens**.

```css
:root {
  /* Primary */
  --button-color: var(--color-white);
  --button-background-color: var(--color-primary);
  --button-background-color-hover: var(--color-primary-dark);
  --button-color-light: var(--color-primary-dark);
  --button-background-color-light-rgb: var(--color-primary-rgb);
  --button-background-color-hover-light: var(--color-primary);

  /* Secondary */
  --button-color-secondary: var(--color-white);
  --button-background-color-secondary: var(--color-secondary);
  --button-background-color-hover-secondary: var(--color-secondary-dark);
  --button-color-light-secondary: var(--color-secondary-dark);
  --button-background-color-light-rgb-secondary: var(--color-secondary-rgb);
  --button-background-color-hover-light-secondary: var(--color-secondary);

  /* Success */
  --button-color-success: var(--color-white);
  --button-background-color-success: var(--color-success);
  --button-background-color-hover-success: var(--color-success-dark);
  --button-color-light-success: var(--color-success-dark);
  --button-background-color-light-rgb-success: var(--color-success-rgb);
  --button-background-color-hover-light-success: var(--color-success);

  /* Warning */
  --button-color-warning: var(--color-white);
  --button-background-color-warning: var(--color-warning);
  --button-background-color-hover-warning: var(--color-warning-dark);
  --button-color-light-warning: var(--color-warning-dark);
  --button-background-color-light-rgb-warning: var(--color-warning-rgb);
  --button-background-color-hover-light-warning: var(--color-warning);

  /* Danger */
  --button-color-danger: var(--color-white);
  --button-background-color-danger: var(--color-danger);
  --button-background-color-hover-danger: var(--color-danger-dark);
  --button-color-light-danger: var(--color-danger-dark);
  --button-background-color-light-rgb-danger: var(--color-danger-rgb);
  --button-background-color-hover-light-danger: var(--color-danger);

  /* Info */
  --button-color-info: var(--color-white);
  --button-background-color-info: var(--color-info);
  --button-background-color-hover-info: var(--color-info-dark);
  --button-color-light-info: var(--color-info);
  --button-background-color-light-rgb-info: var(--color-info-rgb);
  --button-background-color-hover-light-info: var(--color-info);
}
```

## Accessibility

- Semantic `<button>` by default; switches to `<a>` when `link` is set (with `rel="noopener noreferrer"` for `_blank`).
- Focus handling on click (removes focus ring after activation).
- Ensure contrast when customizing tokens.

## Styling Hooks

- Root: `.actionButton`
- Content: `.IconContainer`, `.IconTwo`, `.buttonText`
- Expander: `.expandetIcon` + `.animateIcon` / `.animateIconBack`
- Disabled fallback: `.notAllowed`
- Variants: `.primary`, `.secondary`, `.success`, `.danger`, `.warning`, `.info`, `.light` (+ `*Light`)

---

# Cards

Composable card layout with optional image, icon, content area, and an expandable section.
Uses CSS variables for theming and small child helpers to keep markup clean.

## Import

```tsx
import Cards from "shome-components/Cards/Cards";
import CardChildren, {
  CardContent,
  CardIcon,
  CardImage,
  CardExpander,
  CardsImageSelf,
} from "shome-components/Cards/CardChildren";
```

## Quick Examples

```tsx
// 1) Image + Content
<Cards>
  <CardImage src="/hero.jpg" alt="Hero" height="8rem" />
  <CardContent>
    <h3>Title</h3>
    <p>Description text goes here.</p>
  </CardContent>
</Cards>

// 2) Content only
<Cards noImage>
  <CardContent>
    <h3>Only Content</h3>
    <p>There is no image in this card.</p>
  </CardContent>
</Cards>

// 3) Expandable
function ExpandableCard() {
  const [open, setOpen] = React.useState(false);
  return (
    <Cards setValue={{ value: open, setValue: () => setOpen(v => !v) }}>
      <CardImage src="/place.jpg" alt="Place" />
      <CardContent>
        <h3>Expandable</h3>
        <p>Click the chevron to reveal more.</p>
      </CardContent>
      <CardExpander>
        <div style={{ padding: '1rem' }}>Hidden details…</div>
      </CardExpander>
    </Cards>
  );
}

// 4) Icon + Content
<Cards noImage>
  <CardContent>
    <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
      <CardIcon icon={faCircleInfo} iconColor="blue" />
      <div>
        <h3>Info Card</h3>
        <p>Uses theme color tokens for the icon.</p>
      </div>
    </div>
  </CardContent>
</Cards>
```

## Component API

### `<Cards />`

Composes up to three children in this order:

1. **Image** (optional): `<CardImage />` or `<CardsImageSelf />`
2. **Content** (required): `<CardContent />`
3. **Expander** (optional): `<CardExpander />`

If `noImage` is `true`, the first child is treated as content.

**Props**

| Prop          | Type                                        |   Default | Description                                                       |
| ------------- | ------------------------------------------- | --------: | ----------------------------------------------------------------- |
| `children`    | `ChildrenWithImage \| ChildrenWithoutImage` |         — | See composition rules above.                                      |
| `link`        | `boolean`                                   |   `false` | Adds hover scale + stronger shadow to mimic link-like affordance. |
| `setValue`    | `{ value: boolean; setValue: () => void; }` |         — | Controls the expander state (when an expander child exists).      |
| `isRightIcon` | `boolean`                                   |   `false` | In expanded layout, place image + chevron to the right.           |
| `maxwidth`    | `string`                                    | `"100vw"` | Max width of the card container (any CSS length).                 |
| `noImage`     | `boolean`                                   |   `false` | Treat the first child as content (no image area).                 |

## Child Components

### `<CardContent />`

Main content area of the card.

### `<CardImage />`

Responsive image with simple sizing helpers.

| Prop        | Type      |   Default | Description                                                        |
| ----------- | --------- | --------: | ------------------------------------------------------------------ |
| `src`       | `string`  |         — | Image source.                                                      |
| `alt`       | `string`  |      `""` | Accessible alt text.                                               |
| `height`    | `string`  |  `"5rem"` | If `landscape` is `true` and height is default, it becomes `7rem`. |
| `width`     | `string`  |  `"auto"` | Image width.                                                       |
| `maxwidth`  | `string`  | `"50rem"` | Maximum image width.                                               |
| `landscape` | `boolean` |   `false` | Slightly taller default for wide images.                           |
| `className` | `string`  |         — | Extra class hooks.                                                 |

### `<CardsImageSelf />`

Use your own image element(s) instead of `<CardImage />`; children render unchanged in the image slot.

### `<CardIcon />`

Convenience wrapper for a Font Awesome icon sized/colored for cards.

| Prop        | Type                                                                                                   |     Default | Description                   |
| ----------- | ------------------------------------------------------------------------------------------------------ | ----------: | ----------------------------- |
| `icon`      | `IconProp`                                                                                             |           — | Font Awesome icon (free/pro). |
| `fontSize`  | `string`                                                                                               |  `"1.5rem"` | Icon size.                    |
| `iconColor` | `'red' \| 'green' \| 'blue' \| 'orange' \| 'yellow' \| 'secondary' \| 'primary' \| 'white' \| 'black'` | `"primary"` | Maps to theme token classes.  |
| `className` | `string`                                                                                               |           — | Extra class hooks.            |
| `width`     | `string`                                                                                               |    `"auto"` | Width of icon container.      |

### `<CardExpander />`

Content displayed in the expandable panel under the card.

## CSS Variables (Cards)

```css
:root {
  --border-radius: 12px;
  --color-box-shadow: rgba(29, 34, 41, 0.1);
  --color-primary: #393c40;
  --color-secondary: #0f766e;
  --color-danger: #dc3545;
  --color-success: #198754;
  --color-warning: #ffc107;
  --color-info: #0d6efd;
  --color-yellow: #f59e0b;
  --color-white: #ffffff;
  --color-black: #000000;
}
```

## Class Name Hooks (Cards)

- `.cards`, `.cards-expandet`, `.cards-link`
- `.card-container`, `.cards-container-expandet`
- `.image-container`, `.image-container-expandet`, `.image-container-expandet-is-right`
- `.content-container`, `.content-container-image`
- `.contents-container`
- `.expander-container` (+ `.open`)
- `.expandet-icon` (+ `.animate-icon` / `.animate-icon-back`)
- `.iconCard`, `.imageCard`

---

# Tooltip

Accessible, flexible tooltip primitives built on **@floating-ui/react**.
Supports controlled/uncontrolled open state, placements, hover/focus/dismiss interactions, and portal rendering.

## Import

```tsx
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  useTooltip,
} from "shome-components/Tooltip/Tooltip";
import "shome-components/Tooltip/Tooltip.module.scss";
```

## Quick Examples

```tsx
// Basic
<Tooltip>
  <TooltipTrigger>Hover me</TooltipTrigger>
  <TooltipContent>Hi! I'm a tooltip.</TooltipContent>
</Tooltip>

// Custom trigger element (asChild)
<Tooltip>
  <TooltipTrigger asChild>
    <span style={{ textDecoration: 'underline', cursor: 'help' }}>What is this?</span>
  </TooltipTrigger>
  <TooltipContent>Extra context shown on hover or focus.</TooltipContent>
</Tooltip>

// Placement
<Tooltip placement="right">
  <TooltipTrigger>Right</TooltipTrigger>
  <TooltipContent>On the right</TooltipContent>
</Tooltip>

// Controlled open state
function Controlled() {
  const [open, setOpen] = React.useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger onClick={() => setOpen(v => !v)}>Toggle</TooltipTrigger>
      <TooltipContent>Controlled tooltip</TooltipContent>
    </Tooltip>
  );
}
```

## API

### `<Tooltip />`

Context provider that wires interactions.

| Prop           | Type                      | Default | Description                                                      |
| -------------- | ------------------------- | ------: | ---------------------------------------------------------------- |
| `initialOpen`  | `boolean`                 | `false` | Initial state when uncontrolled.                                 |
| `placement`    | `Placement`               | `'top'` | Floating-UI placement (e.g. `top`, `bottom-start`, `right-end`). |
| `open`         | `boolean`                 |       — | Controlled open state.                                           |
| `onOpenChange` | `(open: boolean) => void` |       — | Controlled state setter.                                         |

> Interactions: hover + focus open; `Esc` and outside pointer dismiss. Positioning uses `offset(5)`, `flip`, and `shift`. Content renders inside a `FloatingPortal`.

### `<TooltipTrigger />`

Anchor element for the tooltip.

| Prop      | Type      | Default | Description                                                                                         |
| --------- | --------- | ------: | --------------------------------------------------------------------------------------------------- |
| `asChild` | `boolean` | `false` | When `true`, clones the single child and binds trigger props to it. Otherwise renders a `<button>`. |

The trigger gets `data-state="open|closed"` and the `styles.trigger` class for styling and focus outline.

### `<TooltipContent />`

Floating panel rendered in a portal when open.

| Prop    | Type                  | Default | Description                                           |
| ------- | --------------------- | ------: | ----------------------------------------------------- |
| `style` | `React.CSSProperties` |       — | Inline style merged with Floating-UI computed styles. |

### `useTooltip(options)`

Low-level hook used by `<Tooltip />`. Exposes `open`, `setOpen`, positioning data, and interaction props if you need full control.

## Theming (Tooltip)

`Tooltip.module.scss` uses:

```css
:root {
  --color-gray-dark: #1d2229;
  --color-white: #ffffff;
  --color-gray: #6b7280;
  --border-radius: 12px;
  --font-size-smaller: 0.75rem;
  --spacing: 1rem; /* clamps max width */
}
```

Where they apply:

- Panel background: `var(--color-gray-dark)`
- Panel text: `var(--color-white)`
- Panel radius: `var(--border-radius)`
- Font size: `var(--font-size-smaller)`
- Max width: `calc(100vw - var(--spacing))`
- Focus outline on trigger: `var(--color-gray)`

## Accessibility

- Opens on **hover and focus**, dismisses on **Esc** or outside click by default.
- `TooltipContent` has `role="tooltip"`.
- Trigger uses `:focus-visible` outline for keyboard users.
- Keep sufficient contrast when customizing colors.

---

## License

MIT © Raphael Hug
