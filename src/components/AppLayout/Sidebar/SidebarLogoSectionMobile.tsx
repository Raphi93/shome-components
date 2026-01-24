import React from "react";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface SidebarLogoSectionMobileProps {
    expanded: boolean;
    expandedImage: boolean;
    changeLayoutImage: boolean;
    image?: string;
    imageLong?: string;
    setExpanded: (expanded: boolean) => void;
    handleImageClick?: () => void;
    envTitle?: string;
    isSubChild?: boolean;
}

/**
 * Renders the mobile logo section for the sidebar, including the logo image, a collapse/expand bars icon,
 * and an optional environment title. The component selects between a compact and expanded logo source
 * based on the `expanded` and `expandedImage` flags and respects `isSubChild` to avoid rendering the expanded
 * layout for sub-children. If the logo image fails to load, it falls back to the compact `image` source and
 * ensures the alt text remains "Logo".
 *
 * @param expanded - Whether the sidebar is currently expanded. Affects the logo class and whether the bars icon is shown.
 * @param expandedImage - If true and the item is not a sub-child, prefer the expanded (`imageLong`) logo source when expanded.
 * @param changeLayoutImage - Optional callback intended to change or toggle the layout image (not required by this component but accepted as a prop).
 * @param image - Source URL for the compact/default logo image. Also used as a fallback if the displayed image fails to load.
 * @param imageLong - Source URL for the expanded/long logo image used when expanded and allowed.
 * @param setExpanded - Setter function to toggle the expanded state (called when the bars icon is clicked).
 * @param handleImageClick - Click handler invoked when the logo image is clicked.
 * @param envTitle - Optional environment or context title rendered under the logo when provided.
 * @param isSubChild - Indicates this logo belongs to a sub-child item; when true, expanded/long layout is suppressed.
 *
 * @returns A JSX.Element containing the mobile logo section with proper fallbacks and interaction handlers.
 */
export const SidebarLogoSectionMobile: React.FC<SidebarLogoSectionMobileProps> = ({
    expanded,
    expandedImage,
    changeLayoutImage,
    image,
    imageLong,
    setExpanded,
    handleImageClick,
    envTitle,
    isSubChild
}) => {

    return (
        <div className={`${"logo-container-mobile"}`}>
            <div className="logo-bars-mobile">
                <img
                    src={expandedImage && !isSubChild ? imageLong : image}
                    alt="Logo"
                    className={`${expanded && !isSubChild ? "logo-long-mobile" : "logo-mobile"}`}
                    onClick={handleImageClick}
                    onError={(e) => {
                        const newImage = image ?? "";
                        (e.target as HTMLImageElement).src = newImage;
                        (e.target as HTMLImageElement).alt = "Logo";
                    }}
                />
                {!expanded && (
                    <FontAwesomeIcon
                        icon={faBars}
                        className={'bars-icons-mobile'}
                        onClick={() => setExpanded(!expanded)}
                    />
                )}
            </div>
            {envTitle && (
                <div className="env-title-mobile">
                    {envTitle}
                </div>
            )}
            {expanded && !isSubChild && (
                <FontAwesomeIcon icon={faX} className="bars-icons-expandet" onClick={() => setExpanded(!expanded)} />
            )}
        </div>
    );
};
