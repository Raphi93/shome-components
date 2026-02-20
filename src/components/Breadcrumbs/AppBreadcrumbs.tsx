"use client";

import { useState } from 'react';
import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './Breadcrumbs.module.scss';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NavigationItem } from '../../types/Layout';
import { usePageContext } from '../../context/PageContext';

export type BreadCrumb = {
  link: string;
  name: string;
};

export function AppBreadcrumbs({ crumbs, menu}: { crumbs: BreadCrumb[], menu: NavigationItem[] }) {
    const { pageTitle } = usePageContext();
  const pathname = usePathname() ?? "";
  const menuLength = 0;
  const isHomeShown = crumbs?.length > menuLength && pathname?.includes(`${menu.find((item) => item.name.toLowerCase() === 'dashboard')?.link}`);
  const homeLink = isHomeShown
    ? (menu.find((item) => item.name.toLowerCase() === 'dashboard')?.link ?? '/')
    : '/';

  const filteredCrumbs = isHomeShown
    ? crumbs.filter(c => c.name.toLowerCase() !== 'dashboard')
    : crumbs;

  return (
    <div className={style.breadcrumbs}>
      {isHomeShown && (
        <>
          <span>
            <Link href={homeLink}>
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </span>
          {crumbs.length > 0 && (
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{ margin: '0 6px', opacity: 0.6, fontSize: '0.75em' }}
            />
          )}
        </>
      )}

      {filteredCrumbs.map((crumb, index) => {
        const isLast = index === filteredCrumbs.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <FontAwesomeIcon
                icon={faChevronRight}
                style={{ margin: '0 6px', opacity: 0.6, fontSize: '0.75em' }}
              />
            )}
            <span>
              {crumb.link === '/dashboard' ? null : (
                crumb.link && !isLast ? (
                  <Link href={crumb.link}>{crumb.name}</Link>
                ) : (
                  <span className={style.currentItem}>{pageTitle || crumb.name}</span>
                )
              )}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}