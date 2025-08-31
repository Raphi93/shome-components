import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { PageProvider } from "../../context/PageContext";

// Komponenten & Typen (Barrel-Export)
import { AppLayout } from "../../components";
import type { NavigationItem } from "../../components";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChartBar, faCog, faUser, faLock } from "@fortawesome/free-solid-svg-icons";

// —— Decorators: Router + PageProvider für JEDE Story in dieser Datei
export const decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <PageProvider>
        <Story />
      </PageProvider>
    </MemoryRouter>
  ),
];

const meta: Meta<typeof AppLayout> = {
  title: "sHome Components/Layout/AppLayout",
  component: AppLayout,
  parameters: { layout: "fullscreen" },
  argTypes: {
    showSidebar: { control: "boolean" },
    showHeader: { control: "boolean" },
    isMobile: { control: "boolean" },
    expanded: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof AppLayout>;

// Menü mit Dashboard als Hauptlogo-Eintrag
const sampleMenu: NavigationItem[] = [
  { label: "Reports", icon: faChartBar, link: "/reports", isFontAwesome: true },
  {
    label: "Settings",
    icon: faCog,
    link: "/settings",
    isFontAwesome: true,
    children: [
      { label: "Profile", link: "/settings/profile", isFontAwesome: true },
      { label: "Security", link: "/settings/security", isFontAwesome: true },
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
    image: "https://img.lovepik.com/png/20231031/Avatar-user-placeholder-label-logo-Avatar-Head-tag-Head-logo_431011_wh1200.png",
    imageLong: "https://kyleplushanswerthecall.org/wp-content/uploads/2018/07/kp-logo-placeholder.png",
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
