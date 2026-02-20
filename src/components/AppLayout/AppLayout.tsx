"use client";

import { ReactNode, useEffect, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { Header } from "../Header/Header";
import { Main } from "../Main/Main";
import { Sidebar } from "../Sidebar/Sidebar";
import { useLocationSidebar } from "../Sidebar/useLocationSidebar";
import { NavigationItem } from "../../types/Layout/Layout";

import "./AppLayouts.scss";

export interface AppPageWrapperProps {
  children: ReactNode;
  upperComponent: ReactNode;
  image: string;
  imageLong: string;
  handleGenerateImage?: (svg: string) => string | null;
  handleImageClick: () => void;
  title: string;
  buttons?: ReactNode;
  menu: NavigationItem[];
  showSidebar: boolean;
  subtitle?: string;
  envTitle?: string;
  showHeader: boolean;
  isMobile: boolean;
  closeText?: string;
  expanded: boolean;
  handleContentClick?: () => void;
  setExpanded: (expanded: boolean) => void;
  handleSpecialMenuClick?: (menuId: number) => void;
  hasSpecialMenu?: boolean;
  menuTypes?: { key: number; label: string; icon: IconProp | string }[];
  isMenuId?: number;
  useLocationSidebarSelf?: ReturnType<typeof useLocationSidebar>;
  brandName?: string;
}

/**
 * AppLayout component wrapper that composes the application's main layout including an optional sidebar,
 * header and the main content area. It adapts its CSS grid layout and behavior for mobile vs desktop,
 * manages a small set of local UI state for animations/expansion and exposes click handlers to coordinate
 * interactions between the main content and sidebar.
 *
 * The component:
 * - Builds a CSS class string based on expansion, sidebar and header visibility: "app-layouts", plus
 *   "expanded" | "collapsed", and optional "no-sidebar" / "no-header".
 * - Computes a grid-based style (gridTemplateAreas / rows / columns) that differs for mobile (single column)
 *   and non-mobile (sidebar + headers or content areas).
 * - Renders Sidebar when showSidebar is true and Header when showHeader is true.
 * - Renders NewMain as the content container; clicking it will call handleContentClick (if provided)
 *   and toggle an internal `reset` flag which is passed to Sidebar (useful to force sidebar refresh).
 * - Manages two timed UI flags:
 *   - expanderDelayed: set to true 300ms after expanded becomes true; used to render a "mobile-dim"
 *     overlay on mobile while expansion animation completes.
 *   - contentExpander: controls a mobile-only content animation state toggled with a 500ms delay when
 *     isMobile and expanded change.
 *
 * Props:
 * @param children - The main content to render inside the layout.
 * @param upperComponent - Optional component rendered above the main children inside NewMain.
 * @param menu - Data used to populate the sidebar menu.
 * @param image - Primary image used by the sidebar/header.
 * @param imageLong - Alternate/long-form image used by the sidebar.
 * @param handleGenerateImage - Callback invoked to trigger image generation from the sidebar.
 * @param handleImageClick - Callback invoked when the sidebar/header image is clicked.
 * @param title - Title string displayed by the header.
 * @param buttons - Array or node of action buttons rendered in the header.
 * @param showSidebar - Whether to render the sidebar.
 * @param subtitle - Subtitle string displayed by the header.
 * @param envTitle - Environment or contextual title shown in header/sidebar.
 * @param showHeader - Whether to render the header.
 * @param isMobile - Indicates mobile layout/behavior; toggles simplified grid and mobile-specific animations.
 * @param closeText - Text for a close control inside the sidebar (mobile).
 * @param expanded - Controlled boolean that indicates whether the sidebar/left panel is expanded.
 * @param setExpanded - Setter for the expanded state; used by the sidebar and the mobile-dim overlay.
 * @param handleSpecialMenuClick - Callback for special menu item clicks.
 * @param hasSpecialMenu - Boolean indicating presence of a special menu section.
 * @param menuTypes - Metadata describing menu item types.
 * @param isMenuId - Identifier or predicate used to mark active menu entries.
 * @param handleContentClick - Optional callback invoked when the main content area is clicked.
 * @param useLocationSidebarSelf - Optional custom hook result to override the default location sidebar logic.
 * @param brandName - Optional brand name string to display in the sidebar/header.
 *
 * Side effects and timing:
 * - Clicking the content area toggles an internal reset flag and calls handleContentClick if provided.
 * - When expanded changes to true, expanderDelayed becomes true after ~300ms; it reverts to false when not expanded.
 * - When on mobile, contentExpander is toggled with a 500ms delay based on isMobile and expanded to drive
 *   content entrance/exit CSS classes.
 *
 * Return:
 * @returns JSX.Element - A composed layout element containing optional Sidebar, Header, NewMain and
 *                       a mobile-dim overlay when applicable.
 */
export function AppLayout({
  children,
  upperComponent,
  menu,
  image,
  imageLong,
  handleGenerateImage,
  handleImageClick,
  title,
  buttons,
  showSidebar,
  subtitle,
  envTitle,
  showHeader,
  isMobile,
  closeText,
  expanded,
  setExpanded,
  handleSpecialMenuClick,
  hasSpecialMenu,
  menuTypes,
  isMenuId,
  handleContentClick,
  useLocationSidebarSelf,
  brandName,
}: AppPageWrapperProps) {
  const [reset, setReset] = useState(false);

  const layoutClass = [
    "app-layouts",
    expanded ? "expanded" : "collapsed",
    showSidebar ? "" : "no-sidebar",
    showHeader ? "" : "no-header"
  ].join(" ");

  const layoutStyle = isMobile
    ? {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto auto auto",
      gridTemplateAreas: `
        ${showHeader ? '"headers"' : ''}
        ${showSidebar ? '"sidebar"' : ''}
        "content"
      `
    }
    : {
      gridTemplateColumns: showSidebar ? undefined : "1fr",
      gridTemplateRows: showHeader ? undefined : "auto",
      gridTemplateAreas: `
        ${showSidebar && showHeader
          ? '"sidebar headers"'
          : showSidebar
            ? '"sidebar content"'
            : showHeader
              ? '"headers"'
              : '"content"'}
        ${showSidebar && !showHeader ? '"sidebar content"' : !showSidebar ? '"content"' : '"sidebar content"'}
      `
    };

  function handleMainClick() {
    handleContentClick && handleContentClick();
    setReset(!reset);
  }

  /**
 * Timed UI flags for mobile transitions
 *
 * expanderDelayed:
 * - When the sidebar becomes open (`expanded === true`), wait 300ms before
 *   enabling the dim overlay (sets `expanderDelayed` to true). Clears the timer
 *   on cleanup. When `expanded === false`, disable it immediately.
 */
  const [expanderDelayed, setExpanderDelayed] = useState(false);
  useEffect(() => {
    if (expanded) {
      const t = setTimeout(() => setExpanderDelayed(true), 300);
      return () => clearTimeout(t);
    }
    setExpanderDelayed(false);
  }, [expanded]);

  /**
  * contentExpander:
  * - On mobile and sidebar closed (`isMobile && !expanded`), wait 500ms, then
  *   allow content to expand (`contentExpander = true`). Clears the timer on cleanup.
  * - Otherwise, keep content in pre-expanded state (`contentExpander = false`).
  */
  const [contentExpander, setContentExpander] = useState(false);
  useEffect(() => {
    if (isMobile && !expanded) {
      // after closing sidebar, let content expand after 500ms
      const t = setTimeout(() => setContentExpander(true), 500);
      return () => clearTimeout(t); // avoid stale update on quick toggles
    } else {
      // desktop: no gating needed
      setContentExpander(false);
    }
  }, [isMobile, expanded]);

  return (
    <div className={layoutClass} style={layoutStyle}>
      {showSidebar && (
        <Sidebar
          image={image}
          imageLong={imageLong}
          handleImageClick={handleImageClick}
          handleGenerateImage={handleGenerateImage}
          setExpanded={setExpanded}
          expanded={expanded}
          menu={menu}
          isMobile={isMobile}
          className="sidebar"
          closeText={closeText}
          reset={reset}
          envTitle={envTitle}
          handleSpecialMenuClick={handleSpecialMenuClick}
          hasSpecialMenu={hasSpecialMenu}
          menuTypes={menuTypes}
          isMenuId={isMenuId}
          brandName={brandName} 
          useLocationSidebarSelf={useLocationSidebarSelf}
        />
      )}
      {showHeader && (
        <Header
          envTitle={envTitle}
          subtitle={subtitle}
          title={title}
          buttons={buttons}
          className="header"
          isMobile={isMobile}
          image={image}
          noSidebar={showSidebar}
          brandName={brandName}
        />
      )}
      <Main
        upperComponent={upperComponent}
        className={`contentpdc ${!contentExpander && isMobile ? "contentpdc-mobile" : ""}`}
        onClick={handleMainClick}
      >
        {children}
      </Main>
      {isMobile && expanderDelayed && (
        <div
          className="mobile-dim"
          onClick={() => setExpanded(false)}
        />
      )}
    </div>
  );
}
