import React from "react";
import { ReactNode } from "react";
import { NavigationItem, Sidebar } from "./Sidebar/Sidebar";
import { Header } from "./Header/Header";
import { Main } from "./Main/Main";

import "./AppLayouts.css";

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
  isTablet?: boolean;
  isMobile: boolean;
  closeText?: string;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  handleContentClick: () => void;
  reset: boolean;
}

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
  isTablet,
  isMobile,
  closeText,
  expanded,
  setExpanded,
  handleContentClick,
  reset
}: AppPageWrapperProps) {

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
        ${showSidebar ? '"sidebar"' : ''}
        ${showHeader ? '"headers"' : ''}
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
          setReset={reset}
          envTitle={envTitle}
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
        />
      )}
      <Main
        upperComponent={upperComponent}
        className="content"
        onClick={handleContentClick}
      >
        {children}
      </Main>
    </div>
  );

}