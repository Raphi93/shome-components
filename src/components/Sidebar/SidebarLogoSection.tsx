import React from "react";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface SidebarLogoSectionProps {
  expanded: boolean;
  expandedImage: boolean;
  changeLayoutImage: boolean;
  image?: string;
  imageLong?: string;
  handleImageClick?: () => void;
  setExpanded: (expanded: boolean) => void;
  isSubChild?: boolean;
  brandName?: string;
}

/**
 * SidebarLogoSection
 *
 * Renders the logo area used in the sidebar and an optional toggle icon to expand/collapse the sidebar.
 *
 * Behavior:
 * - The outer container receives different CSS classes depending on `expanded` and `changeLayoutImage`.
 * - The <img> source is chosen as `imageLong` when `expandedImage` is true and the item is not a `isSubChild`, otherwise `image`.
 * - The image applies an expanded class when `expanded` and not a sub-child.
 * - Clicking the image invokes `handleImageClick`.
 * - If the image fails to load, an onError handler replaces the src with the provided `image` fallback (or an empty string) and sets the alt to "Logo".
 * - When `changeLayoutImage` is false, a FontAwesomeIcon is rendered showing `faX` (if expanded) or `faBars` (if collapsed). Clicking the icon toggles the expanded state via `setExpanded`.
 *
 * @remarks
 * - `isSubChild` prevents use of the expanded image and expanded image styling; it is intended for nested/sidebar-child contexts.
 * - The component does not itself manage state; it relies on the passed `expanded` boolean and `setExpanded` callback.
 * - Ensure `image` and `imageLong` are valid URLs or handled appropriately to avoid visual flicker when the fallback runs.
 *
 * @param props.expanded - Whether the sidebar is currently expanded.
 * @param props.expandedImage - Whether the expanded variant of the logo should be used when expanded.
 * @param props.changeLayoutImage - If true, apply alternate layout styling and hide the toggle icon.
 * @param props.image - Default (short) logo image URL used as primary or fallback source.
 * @param props.imageLong - Long (expanded) logo image URL used when expanded (subject to `isSubChild`).
 * @param props.handleImageClick - Click handler invoked when the logo image is clicked.
 * @param props.setExpanded - Function to update the expanded state (called with the new boolean value).
 * @param props.isSubChild - When true, treat this entry as a sub-child (disable expanded-image behavior and some expanded styles).
 *
 * @returns JSX.Element - The rendered logo section for the sidebar.
 */
export function SidebarLogoSection({
  expanded,
  expandedImage,
  changeLayoutImage,
  image,
  imageLong,
  handleImageClick,
  setExpanded,
  isSubChild,
  brandName,
}: SidebarLogoSectionProps) {
  return (
    <div className={`logo-container-main ${!expanded ? "logo-container" : "logo-container-expandet"}`}>
      <img
        src={expandedImage && !isSubChild ? imageLong : image}
        alt={brandName || "Logo"}
        className={`${expanded && !isSubChild ? "logo-long-sidebar-image" : "logo-sidebar-image"} ${brandName?.replace("_", "-").toLowerCase() || ""}`}
        onClick={handleImageClick}
        onError={(e) => {
          const newImage = image ?? "";
          (e.target as HTMLImageElement).src = newImage;
          (e.target as HTMLImageElement).alt = brandName || "Logo";
        }}
      />
      {!changeLayoutImage && (
        <FontAwesomeIcon
          icon={expanded ? faX : faBars}
          className={`bars-icons-toggler ${!expanded ? 'bars-icons' : 'bars-icons-expandet'} ${brandName?.replace("_", "-").toLowerCase() || ""}`}
          onClick={() => setExpanded(!expanded)}
        />
      )}
    </div>
  );
}