'use client';


// SidebarSubChild.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faCircleExclamation, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, TooltipContent, TooltipTrigger } from "../Tooltip/Tooltip";
import { NavigationItem } from '../../types';

interface Props {
  child: NavigationItem;
  subChild: NavigationItem[] | null;
  onBack: () => void;
  isSubChild?: boolean;
  setExpanded?: (expanded: boolean) => void;
  isSelected?: (item: NavigationItem) => boolean;
  handleGenerateImage?: (svg: string) => string | null;
  closeText?: string;
  isMobile?: boolean;
  isChildSelected?: boolean;
  setChildClick?: (name: string) => void;
}

/**
 * Renders a sub-panel for a sidebar (a "sub-child" view) that shows a header with
 * navigation controls and a list of child links.
 *
 * The component:
 * - Shows a back button (calls `onBack`) and a close button (calls `setExpanded(false)` if provided).
 * - Displays the parent `child`'s icon (either a FontAwesome icon or an image generated via `handleGenerateImage`) and name.
 * - Renders the `subChild` list as links; external links (starting with "http") are rendered with <a> and open in a new tab,
 *   otherwise items are rendered with a react-router <Link>.
 * - Applies a visibility/position CSS class depending on `isSubChild` and `isMobile`.
 * - Applies a selected style to list items when `isSelected` returns true for that item.
 * - Uses translation for the Back button label and includes a tooltip for the close control.
 *
 * @param subChild - Array of items to display in the sub-list. Each item is expected to have at least:
 *   - name: string (used as the list text and key)
 *   - link?: string | undefined (if starts with "http" the item is treated as an external link)
 *
 * @param onBack - Callback invoked when the back button is clicked.
 *
 * @param isSubChild - Whether this sub-panel is currently visible/active. Controls visibility-related classes.
 *
 * @param setExpanded - Optional callback to collapse/expand the parent panel. Called as setExpanded(false) by the close control.
 *
 * @param child - The parent/child entry for this sub-panel. Expected shape:
 *   - name: string
 *   - icon?: string | IconProp | undefined
 *   - isFontAwesome?: boolean | undefined
 *   Behavior:
 *     - If child.isFontAwesome is truthy and child.icon is an IconProp, a FontAwesomeIcon is rendered.
 *     - Otherwise, if child.icon is a string, handleGenerateImage (if provided) is used to produce an image URL.
 *
 * @param isSelected - Optional predicate (item) => boolean used to mark an item as selected for styling.
 *
 * @param handleGenerateImage - Optional function used to turn a non-FontAwesome icon string into an image URL.
 *   Signature: (iconString: string) => string | undefined
 *
 * @param closeText - Text to display inside the close control's tooltip.
 *
 * @param isMobile - Whether the layout is in mobile mode; affects which root CSS class is applied.
 *
 * @returns JSX.Element - The rendered sub-panel element.
 */
export function SidebarSubChild({
  subChild,
  onBack,
  isSubChild,
  setExpanded,
  child,
  isSelected,
  handleGenerateImage,
  closeText,
  isMobile,
  isChildSelected,
  setChildClick
}: Props) {
  const { t } = useTranslation();

  const iconImage = !child.isFontAwesome && typeof child.icon === "string"
    ? handleGenerateImage?.(child.icon ?? "")
    : "";

  const iconElement = child.isFontAwesome && child.icon as IconProp
    ? <FontAwesomeIcon icon={child.icon as IconProp} className="menu-icon" />
    : <img src={iconImage ?? ""} alt={child.name} className="menu-icon-image" />;

  const className = !isMobile ? `submenu-full ${isSubChild ? "is-visible" : "not-visible"}` : `submenu-full-mobile ${isSubChild ? "is-visible" : "not-visible"}`;

  return (
    <div className={className}>
      <div className="submenu-full-header">
        <button className="back-button" onClick={onBack} aria-label={t("Back") ?? "Back"}>
          <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
          <div>{t("Back")}</div>
        </button>

        {!isMobile &&
          <div
            className="back-button"
            onClick={() => setExpanded && setExpanded(false)}
          >
            <Tooltip>
              <TooltipTrigger>
                <FontAwesomeIcon icon={faX} className="close-icon-sub" />
              </TooltipTrigger>
              <TooltipContent>
                <span className="close-text">{closeText}</span>
              </TooltipContent>
            </Tooltip>
          </div>
        }
      </div>

      <div className="submenu-full-content">
        {typeof child.link === "string" && child.link.startsWith("http") ? (
          <a
            href={child.link}
            target="_blank"
            rel="noopener noreferrer"
            className={'submenu-full-title' + (isChildSelected ? " selected" : "")}
            onClick={() => setChildClick && setChildClick(child.name)}
          >
            {child.icon && iconElement}
            {child.name}
          </a>
        ) : (
          <Link href={child.link ?? ""} className={'submenu-full-title' + (isChildSelected ? " selected" : "")} onClick={() => setChildClick && setChildClick(child.name)}>
            {child.icon && iconElement}
            {child.name}
          </Link>
        )}
        <ul>
          {subChild?.map((item) => {
            const selected = isSelected?.(item) ?? false;
            const cls = `submenu-full-link${selected ? " selected" : ""}`;

            return (
              <li key={item.name}>
                {typeof item.link === "string" && item.link.startsWith("http") ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link href={item.link ?? ""} className={cls}>
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
