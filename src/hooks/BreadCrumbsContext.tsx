"use client";

import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useLayoutEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import { usePageContext } from '../context/PageContext';

export type BreadCrumb = {
  name: string;
  link?: string;
};

export type NavigationItem = {
  name: string;
  link: string;
  children?: NavigationItem[];
};

export type PdcNavigationItem = NavigationItem;


export const BreadCrumbsContext = createContext<{
  specialBreadCrumbs: BreadCrumb[] | null;
  setSpecialBreadCrumbs: Dispatch<SetStateAction<BreadCrumb[] | null>>;
}>({
  specialBreadCrumbs: null,
  setSpecialBreadCrumbs: () => {},
});

export function useBreadCrumbsContext() {
  return useContext(BreadCrumbsContext);
}

export const BreadCrumbsProvider = ({ children }: { children: ReactNode }) => {
  const [specialBreadCrumbs, setSpecialBreadCrumbs] = useState<BreadCrumb[] | null>(null);

  return (
    <BreadCrumbsContext.Provider
      value={{
        specialBreadCrumbs,
        setSpecialBreadCrumbs,
      }}
    >
      {children}
    </BreadCrumbsContext.Provider>
  );
};

export function useBreadCrumbsInit(initialBreadCrumbs: BreadCrumb[], menu: PdcNavigationItem[], isCrumbFromMenu: boolean = true) {
  const pathname = usePathname() ?? "";
  const { setSpecialBreadCrumbs } = useBreadCrumbsContext();
  const { pageTitle } = usePageContext();
  const { getNavigationItemName } = useFindNavigationItemName(menu);

  useLayoutEffect(() => {
    const rootPathLink = `/${pathname.split('/').filter((segment) => segment)[0]}`;
    const rootPageName = getNavigationItemName(rootPathLink);

    const resultedCrumbs: BreadCrumb[] = [...initialBreadCrumbs];

    if (pageTitle) {
      resultedCrumbs.push({ name: pageTitle } as BreadCrumb);
    }

    if (rootPageName && isCrumbFromMenu) {
      resultedCrumbs.unshift({ name: rootPageName, link: rootPathLink });
    }

    setSpecialBreadCrumbs(resultedCrumbs);

    return () => {
      setSpecialBreadCrumbs(null);
    };
  }, [pageTitle, isCrumbFromMenu]);
}

export function findNavigationItemName(link: string, navigationItems?: NavigationItem[]): string | undefined {
  if (!link || !navigationItems) {
    return undefined;
  }
  const found = navigationItems.find((a) => a.link === link);
  if (found) {
    return found.name;
  } else {
    for (const item of navigationItems) {
      const foundName = findNavigationItemName(link, item.children);
      if (foundName) {
        return foundName;
      }
    }
    return undefined;
  }
}

export function useFindNavigationItemName(menu: PdcNavigationItem[]) {

  function getNavigationItemName(link: string) {
    return findNavigationItemName(link, menu);
  }

  return { getNavigationItemName };
}