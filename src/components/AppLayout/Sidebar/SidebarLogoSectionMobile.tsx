import React from "react";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Sidebar.css";

interface SidebarLogoSectionMobileProps {
    expanded: boolean;
    expandedImage: boolean;
    changeLayoutImage: boolean;
    image?: string;
    imageLong?: string;
    setExpanded: (expanded: boolean) => void;
    handleImageClick?: () => void;
    envTitle?: string;
}

export const SidebarLogoSectionMobile: React.FC<SidebarLogoSectionMobileProps> = ({
    expanded,
    expandedImage,
    changeLayoutImage,
    image,
    imageLong,
    setExpanded,
    handleImageClick,
    envTitle,
}) => {

    return (
        <div className={`${"logo-container-mobile"}`}>
            <div className="logo-bars-mobile">
                <img
                    src={expandedImage ? imageLong : image}
                    alt="Logo"
                    className={`${expanded ? "logo-long-mobile" : "logo-mobile"}`}
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
        </div>
    );
};