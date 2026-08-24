'use client';

import React, { useMemo } from 'react';
import type { ElementType } from 'react';

import { getConfiguredLinkComponent } from '../../utils/linkConfig';
import { NavigationItem } from '../../types';
import { usePageContext } from '../../context';

import type { BreadCrumb } from '../../types/Breadcrumbs.types';
export type { BreadCrumb } from '../../types/Breadcrumbs.types';

import style from './Breadcrumbs.module.scss';

export function Breadcrumbs({
  crumbs,
  linkComponent,
}: {
  crumbs: BreadCrumb[];
  /** Override the element used to render crumb links. Defaults to the globally configured component or 'a'. */
  linkComponent?: ElementType;
}) {
  const LinkEl = linkComponent ?? getConfiguredLinkComponent();
  return (
    <div className={style.breadcrumbs}>
      {crumbs.map((crumb, index) => {
        return (
          <span key={index}>
            {crumb.link ? (
              <LinkEl href={crumb.link}>{crumb.name}</LinkEl>
            ) : (
              <span className={style.currentItem}>{crumb.name}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

/**
 * @param pathname - Current URL pathname (e.g. from usePathname() in Next.js or useLocation().pathname in React Router)
 */
export function useAutomaticBreadcrumbs(
  navigationItems: NavigationItem[],
  pathname: string,
  currentPageName?: string,
  rootPageName?: string
): BreadCrumb[] {
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
