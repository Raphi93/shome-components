import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useTranslation } from "react-i18next";


import { NewSidebarSpecialMenuChange } from "./SidebarSpecialMenuChange";
import { SidebarItem } from "./SidebarItem";
import { SidebarLogoSection } from "./SidebarLogoSection";
import { SidebarLogoSectionMobile } from "./SidebarLogoSectionMobile";
import { useLocationSidebar } from "./useLocationSidebar";

import { Tooltip, TooltipContent, TooltipTrigger } from "../../Tooltip/Tooltip";

import "./sidebar.scss";
import "../AppLayout/AppLayouts.css";



interface SidebarProps {
  className?: string;
  menu: NavigationItem[];
  setExpanded: (expanded: boolean) => void;
  expanded: boolean;
  image?: string;
  imageLong?: string;
  handleImageClick?: () => void;
  handleGenerateImage?: (svg: string) => string | null;
  isMobile: boolean;
  closeText?: string;
  reset: boolean;
  envTitle?: string;
  handleSpecialMenuClick?: (menuId: number) => void;
  hasSpecialMenu?: boolean;
  menuTypes?: { key: number; label: string; icon: IconProp | string }[];
  isMenuId?: number;
  useLocationSidebarSelf?: ReturnType<typeof useLocationSidebar>;
  brandName?: string;
}

const normalize = (p: string) => p.replace(/\/+$/, "");

export function useIsOverflow<T extends HTMLElement>(ref: React.RefObject<T>, deps: any[] = []) {
  const [isOverflow, setIsOverflow] = useState(false);
  const last = useRef<boolean>(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      last.current = false;
      setIsOverflow(false);
      return;
    }

    const compute = () => {
      const cw = el.clientWidth;
      const sw = el.scrollWidth;
      if (cw === 0 || sw === 0) return null;
      return sw - cw > 1;
    };

    const apply = () => {
      const nextOrNull = compute();
      if (nextOrNull === null) return;

      const next = nextOrNull;
      if (last.current !== next) {
        last.current = next;
        setIsOverflow(next);
      }
    };

    const onResize = () => apply();
    const ro = new ResizeObserver(() => apply());
    const raf = requestAnimationFrame(() => apply());

    ro.observe(el);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);

  return isOverflow;
}


function rightsTranslate(rights: string, t: (key: string) => string): string {
  const allowed = RIGHTS_ORDER
    .map((key, index) => (rights[index] !== "-" ? t(mapRights[key]) : null))
    .filter(Boolean);

  return String(allowed[allowed.length - 1] || "");
}

export function LabelNameWithTooltip({ itemName, rights, t }: { itemName: string; rights?: string; t: (key: string) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isOverflow = useIsOverflow(ref);

  const label = (
    <span className="menu-name" ref={ref}>
      {itemName}
    </span>
  );

  const hasRights = !!rights && rights.trim() !== "";

  if (!isOverflow && !hasRights) return label;

  const translatedRights = hasRights ? rightsTranslate(rights!, t) : "";

  return (
    <Tooltip>
      <TooltipTrigger asChild>{label}</TooltipTrigger>
      <TooltipContent>
        <div className="tooltip-content-menu">
          {translatedRights && <div className="tooltip-rights">{translatedRights}</div>}
          {isOverflow && <div className="tooltip-item-name">{itemName}</div>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}


const RIGHTS_ORDER = ["A", "I", "N", "Z", "F", "G", "M", "P"];
const mapRights: Record<string, string> = {
  A: "Admin",
  I: "Intern",
  N: "Named",
  Z: "Zone",
  F: "Fleet",
  G: "Groups",
  M: "Dealer",
  P: "Person",
};


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
  const location = useLocation();
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
  const childrenRef = React.useRef<HTMLUListElement>(null);
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
                  childrenRef={childrenRef}
                  t={t}
                />
              ))}
            </ul>
          </div>

          {hasSpecialMenu && (
            <div className="submenu-desktop-footer" ref={footerRef}>
              <NewSidebarSpecialMenuChange
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
                    childrenRef={childrenRef}
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
          <NewSidebarSpecialMenuChange
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