import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { NavigationItem, usePageContext } from '../..';

import style from './Breadcrumbs.module.scss';

export type BreadCrumb = {
  link: string;
  name: string;
};

export function Breadcrumbs({ crumbs }: { crumbs: BreadCrumb[] }) {
  return (
    <div className={style.breadcrumbs}>
      {crumbs.map((crumb, index) => {
        return (
          <span key={index}>
            {crumb.link ? (
              <Link to={crumb.link}>{crumb.name}</Link>
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
  const location = useLocation();
  const { pageTitle } = usePageContext();
  currentPageName ??= pageTitle ?? undefined;

  let link = '';

  let crumbs = location.pathname
    .split('/')
    .filter((crumb) => crumb)
    .map((crumb) => {
      link += `/${crumb}`;
      if (location.pathname === link) {
        return { name: currentPageName };
      }
      const name = findNavigationItemName(link, navigationItems);
      return name ? { link, name } : undefined;
    })
    .filter((crumb) => crumb);

  if (rootPageName) {
    crumbs.unshift({ link: '/', name: rootPageName });
  }

  return crumbs as BreadCrumb[];
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
