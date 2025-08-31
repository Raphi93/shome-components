import { useEffect, useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SidebarLogoSectionMobile } from "./SidebarLogoSectionMobile";
import { useLocationSidebar } from "./useLocationSidebar";
import { SidebarLogoSection } from "./SidebarLogoSection";
import { SidebarItem } from "./SidebarItem";

import "./Sidebar.css";
import '../AppLayouts.css'
import { IconProp } from "@fortawesome/fontawesome-svg-core";


export interface NavigationItem {
    label: string;
    icon?: IconProp;
    link?: string;
    children?: NavigationItem[];
    isFontAwesome?: boolean;
    svg?: string;
}

export interface SidebarProps {
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
  setReset: boolean;
  envTitle?: string;
}

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
  closeText,
  setReset,
  envTitle
}: SidebarProps) {
  const [parentClick, setParentClick] = useState<string>('');
  const [parentExpander, setParentExpander] = useState<boolean>(false);
  const [childClick, setChildClick] = useState<string>('');
  const [expandedImage, setExpandedImage] = useState(false);
  const [changeLayoutImage, setChangeLayoutImage] = useState(false);

  const { childClick: currentChildClick, parentClick: currentParentClick } = useLocationSidebar(menu);

  useEffect(() => {
    setChangeLayoutImage(true);
    if (expanded) {
      setTimeout(() => {
        setExpandedImage(true);
        setChangeLayoutImage(false);
      }, 30);
    } else {
      setExpandedImage(false);
      setTimeout(() => {
        setChangeLayoutImage(false);
      }, 30);
    }
  }, [expanded]);

  useEffect(() => {
    if (!expanded || setReset || !setReset) {
      setChildClick(currentChildClick);
      setParentClick(currentParentClick);
    }
  }, [currentChildClick, currentParentClick, expanded, setReset]);

  useEffect(() => {
    if (!expanded) {
      setParentExpander(false);
    } else if (expanded && parentClick) {
      setParentExpander(true);
    }
  }, [expanded, parentClick]);

  const handleParentClick = (item: NavigationItem) => {
    const isSameParent = parentClick === item.label;
    setParentClick(isSameParent ? '' : item.label);
    setParentExpander(!isSameParent);
  };

  const handleParentClickNotExpanded = (item: NavigationItem) => {
    setExpanded(true);
    setParentClick(item.label);
    setParentExpander(true);
  };

  const handleChildClick = (child: NavigationItem) => {
    setChildClick(child.label);
  };

  const handleImageClicked = () => {
    setParentClick('');
    setChildClick('');
    handleImageClick?.();
  };


  const desktopRender = () => (
    <aside className={className}>
      <SidebarLogoSection
        expanded={expanded}
        expandedImage={expandedImage}
        changeLayoutImage={changeLayoutImage}
        image={image}
        imageLong={imageLong}
        handleImageClick={handleImageClicked}
        setExpanded={setExpanded}
      />
      <nav>
        <ul className="other-ul">
          {menu.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              expanded={expanded}
              parentClick={parentClick}
              parentExpander={parentExpander}
              childClick={childClick}
              handleParentClick={handleParentClick}
              handleParentClickNotExpanded={handleParentClickNotExpanded}
              handleChildClick={handleChildClick}
              handleGenerateImage={handleGenerateImage}
            />
          ))}
        </ul>
      </nav>
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
        />
        {expanded && (
          <nav>
            <ul className="other-ul">
              {menu.map((item) => (
                <SidebarItem
                  key={item.label}
                  item={item}
                  expanded={expanded}
                  parentClick={parentClick}
                  parentExpander={parentExpander}
                  childClick={childClick}
                  handleParentClick={handleParentClick}
                  handleParentClickNotExpanded={handleParentClickNotExpanded}
                  handleChildClick={handleChildClick}
                  handleGenerateImage={handleGenerateImage}
                />
              ))}
            </ul>
          </nav>
        )}
      </div>
      {expanded && (
        <div className="close-icon-mobile" onClick={() => setExpanded(false)} >
          <FontAwesomeIcon icon={faX} className="close-icon" />
          {closeText}
        </div>
      )}
    </div>
  );

  return isMobile ? mobileRender() : desktopRender();
}