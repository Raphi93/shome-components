'use client';

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

import { SidebarChildItem } from "./SidebarChildItem";

import "./Sidebar.scss";
import { NavigationItem } from '../../types';
import { LabelNameWithTooltip } from ".";

interface SidebarItemProps {
  item: NavigationItem;
  expanded: boolean;
  parentClick: string;
  parentExpander: boolean;
  childClick: string;
  leafClick: string;
  pathClicks: string[];
  handleParentClick: (item: NavigationItem) => void;
  handleParentClickNotExpanded: (item: NavigationItem) => void;
  handleChildClick: (child: NavigationItem) => void;
  handleGenerateImage?: (svg: string) => string | null;
  isMobile?: boolean;
  childrenRef: React.RefObject<HTMLUListElement>;
  t: (key: string) => string;
}

export function SidebarItem({
  item: itemParent,
  expanded,
  parentClick,
  parentExpander,
  childClick,
  leafClick,
  pathClicks,
  handleParentClick,
  handleParentClickNotExpanded,
  handleChildClick,
  handleGenerateImage,
  childrenRef,
  t,
}: SidebarItemProps) {
  const item = useMemo(
    () => ({
      ...itemParent,
      icon: itemParent.icon ?? "",
      isFontAwesome: itemParent.isFontAwesome ?? false,
      link: itemParent.link ?? "",
      svg: itemParent.svg ?? undefined,
      tooltip: itemParent.tooltip ?? "",
      children: itemParent.children ?? [],
    }),
    [itemParent]
  );

  const itemName = item.name;

  const iconImage =
    !item.isFontAwesome && typeof item.icon === "string"
      ? handleGenerateImage?.(item.icon ?? "")
      : "";

  const isSelected = parentClick === item.name;
  const isSubmenuOpen = parentExpander && isSelected;
  const hasChildren = !!item.children?.length;

  const isChildSelected = isSelected && !!pathClicks[1];
  const isSubChildSelected = isSelected && !!pathClicks[2];

  const cssSelected = `${isSelected && !isChildSelected && !isSubChildSelected ? " selected" :
    isSelected && isChildSelected && !isSubChildSelected ? " selectedChild" :
      isSelected && isChildSelected && isSubChildSelected ? " selectedSubChild" : ""}`;

  const className = `menu-items${expanded ? " expanded" : ""}${cssSelected}`;

  const [expanderDelayed, setExpanderDelayed] = useState(false);
  useEffect(() => {
    if (expanded) {
      const t = window.setTimeout(() => setExpanderDelayed(true), 300);
      return () => window.clearTimeout(t);
    }
    setExpanderDelayed(false);
  }, [expanded]);

  const [expanderDelayedChild, setExpanderDelayedChild] = useState(false);
  useEffect(() => {
    if (!expanderDelayed) {
      setExpanderDelayedChild(false);
      return;
    }
    setExpanderDelayedChild(isSubmenuOpen);;

  }, [expanderDelayed, isSubmenuOpen]);

  const [openChildName, setOpenChildName] = useState<string | null>(null);

  useEffect(() => {
    if (!isSubmenuOpen) setOpenChildName(null);
  }, [isSubmenuOpen]);

  useEffect(() => {
    if (!isSubmenuOpen) return;
    setOpenChildName(pathClicks[1] ?? null);
  }, [isSubmenuOpen, pathClicks]);

  const toggleParent = () => {
    if (!expanded) {
      handleParentClickNotExpanded(item);
    }
    handleParentClick(item);
  };

  const iconElement =
    item.isFontAwesome && (item.icon as IconProp) ? (
      <FontAwesomeIcon icon={item.icon as IconProp} className="menu-icon" onClick={() => toggleParent()} />
    ) : (
      <img src={iconImage ?? ""} alt={itemName} className="menu-icon-image" onClick={() => toggleParent()} />
    );

  const wrappedIcon = !expanded ? (
    <Tooltip>
      <TooltipTrigger asChild className="tooltip-menus" onClick={() => toggleParent()}>{iconElement}</TooltipTrigger>
      <TooltipContent>{item.tooltip || itemName}</TooltipContent>
    </Tooltip>
  ) : (
    iconElement
  );

  return (
    <>
      <div className={className} onClick={() => toggleParent()}>
        {item.link ? (
          item.link.startsWith("http") ? (

            <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={(e) => {
              toggleParent();
            }}>
              {item.icon && item.icon !== "" && wrappedIcon}
            </a>
          ) : (
            <Link to={item.link} onClick={(e) => {
              toggleParent();
            }}>
              {item.icon && item.icon !== "" && wrappedIcon}
            </Link>
          )
        ) : (

          item.icon && item.icon !== "" && wrappedIcon
        )}

        {expanderDelayed && (
          <>
            {item.link ? (
              item.link.startsWith("http") ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="menu-link"
                >
                  <LabelNameWithTooltip itemName={itemName} rights={item.svg} t={t} />
                </a>
              ) : (
                <Link to={item.link} className="menu-link">
                  <LabelNameWithTooltip itemName={itemName} rights={item.svg} t={t} />
                </Link>
              )
            ) : (
              <div
                className="menu-link"
                onClick={(e) => {
                  toggleParent();
                }}
              >
                <LabelNameWithTooltip itemName={itemName} rights={item.svg} t={t} />
              </div>
            )}

            {hasChildren && expanded && (
              <button
                className={`expander${isSelected ? " selected" : ""}`}
                type="button"
                onClick={(e) => {
                  toggleParent();
                }}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            )}
          </>
        )}
      </div>

      {hasChildren && expanderDelayedChild && (
        <ul className={`submenu${isSubmenuOpen ? " selected" : ""}`} aria-hidden={!isSubmenuOpen} ref={childrenRef}>
          {item.children.map((child) => {
            const childIsOpen = openChildName === child.name;

            return (
              <SidebarChildItem
                key={child.name}
                node={child}
                level={0}
                leafClick={leafClick}
                pathClicks={pathClicks}
                isOpen={childIsOpen}
                onToggleOpen={() => {
                  setOpenChildName((prev) => (prev === child.name ? null : child.name));
                }}
                onSelect={() => handleChildClick(child)}
                handleGenerateImage={handleGenerateImage}
                t={t}
              />
            );
          })}
        </ul>
      )}
    </>
  );
}
