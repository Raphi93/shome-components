import { Link } from "react-router-dom";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import "./Sidebar.css";
import React, { useEffect, useState } from "react";
import { NavigationItem } from "./Sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../Tooltip/Tooltip";
import { SidebarChildItem } from "./SidebarChildItem";

interface SidebarItemProps {
  item: NavigationItem;
  expanded: boolean;
  parentClick: string;
  parentExpander: boolean;
  childClick: string;
  handleParentClick: (item: NavigationItem) => void;
  handleParentClickNotExpanded: (item: NavigationItem) => void;
  handleChildClick: (child: NavigationItem) => void;
  handleGenerateImage?: (svg: string) => string | null;
}

export function SidebarItem({
  item,
  expanded,
  parentClick,
  parentExpander,
  childClick,
  handleParentClick,
  handleParentClickNotExpanded,
  handleChildClick,
  handleGenerateImage,
}: SidebarItemProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (expanded) {
      const timeout = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timeout); 
    } else {
      setShowContent(false); 
    }
  }, [expanded]);

  const iconImage = !item.isFontAwesome && typeof item.icon === "string"
    ? handleGenerateImage?.(item.svg ?? "")
    : "";

  const handleClick = () => {
    !expanded ? handleParentClickNotExpanded(item) : handleParentClick(item);
  };

  const isSelected = parentClick === item.label;

  const iconElement = item.isFontAwesome && item.icon as IconProp
    ? <FontAwesomeIcon icon={item.icon as IconProp} className="menu-icon" />
    : <img src={iconImage ?? ""} alt={item.label} className="menu-icon-image" />;

  const wrappedIcon = !expanded
      ? <Tooltip>
          <TooltipTrigger>{iconElement}</TooltipTrigger>
          <TooltipContent>{item.label}</TooltipContent>
        </Tooltip>
    : iconElement;

  return (
    <div key={item.label}>
      <div
        className={`menu-items${expanded ? " expandet" : ""}${isSelected ? " selected" : ""}`}
        onClick={handleClick}
      >
        {wrappedIcon}
        {showContent && (
          <>
            {item.link ? (
              item.link.startsWith("http") ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="menu-link"
                >
                  <span className="menu-name">{item.label}</span>
                </a>
              ) : (
                <Link to={item.link} className="menu-link">
                  <span className="menu-name">{item.label}</span>
                </Link>
              )
            ) : (
              <span className="menu-name">{item.label}</span>
            )}
            {item.children && (
              <button className={`expander${isSelected ? " selected" : ""}`}>
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            )}
          </>
        )}
      </div>

      {item.children && isSelected && parentExpander && (
        <ul className="submenu expanded other-ul">
          {item.children.map((child) => (
            <SidebarChildItem
              key={child.label}
              child={child}
              isSelected={childClick === child.label}
              onClick={() => handleChildClick(child)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}