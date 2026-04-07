import type { Preview } from '@storybook/react';
import '../src/Styles/index.scss';

// ─── CSS theme files in public/Theme/ ────────────────────────────────────────
const CSS_THEMES = [
  { value: 'none',               title: '— Base only —'         },
  { value: 'Light',              title: 'Light'                 },
  { value: 'Dark',               title: 'Dark'                  },
  { value: 'SmartHome',          title: 'SmartHome'             },
  { value: 'Corporate',          title: 'Corporate'             },
  { value: 'ExecutiveSuite',     title: 'Executive Suite'       },
  { value: 'UltraModern',        title: 'Ultra Modern'          },
  { value: 'Ocean',              title: 'Ocean'                 },
  { value: 'Forest',             title: 'Forest'                },
  { value: 'Aurora',             title: 'Aurora'                },
  { value: 'Sakura',             title: 'Sakura'                },
  { value: 'ArtStudio',          title: 'Art Studio'            },
  { value: 'TechStack',          title: 'Tech Stack'            },
  { value: 'NeonNoir',           title: 'Neon Noir'             },
  { value: 'Synthwave',          title: 'Synthwave'             },
  { value: 'CyberPunk',          title: 'CyberPunk'             },
  { value: 'Gothic',             title: 'Gothic'                },
  { value: 'Apocalypse',         title: 'Apocalypse'            },
  { value: 'RetroGaming',        title: 'Retro Gaming'          },
  { value: 'SteamPunk',          title: 'SteamPunk'            },
  { value: 'StarWars',           title: 'Star Wars'             },
  { value: 'RomanImperial',      title: 'Roman Imperial'        },
  { value: 'GradientPlayground', title: 'Gradient Playground'   },
];

// Swap the injected <link> without flashing
function applyThemeCss(name: string): void {
  const ID   = 'sb-css-theme';
  let   link = document.getElementById(ID) as HTMLLinkElement | null;

  if (name === 'none') { link?.remove(); return; }

  const href = `/Theme/${name}.css`;
  if (!link) {
    link     = document.createElement('link');
    link.id  = ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== new URL(href, location.origin).href) link.href = href;
}

const preview: Preview = {
  // Enable autodocs for every story — generates a Docs page from JSDoc + argTypes
  tags: ['autodocs'],

  parameters: {
    // ── Controls ───────────────────────────────────────────────────────────
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date:  /[dD]ate/,
      },
      expanded: true,
    },

    // ── Backgrounds (drives dark-mode toggle) ──────────────────────────────
    backgrounds: {
      default: 'Light',
      values: [
        { name: 'Light',     value: '#ffffff' },
        { name: 'Surface',   value: '#f4f4f5' },
        { name: 'Dark',      value: '#0f1117' },
        { name: 'Dark deep', value: '#0c0c10' },
      ],
    },

    // ── Layout ─────────────────────────────────────────────────────────────
    layout: 'padded',

    // ── Docs ───────────────────────────────────────────────────────────────
    docs: {
      toc: true,
    },

    // ── Actions ────────────────────────────────────────────────────────────
    actions: { argTypesRegex: '^on[A-Z].*' },
  },

  // ── Decorators ───────────────────────────────────────────────────────────
  decorators: [
    (Story, context) => {
      // 1. data-theme from background selection
      const bgValue = context.globals['backgrounds']?.value ?? '#ffffff';
      const isDark  = bgValue === '#0f1117' || bgValue === '#0c0c10';
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

      // 2. Inject selected CSS theme file
      applyThemeCss(context.globals['cssTheme'] ?? 'Light');

      return Story(context);
    },
  ],

  // ── Toolbar globals ───────────────────────────────────────────────────────
  globalTypes: {
    cssTheme: {
      name:         'Theme',
      description:  'Select a CSS theme from public/Theme/',
      defaultValue: 'Light',
      toolbar: {
        icon:         'paintbrush',
        items:        CSS_THEMES,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
