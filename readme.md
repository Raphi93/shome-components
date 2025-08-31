# shome-components

<p align="center">
  <a href="#installation"><img alt="npm" src="https://img.shields.io/badge/install-npm-green" /></a>
  <img alt="types" src="https://img.shields.io/badge/TypeScript-ready-blue" />
  <img alt="css-modules" src="https://img.shields.io/badge/CSS%20Modules-yes-purple" />
  <img alt="license" src="https://img.shields.io/badge/license-MIT-lightgrey" />
</p>
[Show Wiki](https://shome-wiki.raphaelhug.ch/)

A small, modern **React + TypeScript** component library with **CSS Variable** theming.
This README documents the **Button**, **Cards**, **Tooltip**, **StringInput**, and **NumberInput** components in detail, including props, composition, and theming tokens.

---

## Table of Contents
* [Design Tokens](#design-tokens)
* [License](#license)

---

## Design Tokens

Override any token at `:root` (or a wrapper element) to theme the library. These are sensible defaults:

```css
:root {
  /* Typography */
  font-family: 'Arial', Tahoma, Geneva, Verdana, sans-serif;
  --font-size-base: 1rem;
  --font-size-md: 0.875rem;
  --font-size-smaller: 0.75rem;

  /* Spacing / Radius / Motion / Shadows */
  --spacing: .5rem;
  --spacing-xs: calc(var(--spacing) * .5);
  --spacing-sm: var(--spacing);
  --spacing-md: calc(var(--spacing) * 1.5);
  --border-radius: 8px;
  --border-radius-small: calc(var(--border-radius) - 2px);
  --transition-normal: 160ms ease;
  --color-box-shadow: rgba(42, 45, 49, 0.1);
  --shadow-medium: 0 1px 2px var(--color-box-shadow), 0 6px 18px var(--color-box-shadow);

  /* Base palette */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-light: #a9b3c0;
  --color-gray: #6b7280;
  --color-gray-dark: #1d2229;

  /* Brand */
  --color-primary-rgb: 57, 60, 64;
  --color-primary: #393c40;
  --color-primary-dark: #303234;
  --color-primary-light: rgba(var(--color-primary-rgb), 0.8);

  --color-secondary-rgb: 15, 118, 110;
  --color-secondary: #0f766e;
  --color-secondary-dark: #0a544e;
  --color-secondary-light: rgba(var(--color-secondary-rgb), 0.8);

  /* States */
  --color-success-rgb: 25, 135, 84;
  --color-success: #198754;
  --color-success-dark: #166e3a;
  --color-success-light: rgba(var(--color-success-rgb), 0.6);

  --color-danger-rgb: 220, 53, 69;
  --color-danger: #dc3545;
  --color-danger-dark: #b02a37;
  --color-danger-light: rgba(var(--color-danger-rgb), 0.6);

  --color-warning-rgb: 255, 193, 7;
  --color-warning: #ffc107;
  --color-warning-dark: #cc9a06;
  --color-warning-light: rgba(var(--color-warning-rgb), 0.6);

  --color-info-rgb: 13, 110, 253;
  --color-info: #0d6efd;
  --color-info-dark: #0b5ed7;
  --color-info-light: rgba(var(--color-info-rgb), 0.6);

  /* Text / Background */
  --color-text: var(--color-gray-dark);
  --color-background: var(--color-white);

  /* Header / Nav / Layout */
  --nav-height: 3.5rem;
  --nav-border-line: 1px solid var(--color-gray-light, #a9b3c0);

  --header-height: var(--nav-height);
  --header-gap: .5rem;
  --header-margin-left: 1rem;
  --header-color-title: var(--color-secondary);
  --header-color-subtitle: var(--color-black);
  --header-color-env: var(--color-secondary);
  --header-color-bg: var(--color-secondary);
  --header-title-font-size: 1.1rem;
  --header-title-font-weight: bold;
  --header-subtitle-font-size: 1rem;
  --header-env-font-size: 1.1rem;
  --header-env-font-weight: bold;
  --header-title-font-size-sm: 1rem;
  --header-subtitle-font-size-sm: 0.9rem;
  --header-env-font-size-sm: 1rem;

  --layout-sidebar-width-collapsed: calc(var(--spacing) * 8);
  --layout-sidebar-width-expanded: calc(var(--spacing) * 37);
  --layout-sidebar-bg: var(--color-primary);
  --layout-header-height: calc(var(--nav-height) + 1px);
  --layout-header-bg: var(--color-white);
  --layout-header-border: var(--nav-border-line);
  --layout-content-padding: calc(var(--spacing) * 3);
  --layout-content-max-width: 80rem;
  --layout-content-min-width: 0rem;
  --layout-sidebar-height-mobile-collapsed: calc(var(--nav-height) + 1px);
  --layout-sidebar-height-mobile-expanded: 7rem;

  /* Sidebar */
  --sidebar-height: 4rem;
  --sidebar-height-compact: 48px;
  --sidebar-gap: var(--spacing);
  --sidebar-bg: var(--color-primary);
  --sidebar-fg: var(--color-white);
  --sidebar-accent-rgb: var(--color-secondary-rgb);
  --sidebar-item-height: 3.25rem;
  --sidebar-subitem-height: 38px;
  --sidebar-padding-sm: 10px;
  --sidebar-padding-md: 12px;
  --sidebar-margin-sm: 1rem;
  --sidebar-margin-md: 2rem;
  --sidebar-icon-size: 1rem;
  --sidebar-icon-size-compact: 0.8rem;
  --sidebar-transition: 0.3s ease-in-out;
  --sidebar-mobile-nav-height: calc(var(--nav-height) + 1px);
  --sidebar-mobile-icon-size: 1.1rem;
  --sidebar-mobile-gap: 50px;

  /* Buttons */
  --button-color: var(--color-white, #ffffff);
  --button-color-hover: var(--color-white, #ffffff);
  --button-background-color: var(--color-primary, #393c40);
  --button-background-color-hover: var(--color-secondary, #0a544e);

  --button-color-light: var(--color-primary-dark, #303234);
  --button-color-hover-light: var(--color-white, #ffffff);
  --button-background-color-light-rgb: var(--color-primary-rgb, 57, 60, 64);
  --button-background-color-hover-light: var(--color-primary, #393c40);

  --button-color-secondary: var(--color-white, #ffffff);
  --button-color-hover-secondary: var(--color-white, #ffffff);
  --button-background-color-secondary: var(--color-secondary, #0f766e);
  --button-background-color-hover-secondary: var(--color-primary, #393c40);

  --button-color-success: var(--color-white, #ffffff);
  --button-color-hover-success: var(--color-white, #ffffff);
  --button-background-color-success: var(--color-success, #198754);
  --button-background-color-hover-success: var(--color-success-dark, #166e3a);

  --button-color-warning: var(--color-white, #ffffff);
  --button-color-hover-warning: var(--color-white, #ffffff);
  --button-background-color-warning: var(--color-warning, #ffc107);
  --button-background-color-hover-warning: var(--color-warning-dark, #cc9a06);

  --button-color-danger: var(--color-white, #ffffff);
  --button-color-hover-danger: var(--color-white, #ffffff);
  --button-background-color-danger: var(--color-danger, #dc3545);
  --button-background-color-hover-danger: var(--color-danger-dark, #b02a37);

  --button-color-info: var(--color-white, #ffffff);
  --button-color-hover-info: var(--color-white, #ffffff);
  --button-background-color-info: var(--color-info, #0d6efd);
  --button-background-color-hover-info: var(--color-info-dark, #0b5ed7);

  /* Inputs / Labels */
  --color-label-input: var(--color-secondary, #6c757d);
  --color-label-input-focus: var(--color-secondary, #6c757d);

  /* Switch */
  --switch-track-off: var(--color-danger-light, #dc2626);
  --switch-track-on: var(--color-success-light, #16a34a);
  --switch-knob-off: var(--color-danger-dark, #303234);
  --switch-knob-on: var(--color-success-dark, #0f766e);
  --switch-border: var(--color-gray, #6b7280);
  --switch-focus-ring: rgba(13, 110, 253, .35);
  --switch-w: 44px;
  --switch-h: 24px;
  --switch-thumb: 20px;
  --switch-pad: 2px;

  /* Grid (Table) */
  --grid-bg: var(--color-white);
  --grid-fg: var(--color-text);
  --grid-border: var(--color-gray-light);
  --grid-header-bg: var(--color-primary);
  --grid-header-fg: var(--color-white);
  --grid-row-alt: rgba(var(--color-primary-rgb), 0.04);
  --grid-row-hover: rgba(var(--color-secondary-rgb), 0.08);
  --grid-radius: var(--border-radius);
  --grid-shadow: var(--shadow-medium);
  --grid-pad-y: .6rem;
  --grid-pad-x: .75rem;
  --grid-font-size: 1rem;
  --grid-font-head-size: 1.125rem;
  --grid-checkbox-accent: var(--color-secondary);
  --grid-border-strong: var(--color-gray);

  /* Grid (secondary scheme) */
  --grid-font-size-secondary: 0.9rem;
  --grid-font-head-size-secondary: 1rem;
  --grid-header-bg-secondary: var(--color-secondary);
  --grid-header-fg-secondary: var(--color-white);
  --grid-row-alt-secondary: rgba(var(--color-secondary-rgb), 0.05);
  --grid-row-hover-secondary: rgba(var(--color-secondary-rgb), 0.10);

  /* PageGrid (pager) */
  --pg-bg: var(--grid-bg);
  --pg-fg: var(--grid-fg);
  --pg-border: var(--grid-border);
  --pg-hover: var(--grid-row-hover);
  --pg-active-bg: var(--grid-header-bg);
  --pg-active-fg: var(--grid-header-fg);
  --pg-radius: var(--grid-radius);
  --pg-pad-y: .4rem;
  --pg-pad-x: .6rem;
  --pg-gap: .25rem;
  --pg-font: var(--grid-font-size);
  --pg-card-bg: var(--grid-bg);
  --pg-card-border: var(--grid-border);
  --pg-card-radius: 10px;
  --pg-card-shadow: var(--grid-shadow);
  --pg-frame-outer: #c8d3e3;
  --pg-frame-bg: #ffffff;
  --pg-frame-radius: 12px;
  --pg-frame-shadow: 0 1px 2px rgba(8, 24, 55, .06), 0 4px 18px rgba(8, 24, 55, .06);
  --pg-size: 34px;

  /* Select */
  --select-bg: var(--color-white, #fff);
  --select-fg: var(--color-gray-dark, #1d2229);
  --select-border: var(--color-gray-light, #c5cfdd);
  --select-border-focus: var(--color-secondary, #0f766e);
  --select-placeholder: var(--color-gray, #6b7280);
  --select-radius: var(--border-radius, 10px);
  --select-shadow: var(--shadow-medium);
  --select-pad-y: .5rem;
  --select-pad-x: .75rem;
  --select-tag-bg: rgba(15, 118, 110, .1);
  --select-tag-fg: var(--color-secondary, #0f766e);
  --select-tag-remove-fg: var(--color-gray, #6b7280);
  --select-opt-hover: #f2f6fb;
  --select-opt-selected-bg: rgba(15, 118, 110, .12);
  --select-opt-selected-fg: var(--color-secondary, #0f766e);

  /* Select (secondary theme) */
  --select-bg-secondary: var(--color-white, #fff);
  --select-fg-secondary: var(--color-gray-dark, #1d2229);
  --select-border-secondary: var(--color-secondary, #0f766e);
  --select-opt-selected-bg-secondary: rgba(15, 118, 110, .16);
  --select-opt-selected-fg-secondary: var(--color-secondary, #0f766e);

  /* Z-index */
  --select-z: 20;
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

* Semantic `<button>` by default; switches to `<a>` when `link` is set (with `rel="noopener noreferrer"` for `_blank`).
* Focus handling on click (removes focus ring after activation).
* Ensure contrast when customizing tokens.

## Styling Hooks

* Root: `.actionButton`
* Content: `.IconContainer`, `.IconTwo`, `.buttonText`
* Expander: `.expandetIcon` + `.animateIcon` / `.animateIconBack`
* Disabled fallback: `.notAllowed`
* Variants: `.primary`, `.secondary`, `.success`, `.danger`, `.warning`, `.info`, `.light` (+ `*Light`)

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

* `.cards`, `.cards-expandet`, `.cards-link`
* `.card-container`, `.cards-container-expandet`
* `.image-container`, `.image-container-expandet`, `.image-container-expandet-is-right`
* `.content-container`, `.content-container-image`
* `.contents-container`
* `.expander-container` (+ `.open`)
* `.expandet-icon` (+ `.animate-icon` / `.animate-icon-back`)
* `.iconCard`, `.imageCard`

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

* Panel background: `var(--color-gray-dark)`
* Panel text: `var(--color-white)`
* Panel radius: `var(--border-radius)`
* Font size: `var(--font-size-smaller)`
* Max width: `calc(100vw - var(--spacing))`
* Focus outline on trigger: `var(--color-gray)`

## Accessibility

* Opens on **hover and focus**, dismisses on **Esc** or outside click by default.
* `TooltipContent` has `role="tooltip"`.
* Trigger uses `:focus-visible` outline for keyboard users.
* Keep sufficient contrast when customizing colors.

---

# StringInput

Lightweight text input with floating label, optional **password toggle**, **live email validation**, **noBorder** variant, and **disabled** state.

## Import

```tsx
import { StringInput } from "shome-components";
```

## Usage

```tsx
const [v, setV] = useState("");
<StringInput label="Label" value={v} onChange={setV} />

<StringInput label="Username" value={v} onChange={setV} iconLeft={faUser} />

<StringInput label="Password" value={v} onChange={setV} password iconLeft={faLock} />

<StringInput label="E‑mail" value={v} onChange={setV} email required />

<StringInput label="E‑mail" value={v} onChange={setV} noBorder />

<StringInput label="Read only" value={v} onChange={setV} disabled />
```

## Props

| Prop           | Type                  |  Default | Description                                      |
| -------------- | --------------------- | :------: | ------------------------------------------------ |
| `label`        | `string`              |     —    | Floating label.                                  |
| `value`        | `string`              |     —    | Controlled value.                                |
| `onChange`     | `(v: string) => void` |     —    | Change handler.                                  |
| `noBorder`     | `boolean`             |  `false` | Slim variant: bottom border only.                |
| `defaultValue` | `string`              |   `""`   | Initial visual value.                            |
| `type`         | `string`              | `"text"` | Fallback type when not using `password`/`email`. |
| `iconLeft`     | `IconProp`            |     —    | FontAwesome icon on the left.                    |
| `password`     | `boolean`             |  `false` | Show/hide toggle on the right.                   |
| `email`        | `boolean`             |  `false` | Sets `type=email` and enables live validation.   |
| `required`     | `boolean`             |  `false` | Native form validation.                          |
| `disabled`     | `boolean`             |  `false` | Disables the field & interactions.               |

## Validation & Behavior

* Floating label relies on `placeholder=" "` and the `active`/`:placeholder-shown` mechanics.
* **Live email validation**: While focused and non-empty, a simple email pattern is checked. When invalid, field/label/icons turn red (`.invalid`). Disabled state skips validation.
* Password toggle switches the input between `password`/`text`.

## Styling Hooks

Shared classes (see `StringInput.css`):

* Container & field: `.string-input-container`, `.string-input`
* Label: `.string-input-label`, `.string-input-label-icon-left`
* Icons: `.icon-left`, `.icon-right`
* Variants: `.no-border`, `.invalid`, `.is-disabled`

---

# NumberInput

Numeric input in the same layout. Supports **min/max/step**, **decimals**, **stepper (+/−)**, **clamping** on commit, **preventWheel**, and **disabled** state.

## Import

```tsx
import { NumberInput } from "shome-components";
```

## Usage

```tsx
const [n, setN] = useState<number | null>(0);
<NumberInput label="Amount" value={n} onChange={setN} />

<NumberInput label="Order #" value={n} onChange={setN} iconLeft={faHashtag} />

<NumberInput label="Qty (1..10)" value={n} onChange={setN} min={1} max={10} step={1} />

<NumberInput label="Price" value={n} onChange={setN} step={0.25} decimals={2} min={0} max={999} />

<NumberInput label="Value" value={n} onChange={setN} showStepper={false} preventWheel />

<NumberInput label="Locked" value={n} onChange={setN} disabled />
```

## Props

| Prop           | Type                          | Default | Description                             |
| -------------- | ----------------------------- | :-----: | --------------------------------------- |
| `label`        | `string`                      |    —    | Floating label.                         |
| `value`        | `number \| null`              |    —    | Controlled value. `null` = empty.       |
| `onChange`     | `(v: number \| null) => void` |    —    | Change handler.                         |
| `noBorder`     | `boolean`                     | `false` | Slim variant.                           |
| `defaultValue` | `number`                      |    —    | Initial value when `value == null`.     |
| `iconLeft`     | `IconProp`                    |    —    | FontAwesome icon on the left.           |
| `step`         | `number`                      |   `1`   | Stepper increment.                      |
| `min`          | `number`                      |    —    | Lower bound (clamped on commit).        |
| `max`          | `number`                      |    —    | Upper bound (clamped on commit).        |
| `decimals`     | `number`                      |    —    | Rounds to this many decimals on commit. |
| `showStepper`  | `boolean`                     |  `true` | Show +/− buttons on the right.          |
| `preventWheel` | `boolean`                     |  `true` | Prevents scroll-based value changes.    |
| `disabled`     | `boolean`                     | `false` | Disables field & stepper.               |

## Behavior

* Input uses `type="text"` + `inputMode="decimal"` for better mobile keypads.
* Regex allows `-`, digits, and one decimal separator (`,` or `.`). Internally `,` is normalized to `.`.
* **Commit** (on blur or via stepper): `round(decimals)` → `clamp(min/max)` → `onChange`.
* Stepper increments/decrements from the current value (or `0`), respecting `decimals` and bounds.

## Styling Hooks

* Shares classes with StringInput: `.string-input-container`, `.string-input`, label & icon classes.
* Extra wrapper for buttons: `.number-stepper` (inside the `.icon-right` slot).

---

# Switch

Simple, themed toggle switch. Controlled via `checked`/`onChange`. Uses a hidden checkbox and a slider track.

## Import

```tsx
import { Switch } from "shome-components";
import "shome-components/Switch/Switch.css";
```

## Usage

```tsx
const [on, setOn] = useState(false);
<Switch checked={on} onChange={setOn} />

// With an accessible label
<label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
  Dark mode
  <Switch checked={on} onChange={setOn} />
</label>
```

## Props

| Prop       | Type                         | Default | Description                           |
| ---------- | ---------------------------- | :-----: | ------------------------------------- |
| `checked`  | `boolean`                    |    —    | Current on/off state.                 |
| `onChange` | `(checked: boolean) => void` |    —    | Called with the next state on toggle. |

## Accessibility

* The underlying `input[type="checkbox"]` is present for semantics. Consider connecting a visible `<label>` as in the example, or set `aria-label` on the wrapper.
* Recommended enhancement (keyboard support on the wrapper):

```tsx
<div
  className="switch"
  onClick={toggleSwitch}
  role="switch"
  aria-checked={checked}
  tabIndex={0}
  onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && toggleSwitch()}
>
  <input type="checkbox" className="switch-input" checked={checked} readOnly />
  <span className="switch-slider" />
</div>
```

This preserves the current CSS while enabling Space/Enter toggling.

## Styling Hooks

* Root: `.switch`
* Elements: `.switch-input` (hidden checkbox), `.switch-slider` (track/knob)
* States: `.switch-input:checked + .switch-slider`, `.switch-input:checked + .switch-slider:before`, `.switch-input:focus + .switch-slider`

## Theming

Consumed tokens (with sensible fallbacks in your global tokens):

```css
:root {
  --color-danger: #dc3545;   /* off background */
  --color-success: #198754;  /* on background */
  --color-primary-dark: #303234; /* knob + border */
  --color-secondary-dark: #0a544e; /* knob when on */
}
```

---

## License

MIT © Raphael Hug
