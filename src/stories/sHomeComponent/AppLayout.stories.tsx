// stories/AppLayout.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { PageProvider } from "../../context/PageContext";

import { AppLayout } from "../../components";
import type { NavigationItem } from "../../components";

import { faChartBar, faCog, faUser, faLock } from "@fortawesome/free-solid-svg-icons";

const sampleMenu: NavigationItem[] = [
  { label: "Reports", icon: faChartBar, link: "/reports", isFontAwesome: true },
  {
    label: "Settings",
    icon: faCog,
    link: "/settings",
    isFontAwesome: true,
    children: [
      { label: "Profile", icon: faUser, link: "/settings/profile", isFontAwesome: true },
      { label: "Security", icon: faLock, link: "/settings/security", isFontAwesome: true },
    ],
  },
];

const meta: Meta<typeof AppLayout> = {
  title: "sHome Components/Layout/AppLayout",
  component: AppLayout,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <PageProvider>
        <Story />
      </PageProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
High-level layout shell with **Sidebar**, **Header**, and **Content** area.
Use it to wrap pages and drive navigation (desktop + mobile).

### Composition
- \`<AppLayout>\` wraps your page content (children).
- Provide \`menu: NavigationItem[]\` to render sidebar items (supports nested children).
- Toggle layout modes via \`expanded\`, \`isMobile\`, \`showSidebar\`, \`showHeader\`.

### Props (key)
- **title / subtitle / envTitle**: text in the header.
- **showSidebar / showHeader**: show/hide major regions.
- **expanded**: controls sidebar open/closed (desktop or mobile).
- **isMobile**: forces the mobile layout behavior.
- **image / imageLong**: logos for square and wide space.
- **menu**: navigation model (see story source for example).
- **upperComponent**: optional element above main content.

### Theming tokens
Reads your global CSS variables:
- \`--layout-content-max-width\`, \`--layout-content-padding\`
- \`--layout-sidebar-width-collapsed\`, \`--layout-sidebar-width-expanded\`
- \`--layout-header-bg\`, \`--layout-header-border\`
- \`--sidebar-*\\\` and brand color tokens

Override them at \`:root\` or a wrapper to theme the shell.
        `.trim(),
      },
    },
  },
  argTypes: {
    title: { control: "text", description: "Header title." },
    subtitle: { control: "text", description: "Header subtitle." },
    envTitle: { control: "text", description: "Environment label in header." },
    showSidebar: { control: "boolean", description: "Show/hide the sidebar." },
    showHeader: { control: "boolean", description: "Show/hide the header." },
    isMobile: { control: "boolean", description: "Force mobile layout behavior." },
    expanded: { control: "boolean", description: "Sidebar expanded/collapsed state." },
    reset: { control: "boolean", description: "Optional reset flag used by layout." },
    image: { control: "text", description: "Square logo (URL)." },
    imageLong: { control: "text", description: "Wide logo (URL)." },
    menu: { control: false, description: "Navigation model for the sidebar." },
    upperComponent: { control: false, description: "Optional node above content." },
    handleImageClick: { action: "imageClick", description: "Logo click handler." },
    handleGenerateImage: { control: false, description: "Optional SVG transform hook." },
    handleContentClick: { action: "contentClick", description: "Content wrapper click." },
    children: { control: false, description: "Your page content." },
  },
};
export default meta;

type Story = StoryObj<typeof AppLayout>;

export const Basic: Story = {
  args: {
    title: "Dashboard",
    subtitle: "Welcome back",
    envTitle: "Development",
    showSidebar: true,
    showHeader: true,
    isMobile: false,
    expanded: true,
    reset: false,
    image:
      "https://img.lovepik.com/png/20231031/Avatar-user-placeholder-label-logo-Avatar-Head-tag-Head-logo_431011_wh1200.png",
    imageLong:
      "https://kyleplushanswerthecall.org/wp-content/uploads/2018/07/kp-logo-placeholder.png",
  },
  render: (args) => {
    const [expanded, setExpanded] = useState<boolean>(args.expanded ?? true);
    return (
      <AppLayout
        {...args}
        expanded={expanded}
        setExpanded={setExpanded}
        menu={sampleMenu}
        handleImageClick={() => alert("Logo clicked")}
        handleGenerateImage={(svg) => svg}
        handleContentClick={() => console.log("Content clicked")}
        upperComponent={<div style={{ padding: "1rem" }}>Upper component</div>}
      >
        <div style={{ padding: "1rem" }}>
          <h2>Content Area</h2>
          <p>
            This is the content inside the <code>Main</code> wrapper.
          </p>
        </div>
      </AppLayout>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default desktop layout with sidebar expanded. Resize or toggle `expanded` to see the behavior.",
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    title: "Dashboard",
    subtitle: "Mobile View",
    envTitle: "Dev",
    showSidebar: true,
    showHeader: true,
    isMobile: true,
    expanded: false,
    reset: false,
    image:
      "https://img.lovepik.com/png/20231031/Avatar-user-placeholder-label-logo-Avatar-Head-tag-Head-logo_431011_wh1200.png",
    imageLong:
      "https://kyleplushanswerthecall.org/wp-content/uploads/2018/07/kp-logo-placeholder.png",
  },
  render: (args) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    return (
      <div
        className="sb-force-mobile"
        style={{ width: 390, height: 844, border: "1px solid #333", margin: "0 auto" }}
      >
        {/* Story-local CSS to force the mobile grid template */}
        <style>{`
          .sb-force-mobile .app-layouts {
            min-height: 0vh;
            grid-template-columns: 1fr;
            grid-template-areas:
              "sidebar"
              "headers"
              "content";
          }
          .sb-force-mobile .app-layouts.collapsed {
            --sidebar-height: calc(var(--nav-height) + 1px);
            --isHidden: visible;
            --position: relative;
          }
          .sb-force-mobile .app-layouts.expanded {
            --sidebar-height: 80svh;
            --isHidden: hidden;
            --position: fixed;
          }
          .sb-force-mobile .app-layouts .sidebar {
            width: 100%;
            min-height: var(--sidebar-height);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .sb-force-mobile .app-layouts .header {
            width: 100%;
            height: calc(var(--nav-height) + 1px);
            visibility: var(--isHidden);
            position: var(--position);
          }
          .sb-force-mobile .app-layouts .content {
            width: 100%;
            max-width: 390px !important;
            padding: var(--layout-content-padding);
            visibility: var(--isHidden);
            position: var(--position);
            margin: 0 auto;
          }
        `}</style>

        <AppLayout
          {...args}
          expanded={expanded}
          setExpanded={setExpanded}
          menu={sampleMenu}
          handleImageClick={() => alert("Logo clicked")}
          handleGenerateImage={(svg) => svg}
          handleContentClick={() => console.log("Content clicked")}
        >
          <div style={{ padding: "1rem" }}>
            <h2>Mobile Content</h2>
            <p>Simulated phone viewport (390×844).</p>
          </div>
        </AppLayout>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Forced mobile layout regardless of viewport. The story injects a scoped CSS override to preview the one-column template.",
      },
    },
  },
};
