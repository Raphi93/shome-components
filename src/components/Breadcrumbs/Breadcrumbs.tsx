"use client";

import React from 'react';
import { usePathname } from "next/navigation";

import { useBreadCrumbsContext } from '../../hooks/BreadCrumbsContext';

import { AppBreadcrumbs } from './AppBreadcrumbs';
import { NavigationItem } from '../../types/Layout/Layout';


export const BreadcrumbsComponent = ({
  menu,
  normalLength,
  skipFirstSegment = false,
}: {
  menu: NavigationItem[];
  normalLength?: number;
  skipFirstSegment?: boolean;
}) => {
  const pathname = usePathname() ?? "";
  const { specialBreadCrumbs } = useBreadCrumbsContext();

  const crumbs =
    specialBreadCrumbs?.filter((crumb) => crumb.link !== undefined).map(crumb => ({ ...crumb, link: crumb.link as string })) ||
    generateBreadcrumbsFromMenu(pathname, menu, skipFirstSegment);

  return (
    <AppBreadcrumbs
      crumbs={crumbs}
      menu={menu}
    />
  );
};


function generateBreadcrumbsFromMenu(
  originalPathname: string,
  menu: NavigationItem[],
  skipFirstSegment: boolean
): { name: string; link: string }[] {
  let pathname = originalPathname;
  const crumbs: { name: string; link: string }[] = [];

  const firstSegment = pathname.split('/')[1];
  const dashboardLink = menu.find(
    (item) => item.name.toLowerCase() === 'dashboard'
  )?.link;

  if (skipFirstSegment && `/${firstSegment}` === dashboardLink) {
    pathname = pathname.split('/').slice(2).join('/');
    pathname = '/' + pathname;
  }

  const segments = pathname.split('/').filter(Boolean);

  let currentMenu = menu;
  let pathAccumulator = dashboardLink && dashboardLink !== '/' ? dashboardLink : '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    if (/^\d+$/.test(segment)) {
      continue;
    }

    pathAccumulator += `/${segment}`;

    const match = currentMenu.find((item) => item.link === `/${segment}`);

    if (match) {
      crumbs.push({ name: match.name, link: pathAccumulator });
      currentMenu = (match.children as NavigationItem[]) || [];
    } else {
      const autoLabel = segment
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      crumbs.push({ name: autoLabel, link: pathAccumulator });
    }
  }

  return crumbs;
}


