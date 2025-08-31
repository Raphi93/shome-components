import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { PageProvider } from "../../context/PageContext";

// Komponenten & Typen (Barrel-Export)
import { AppLayout } from "../../components";
import type { NavigationItem } from "../../components";

// FontAwesome Icons
import { faChartBar, faCog, faUser, faLock } from "@fortawesome/free-solid-svg-icons";

const meta: Meta<typeof AppLayout> = {
  title: "sHome Components/Layout/AppLayout",
  component: AppLayout,
  parameters: { layout: "fullscreen" },
  argTypes: {
    showSidebar: { control: "boolean" },
    showHeader: { control: "boolean" },
    expanded: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof AppLayout>;

// Menü mit Unterpunkten
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

export const Basic: Story = {
  args: {
    title: "Dashboard",
    subtitle: "Willkommen zurück",
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
};

// ——— zweite Story: Mobile/kompakter Zustand (erzwingt Mobile-Layout, unabhängig von max-width: 800px)
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
        {/* Story-spezifischer CSS-Override */}
        <style>{`
          /* Erzwinge Mobile-Layout immer in dieser Story */
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
            max-width: 390px !important;   /* überschreibt 100rem */
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
            <p>Simulierter „Phone“-Viewport (390×844).</p>
          </div>
        </AppLayout>
      </div>
    );
  },
};
