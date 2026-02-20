# shome-components in Next.js (App Router)

## Install
- `npm i`
- `npm i -D sass` (if not already)

## Global styles (required)
Import the global stylesheet **once** in `app/layout.tsx`:

```ts
import "shome-components/src/styles/next.scss";
```

This includes:
- base tokens + resets (`src/styles`)
- component global css files (Button/Cards/Tooltip/…)
- `react-datepicker` css

## Client components
Many components use hooks / context and are marked with `"use client"`.
Use them in Client Components, or import them from Server Components via a Client wrapper.
