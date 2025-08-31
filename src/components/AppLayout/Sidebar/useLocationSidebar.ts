import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavigationItem } from "./Sidebar";


export function useLocationSidebar(menu: NavigationItem[]) {
  const location = useLocation();
  const [childClick, setChildClick] = useState<string>('');
  const [parentClick, setParentClick] = useState<string>('');

  useEffect(() => {
    const fullPath = `${location.pathname}${location.search}`;

    const normalizePath = (path: string) => path.replace(/\/+$/, '');

    const normalizedFullPath = normalizePath(fullPath);

    let matched = false;

    for (const parent of menu) {
      if (parent.children) {
        for (const child of parent.children) {
          if (child.link) {
            const normalizedChildLink = normalizePath(child.link);

            if (normalizedFullPath.startsWith(normalizedChildLink)) {
              setChildClick(child.label);
              setParentClick(parent.label);
              matched = true;
              break;
            }
          }
        }
      }

      if (matched) break;

      if (parent.link) {
        const normalizedParentLink = normalizePath(parent.link);

        if (normalizedFullPath.startsWith(normalizedParentLink)) {
          setParentClick(parent.label);
          setChildClick('');
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      setChildClick('');
      setParentClick('');
    }
  }, [location.pathname, location.search, menu]);

  return { childClick, parentClick };
}