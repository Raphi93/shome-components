import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Sidebar.css";
import React from "react";

interface SidebarLogoSectionProps {
  expanded: boolean;
  expandedImage: boolean;
  changeLayoutImage: boolean;
  image?: string;
  imageLong?: string;
  handleImageClick?: () => void;
  setExpanded: (expanded: boolean) => void;
}

export function SidebarLogoSection({
  expanded,
  expandedImage,
  changeLayoutImage,
  image,
  imageLong,
  handleImageClick,
  setExpanded
}: SidebarLogoSectionProps) {
  return (
    <div className={`${!expanded ? "logo-container" : "logo-container-expandet"} ${changeLayoutImage ? "change-layout-image" : ""}`}>
      <img
        src={expandedImage ? imageLong : image}
        alt="Logo"
        className={`${expanded ? "logo-long-new-sidebar" : "logo-new-sidebar"}`}
        onClick={handleImageClick}
        onError={(e) => {
          const newImage = image ?? "";
          (e.target as HTMLImageElement).src = newImage;
          (e.target as HTMLImageElement).alt = "Logo";
        }}
      />
      <FontAwesomeIcon
        icon={expandedImage ? faX : faBars}
        className={`${!expandedImage ? 'bars-icons' : 'bars-icons-expandet'}`}
        onClick={() => setExpanded(!expanded)}
      />
    </div>
  );
}