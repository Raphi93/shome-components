"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LabelNameWithTooltip } from "./Sidebar";
import path from "path";
import { NavigationItem } from "../../types/Layout";


interface Props {
  node: NavigationItem;
  level: number;
  pathClicks: string[];
  leafClick: string;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelect: () => void;
  handleGenerateImage?: (svg: string) => string | null;
  t: (key: string) => string;
}

export function SidebarChildItem({
  node: nodeParent,
  level,
  pathClicks,
  leafClick,
  isOpen,
  onToggleOpen,
  onSelect,
  handleGenerateImage,
  t
}: Props) {
  const node = useMemo(
    () => ({
      ...nodeParent,
      icon: nodeParent.icon ?? "",
      isFontAwesome: nodeParent.isFontAwesome ?? false,
      link: nodeParent.link ?? "",
      svg: nodeParent.svg ?? undefined,
      tooltip: nodeParent.tooltip ?? "",
      children: nodeParent.children ?? [],
    }),
    [nodeParent]
  );

  const hasChildren = node.children.length > 0;

  const isSelected = leafClick === node.name || pathClicks[level + 1] === node.name;

  const [expanderDelayed, setExpanderDelayed] = useState(false);
  useEffect(() => {
    if (!hasChildren) {
      setExpanderDelayed(false);
      return;
    }
    const t = window.setTimeout(() => setExpanderDelayed(true), 300);
    return () => window.clearTimeout(t);
  }, [hasChildren]);

  const [openChildName, setOpenChildName] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) setOpenChildName(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setOpenChildName(pathClicks[level + 2] ?? null);
  }, [isOpen, pathClicks, level]);

  const paddingLeft = `${3.6 + level * 0.5}rem`;

  const subChildSelected = useMemo(() => isSelected && node.children.some((child: NavigationItem) => child.name === pathClicks[level + 2]), [node.children, pathClicks, level]);

  return (
    <>
      <li
        className={`submenu-items${isSelected && !subChildSelected ? " selected-child" : isSelected && subChildSelected ? " selected-subchild" : ""} level-${level}`}
        style={{ paddingLeft }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {node.link ? (
          node.link.startsWith("http") ? (
            <a
              href={node.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`menu-link`}
              onClick={(e) => e.stopPropagation()}
            >
              <LabelNameWithTooltip itemName={node.name} rights={node.svg} t={t} />
            </a>
          ) : (
            <Link
              href={node.link}
              className={`menu-link`}
              onClick={(e) => e.stopPropagation()}
              style={{ width: `calc(var(--sidebar-extended-width) - 5.40rem - ${level !== 0 ? level * 0.5 : 0}rem)` }}
            >
              <LabelNameWithTooltip itemName={node.name} rights={node.svg} t={t} />
            </Link>
          )
        ) : (
          <div className={`menu-link`}>
            <LabelNameWithTooltip itemName={node.name} rights={node.svg} t={t} />
          </div>
        )}

        <div className="expander-containerChild">
          {hasChildren && (
            <button
              className={`expander${isOpen ? " selected" : ""}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleOpen();
              }}
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          )}
        </div>
      </li>

      {hasChildren && expanderDelayed && isOpen && (
        <ul className="submenu selected" aria-hidden={!isOpen}>
          {node.children.map((childNode: NavigationItem) => {
            const childIsOpen = openChildName === childNode.name;

            return (
              <SidebarChildItem
                key={childNode.name}
                node={childNode}
                level={level + 1}
                pathClicks={pathClicks}
                leafClick={leafClick}
                isOpen={childIsOpen}
                onToggleOpen={() =>
                  setOpenChildName((prev) => (prev === childNode.name ? null : childNode.name))
                }
                onSelect={onSelect}
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
