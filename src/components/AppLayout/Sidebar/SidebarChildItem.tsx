import { Link } from "react-router-dom";
import { NavigationItem } from "./Sidebar";

import "./Sidebar.css";


interface SidebarChildItemProps {
  child: NavigationItem;
  isSelected: boolean;
  onClick: () => void;
}

export function SidebarChildItem({ child, isSelected, onClick }: SidebarChildItemProps) {
  return (
    <li
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`submenu-items ${isSelected ? 'selected-child' : ''}`}
    >
      {child.link ? (
        child.link.startsWith("http") ? (
          <a
            href={child.link}
            target="_blank"
            rel="noopener noreferrer"
            className="menu-link"
          >
            <span className="menu-name">{child.label}</span>
          </a>
        ) : (
          <Link to={child.link} className="menu-link">
            <span className="menu-name">{child.label}</span>
          </Link>
        )
      ) : (
        <span className="menu-name">{child.label}</span>
      )}
    </li>
  );
}