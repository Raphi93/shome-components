import type { Preview } from '@storybook/react';

// Base component library styles (SCSS compiled by Vite)
import '../src/Styles/index.scss';

// ─── Available CSS themes (files in public/Theme/) ───────────────────────────
const THEMES = [
  { value: 'none',             title: '— None (base only) —' },
  { value: 'Light',            title: 'Light'            },
  { value: 'Dark',             title: 'Dark'             },
  { value: 'SmartHome',        title: 'SmartHome'        },
  { value: 'Corporate',        title: 'Corporate'        },
  { value: 'ExecutiveSuite',   title: 'Executive Suite'  },
  { value: 'UltraModern',      title: 'Ultra Modern'     },
  { value: 'Ocean',            title: 'Ocean'            },
  { value: 'Forest',           title: 'Forest'           },
  { value: 'Aurora',           title: 'Aurora'           },
  { value: 'Sakura',           title: 'Sakura'           },
  { value: 'ArtStudio',        title: 'Art Studio'       },
  { value: 'TechStack',        title: 'Tech Stack'       },
  { value: 'NeonNoir',         title: 'Neon Noir'        },
  { value: 'Synthwave',        title: 'Synthwave'        },
  { value: 'CyberPunk',        title: 'CyberPunk'        },
  { value: 'Gothic',           title: 'Gothic'           },
  { value: 'Apocalypse',       title: 'Apocalypse'       },
  { value: 'RetroGaming',      title: 'Retro Gaming'     },
  { value: 'SteamPunk',        title: 'SteamPunk'        },
  { value: 'StarWars',         title: 'Star Wars'        },
  { value: 'RomanImperial',    title: 'Roman Imperial'   },
  { value: 'GradientPlayground', title: 'Gradient Playground' },
];

// Inject or swap the theme <link> element
function applyThemeCss(themeName: string): void {
  const LINK_ID = 'storybook-css-theme';
  let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;

  if (themeName === 'none') {
    link?.remove();
    return;
  }

  const href = `/Theme/${themeName}.css`;

  if (!link) {
    link = document.createElement('link');
    link.id   = LINK_ID;
    link.rel  = 'stylesheet';
    document.head.appendChild(link);
  }

  if (link.getAttribute('href') !== href) {
    link.href = href;
  }
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date:  /date$/i,
      },
    },

    // Background presets — drives data-theme toggle
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'gray',  value: '#f5f5f5' },
        { name: 'dark',  value: '#111111' },
      ],
    },

    viewport: {
      defaultViewport: 'desktop',
    },

    docs: {
      toc: true,
    },
  },

  decorators: [
    (Story, context) => {
      // 1. Switch dark/light mode via data-theme attribute
      const bg    = context.globals['backgrounds']?.value ?? '#ffffff';
      const isDark = bg === '#111111';
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

      // 2. Inject the selected CSS theme file
      const selectedTheme = context.globals['cssTheme'] ?? 'Light';
      applyThemeCss(selectedTheme);

      return Story();
    },
  ],

  globalTypes: {
    cssTheme: {
      name: 'CSS Theme',
      description: 'Select a public theme CSS file',
      defaultValue: 'Light',
      toolbar: {
        icon: 'paintbrush',
        items: THEMES,
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
