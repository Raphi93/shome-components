'use client';

import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SidebarItem } from './SidebarItem';
import { SidebarLogoSection } from './SidebarLogoSection';
import { SidebarLogoSectionMobile } from './SidebarLogoSectionMobile';
import { SidebarSpecialMenuChange } from './SidebarSpecialMenuChange';
import { useLocationSidebar } from './useLocationSidebar';

import type { SidebarProps } from './Sidebar.type';
import type { NavigationItem } from '../../types';
export type { SidebarProps } from './Sidebar.type';
export { useIsOverflow, LabelNameWithTooltip } from './SidebarLabel';

import './Sidebar.scss';

const normalize = (p: string) => p.replace(/\/+$/, "");


export function Sidebar({
  className,
  menu,
  image,
  imageLong,
  handleImageClick,
  expanded,
  setExpanded,
  handleGenerateImage,
  isMobile,
  reset,
  envTitle,
  handleSpecialMenuClick,
  hasSpecialMenu,
  menuTypes,
  isMenuId,
  useLocationSidebarSelf = undefined,
  brandName,
}: SidebarProps) {
  const { t } = useTranslation();
  useMemo(() => normalize(`${location.pathname}${location.search}`), [location.pathname, location.search]);

  const [parentClick, setParentClick] = useState("");
  const [parentExpander, setParentExpander] = useState(false);

  const [childClick, setChildClick] = useState("");
  const [leafClick, setLeafClick] = useState("");
  const [pathClicks, setPathClicks] = useState<string[]>([]);

  const [expandedImage, setExpandedImage] = useState(expanded);
  const [changeLayoutImage, setChangeLayoutImage] = useState(false);

  const defaultHook = useLocationSidebar(menu);
  const hook = useLocationSidebarSelf === undefined ? defaultHook : useLocationSidebarSelf;

  const parentRef = React.useRef<HTMLDivElement>(null);
  const childrenRef = React.useRef<HTMLUListElement | null>(null);
  const navRef = React.useRef<HTMLElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChangeLayoutImage(true);

    const t = window.setTimeout(() => {
      setExpandedImage(expanded);
      setChangeLayoutImage(false);
    }, 30);

    return () => window.clearTimeout(t);
  }, [expanded]);

  useLayoutEffect(() => {
    if (!expanded) return;

    const nextParent = hook.parentClick ?? "";
    const nextChild = hook.childClick ?? "";
    const nextLeaf = hook.leafClick ?? "";
    const nextPath = hook.pathClicks ?? [];

    setParentClick((prev) => (prev === nextParent ? prev : nextParent));
    setChildClick((prev) => (prev === nextChild ? prev : nextChild));
    setLeafClick((prev) => (prev === nextLeaf ? prev : nextLeaf));
    setPathClicks((prev) => {
      if (prev.length === nextPath.length && prev.every((v, i) => v === nextPath[i])) return prev;
      return nextPath;
    });
  }, [expanded, hook.parentClick, hook.childClick, hook.leafClick, hook.pathClicks, reset]);

  useEffect(() => {
    if (!expanded) {
      setParentExpander(false);
      return;
    }
    setParentExpander(!!parentClick);
  }, [expanded, parentClick]);

  const handleParentClick = (item: NavigationItem) => {
    const same = parentClick === item.name;
    setParentClick(same ? "" : item.name);
    setParentExpander(!same);
  };

  const handleParentClickNotExpanded = (item: NavigationItem) => {
    setExpanded(true);
    setParentClick(item.name);
    setParentExpander(true);
  };

  const handleChildClick = (child: NavigationItem) => {
    setChildClick(child.name);
    if (isMobile && expanded) setExpanded(false);
  };

  const handleImageClicked = () => {
    setParentClick("");
    setChildClick("");
    setLeafClick("");
    setPathClicks([]);
    handleImageClick?.();
  };

  const desktopRender = () => (
    <aside className={className}>
      <div className="sidebar-relative">
        <SidebarLogoSection
          expanded={expanded}
          expandedImage={expandedImage}
          changeLayoutImage={changeLayoutImage}
          image={image}
          imageLong={imageLong}
          handleImageClick={handleImageClicked}
          setExpanded={setExpanded}
          isSubChild={false}
          brandName={brandName}
        />

        <nav className="sidebar-navigation" ref={navRef}>
          <div className="submenu-desktop-header" ref={parentRef}>
            <ul className="menu-items-container">
              {menu.map((item) => (
                <SidebarItem
                  key={item.name}
                  item={item}
                  expanded={expanded}
                  parentExpander={parentExpander}
                  parentClick={parentClick}
                  childClick={childClick}
                  leafClick={leafClick}
                  pathClicks={pathClicks}
                  handleParentClick={handleParentClick}
                  handleParentClickNotExpanded={handleParentClickNotExpanded}
                  handleChildClick={handleChildClick}
                  handleGenerateImage={handleGenerateImage}
                  isMobile={isMobile}
                  childrenRef={childrenRef as React.RefObject<HTMLUListElement>}
                  t={t}
                />
              ))}
            </ul>
          </div>

          {hasSpecialMenu && (
            <div className="submenu-desktop-footer" ref={footerRef}>
              <SidebarSpecialMenuChange
                handleSpecialMenuClick={handleSpecialMenuClick}
                menuTypes={menuTypes}
                isMenuId={isMenuId}
                handleGenerateImage={handleGenerateImage}
                expanded={expanded}
                isSubChild={false}
              />
            </div>
          )}
        </nav>
      </div>
    </aside>
  );

  const mobileRender = () => (
    <div className={className}>
      <div className="sidebar-container-mobile">
        <SidebarLogoSectionMobile
          expanded={expanded}
          expandedImage={expandedImage}
          changeLayoutImage={changeLayoutImage}
          image={image}
          imageLong={imageLong}
          handleImageClick={handleImageClick}
          setExpanded={setExpanded}
          envTitle={envTitle}
          isSubChild={false}
        />

        {expanded && (
          <nav>
            <div className="submenu-desktop">
              <ul>
                {menu.map((item) => (
                  <SidebarItem
                    key={item.name}
                    item={item}
                    expanded={expanded}
                    parentExpander={parentExpander}
                    parentClick={parentClick}
                    childClick={childClick}
                    leafClick={leafClick}
                    pathClicks={pathClicks}
                    handleParentClick={handleParentClick}
                    handleParentClickNotExpanded={handleParentClickNotExpanded}
                    handleChildClick={handleChildClick}
                    handleGenerateImage={handleGenerateImage}
                    isMobile={isMobile}
                    childrenRef={childrenRef as React.RefObject<HTMLUListElement>}
                    t={t}
                  />
                ))}
              </ul>
            </div>
          </nav>
        )}
      </div>

      {expanded && hasSpecialMenu && (
        <div className="submenu-desktop-footer">
          <SidebarSpecialMenuChange
            handleSpecialMenuClick={handleSpecialMenuClick}
            menuTypes={menuTypes}
            isMenuId={isMenuId}
            handleGenerateImage={handleGenerateImage}
            expanded={expanded}
            isSubChild={false}
          />
        </div>
      )}
    </div>
  );

  return isMobile ? mobileRender() : desktopRender();
}
