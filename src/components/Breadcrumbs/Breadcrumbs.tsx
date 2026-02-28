"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavigationItem, usePageContext } from "../..";
import style from "./Breadcrumbs.module.scss";

export type BreadCrumb = {
  link?: string;   // optional, wie vorher
  name: string;
};

export function Breadcrumbs({ crumbs }: { crumbs: BreadCrumb[] }) {
  return (
    <div className={style.breadcrumbs}>
      {crumbs.map((crumb, index) => {
        return (
          <span key={index}>
            {crumb.link ? (
              <Link href={crumb.link}>{crumb.name}</Link>
            ) : (
              <span className={style.currentItem}>{crumb.name}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export function useAutomaticBreadcrumbs(
  navigationItems: NavigationItem[],
  currentPageName?: string,
  rootPageName?: string
): BreadCrumb[] {
  const pathname = usePathname();
  const { pageTitle } = usePageContext();
  currentPageName ??= pageTitle ?? undefined;

  const crumbs = useMemo(() => {
    let link = "";

    const parts = (pathname || "/")
      .split("/")
      .filter((crumb) => crumb);

    const list: (BreadCrumb | undefined)[] = parts.map((part) => {
      link += `/${part}`;

      if ((pathname || "/") === link) {
        return { name: currentPageName ?? "" };
      }

      const name = findNavigationItemName(link, navigationItems);
      return name ? { link, name } : undefined;
    });

    const filtered = list.filter(Boolean) as BreadCrumb[];

    if (rootPageName) {
      filtered.unshift({ link: "/", name: rootPageName });
    }

    return filtered;
  }, [pathname, navigationItems, currentPageName, rootPageName]);

  return crumbs;
}

export function findNavigationItemName(link: string, navigationItems?: NavigationItem[]): string | undefined {
  if (!link || !navigationItems) return undefined;

  const found = navigationItems.find((a) => a.link === link);
  if (found) return found.name;

  for (const item of navigationItems) {
    const foundName = findNavigationItemName(link, item.children);
    if (foundName) return foundName;
  }

  return undefined;
}