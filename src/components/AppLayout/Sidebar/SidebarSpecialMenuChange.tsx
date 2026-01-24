import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { PdcTooltipSelf } from "../PdcTooltip/PdcTooltipSelf";

export interface NewSidebarSpecialMenuChangeProps {
    handleSpecialMenuClick?: (menuId: number) => void;
    menuTypes?: { key: number; label: string; icon: IconProp | string }[];
    isMenuId?: number;
    expanded?: boolean;
    handleGenerateImage?: (svg: string) => string | null;
    isSubChild?: boolean;
}

/**
 * NewSidebarSpecialMenuChange
 *
 * Renders a list of special sidebar menu items with optional icons, tooltips and label visibility based on
 * expansion and sub-child states.
 *
 * Behavior:
 * - Filters the provided `menuTypes` to exclude the item whose `key` matches `isMenuId`.
 * - For each remaining menu item renders an element with classes:
 *   - "menu-items" always present
 *   - " expandet" appended when `expanded` is true
 *   - " is-subchild" appended when `isSubChild` is true
 * - Clicking an item invokes `handleSpecialMenuClick` with that item's `key`.
 * - Icon rendering:
 *   - If the menu's `icon` is a string, it renders an <img> whose `src` is the result of `handleGenerateImage(icon)` if provided.
 *   - Otherwise it renders a FontAwesomeIcon for IconProp icons.
 * - When `expanded` is false the icon is wrapped in a `PdcTooltip` (text = menu label, position = "right", class = "tooltip-menu").
 * - When `expanded` is true and `isSubChild` is false the item label is shown in a span with class "menu-name".
 *
 * Props:
 * @param props.handleSpecialMenuClick - Optional. Callback invoked when a menu item is clicked. Receives the clicked menu key.
 * @param props.menuTypes - Optional. Array of menu descriptors to render. Each item is expected to have at least: `{ key: string, label: string, icon: IconProp | string }`.
 * @param props.isMenuId - Optional. Menu key to exclude from rendering (typically the currently active/selected menu id).
 * @param props.handleGenerateImage - Optional. Function that maps a string icon identifier to an image URL used as the <img> src.
 * @param props.expanded - Optional. When true, menu labels are shown and tooltips are not used; when false, only icons (with tooltips) are shown.
 * @param props.isSubChild - Optional. When true, the item is rendered as a sub-child (adds "is-subchild" class and suppresses the label even when expanded).
 *
 * Returns:
 * @returns JSX.Element - A container div with class "special-menu-container" that contains the rendered menu items.
 *
 * Example:
 * const menuTypes = [{ key: "home", label: "Home", icon: faHome }, { key: "logo", label: "Brand", icon: "brand.svg" }];
 * <NewSidebarSpecialMenuChange
 *   menuTypes={menuTypes}
 *   handleSpecialMenuClick={(k) => console.log(k)}
 *   handleGenerateImage={(id) => `/assets/icons/${id}`}
 *   expanded={false}
 *   isMenuId={"current"}
 * />
 */
export function NewSidebarSpecialMenuChange({
    handleSpecialMenuClick,
    menuTypes,
    isMenuId,
    handleGenerateImage,
    expanded,
    isSubChild
}: NewSidebarSpecialMenuChangeProps) {


    const wrappedIcon = (icon: IconProp | string, label: string) => {
        const iconElement = typeof icon === "string" ? (
            <img src={handleGenerateImage?.(icon) || undefined} alt={label} className="menu-icon-image" />
        ) : (
            <FontAwesomeIcon icon={icon} className="menu-icon" />
        );
        return !expanded
            ? <PdcTooltipSelf text={label} position="right" className="tooltip-menus">{iconElement}</PdcTooltipSelf>
            : iconElement;
    };

    return <div className="special-menu-container">
        {menuTypes && menuTypes.length > 0 && handleSpecialMenuClick && menuTypes.filter((menu) => menu.key !== isMenuId).map((menu) => (
            <div key={menu.key}>
                <div
                    className={`menu-items${expanded ? " expanded" : ""}${isSubChild ? " is-subchild" : ""}`}
                    onClick={() => handleSpecialMenuClick && handleSpecialMenuClick(menu.key)}
                >
                    {wrappedIcon(menu.icon, menu.label)}
                    {expanded && !isSubChild && <span className="menu-name">{menu.label}</span>}
                </div>
            </div>
        ))}
    </div>;
}