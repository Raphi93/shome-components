# @raphi93/shome-components

A production-ready React + TypeScript component library with CSS custom property theming. Designed for **Next.js App Router (SSR)** and **Vite** projects.

[![npm version](https://img.shields.io/npm/v/@raphi93/shome-components)](https://www.npmjs.com/package/@raphi93/shome-components)
[![license](https://img.shields.io/npm/l/@raphi93/shome-components)](LICENSE)
[![node](https://img.shields.io/node/v/@raphi93/shome-components)](package.json)

---

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Components](#components)
- [Theming](#theming)
- [Peer Dependencies](#peer-dependencies)
- [Building](#building)
- [Links](#links)
- [License](#license)

---

## Installation

```bash
npm install @raphi93/shome-components
```

Install the required peer dependencies:

```bash
npm install react react-dom \
  @fortawesome/fontawesome-svg-core \
  @fortawesome/free-solid-svg-icons \
  @fortawesome/free-regular-svg-icons \
  @fortawesome/free-brands-svg-icons \
  @fortawesome/react-fontawesome \
  @floating-ui/react \
  i18next react-i18next \
  react-select
```

---

## Setup

### Import Styles

Import the compiled stylesheet once at your application root. It provides all component styles and CSS custom property defaults.

```ts
import '@raphi93/shome-components/styles.css';
```

### Next.js App Router

The library ships `'use client'` directives in the bundle — no additional configuration required. Components that rely on browser APIs (`Sidebar`, `ChatBot`, `SearchBox`, etc.) are already annotated internally and integrate seamlessly with the App Router.

```tsx
// app/layout.tsx
import '@raphi93/shome-components/styles.css';
```

```tsx
// Any client component
'use client';
import { Button, Sidebar } from '@raphi93/shome-components';
```

### Vite

No special configuration needed. Import styles in your entry point:

```ts
// main.ts or main.tsx
import '@raphi93/shome-components/styles.css';
```

The package ships both **ESM** (`dist/esm/`) and **CJS** (`dist/cjs/`) builds, compatible with any modern bundler.

---

## Components

| Component | Description |
|---|---|
| `Alert` | Dismissible alert messages — info, success, warning, error |
| `Actions` / `ActionElement` | Toolbar action buttons |
| `AppLayout` | Top-level application shell layout |
| `AppMessageBox` | Application-wide notification overlay with auto-dismiss |
| `AppToggleActive` | Toggle button for active/inactive state |
| `Breadcrumbs` | Navigation breadcrumb trail |
| `Button` | Primary, secondary, and icon button variants |
| `Cards` / `CardChildren` | Content card containers |
| `ChatBot` | Chat interface with IndexedDB message persistence |
| `ErrorText` | Inline form validation error display |
| `FieldSet` | Fieldset wrapper with legend |
| `FieldWrapper` | Form field wrapper with label, icons, and validation state |
| `Grid` | Data grid with column resizing and sorting |
| `Header` | Application header bar |
| `HideElement` | Conditional visibility wrapper |
| `ImageCard` | Image with overlay and caption |
| `ImageLightBox` | Full-screen image lightbox |
| `Main` | Main content area container |
| `MessageBox` | Inline message display with auto-scroll support |
| `MultiDatePickers` | Single and range date pickers |
| `Pager` | Pagination controls |
| `Search` / `SearchBox` | Search input with optional voice recognition |
| `Select` / `CreatableAsyncSelect` | Enhanced select inputs built on react-select |
| `Sidebar` | Collapsible navigation sidebar for desktop and mobile |
| `Spinner` | Loading spinners |
| `Tooltip` | Floating tooltip powered by @floating-ui/react |
| `Screw` | Decorative screw element |

### Usage Examples

```tsx
import { Button, Alert, Sidebar } from '@raphi93/shome-components';

// Button
<Button variant="primary" onClick={() => {}}>Save</Button>

// Alert
<Alert type="success" message="Changes saved successfully." />

// Sidebar
<Sidebar
  menu={navigationItems}
  expanded={sidebarOpen}
  setExpanded={setSidebarOpen}
  isMobile={isMobile}
/>
```

---

## Theming

All visual properties are controlled through **CSS custom properties** on `:root`. Override them in your global stylesheet to match your brand — no rebuilding required.

### Colors

```css
:root {
  /* Brand */
  --color-primary:           #008ff9;
  --color-primary-dark:      #2c5b9a;
  --color-primary-darkest:   #00467a;
  --color-primary-light:     #addcff;

  /* Semantic */
  --color-positive:          #82bc3c;
  --color-negative:          #d64856;
  --color-warning:           #ffc000;

  /* Navigation */
  --color-mod-nav-theme:           var(--color-primary-darkest);
  --color-mod-nav-theme-variant-1: var(--color-primary);
  --color-mod-nav-theme-variant-2: var(--color-primary-dark);
  --color-mod-nav-theme-contrast:  #ffffff;

  /* Text */
  --color-text:              #212121;
  --color-text-light:        #707070;
  --color-text-inverted:     #ffffff;
}
```

### Layout & Spacing

```css
:root {
  --spacing:                 0.5rem;    /* 8px baseline grid */
  --border-radius:           0.313rem;
  --nav-width:               20.5rem;
  --nav-module-width:        4rem;
  --content-max-width:       93.75rem;
  --sidebar-extended-width:  16rem;
}
```

### Typography

```css
:root {
  --font-primary:            'Segoe UI', Helvetica, sans-serif;
  --font-size-base:          1rem;
  --font-size-smaller:       0.875rem;
  --font-size-small:         0.75rem;
}
```

### Scrollbars

```css
:root {
  --scrollbar-size:          0.375rem;
  --scrollbar-color:         var(--color-gray-400);
  --scrollbar-color-hover:   var(--color-gray-500);
  --scrollbar-color-active:  var(--color-primary);
}
```

---

## Peer Dependencies

| Package | Required | Purpose |
|---|---|---|
| `react` ≥ 18 | Yes | |
| `react-dom` ≥ 18 | Yes | |
| `@fortawesome/fontawesome-svg-core` ≥ 7 | Yes | Icon rendering |
| `@fortawesome/free-solid-svg-icons` ≥ 7 | Yes | Icon set |
| `@fortawesome/free-regular-svg-icons` ≥ 7 | Yes | Icon set |
| `@fortawesome/free-brands-svg-icons` ≥ 7 | Yes | Icon set |
| `@fortawesome/react-fontawesome` ≥ 3 | Yes | |
| `@floating-ui/react` ≥ 0.27 | Yes | Tooltip positioning |
| `i18next` ≥ 25 | Yes | Translations |
| `react-i18next` ≥ 16 | Yes | Translations |
| `react-select` ≥ 5 | Yes | Select components |
| `date-fns` ≥ 4 | Optional | DatePicker components |
| `react-datepicker` ≥ 9 | Optional | DatePicker components |
| `lodash` ≥ 4.17 | Optional | Utility functions |
| `react-icons` ≥ 5 | Optional | Additional icons |
| `react-responsive` ≥ 10 | Optional | Responsive hooks |
| `react-router-dom` ≥ 6 | Optional | Routing integration |
| `react-speech-recognition` ≥ 4 | Optional | Voice search |
| `react-spinners` ≥ 0.17 | Optional | Spinner variants |
| `next` ≥ 13 | Optional | App Router support |

---

## Building

Requires Node.js `>=20 <25`.

```bash
# Install dependencies
npm install

# Build JS (ESM + CJS), type declarations, and standalone CSS
npm run rollup

# Lint TypeScript
npm run lint:ts

# Lint and auto-fix
npm run lint:ts:fix
```

Output is written to `dist/`:

```
dist/
  esm/index.js      ESM build
  cjs/index.js      CommonJS build
  index.d.ts        TypeScript declarations
  styles.css        Compiled stylesheet
```

---

## Links

- [Documentation](https://shome-wiki.raphaelhug.ch/)
- [npm](https://www.npmjs.com/package/@raphi93/shome-components)
- [GitHub](https://github.com/raphi93/shome-components)
- [Issues](https://github.com/raphi93/shome-components/issues)

---

## License

[MIT](LICENSE) © RHUG
