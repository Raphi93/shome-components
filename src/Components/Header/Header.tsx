'use client';

import React from 'react';

import type { HeaderProps } from './Header.type';

import './Header.scss';

export function Header({
  className = 'header',
  title,
  buttons,
  subtitle,
  envTitle,
  isMobile,
  image,
  noSidebar,
  brandName,
}: HeaderProps) {
  return (
    <header className={className}>
      <div className="header-content">
        <div className={noSidebar ? 'header-titles-container' : 'header-titles-container-with-sidebar'}>
          {image && !noSidebar && (
            <div className="header-image-container">
              <img
                src={image}
                alt="Logo"
                className={`header-image ${String(brandName ?? '').replace('_', '-').toLowerCase()}`}
              />
            </div>
          )}

          <div className={isMobile ? 'header-title-wrapper-mobile' : 'header-title-wrapper'}>
            <span className="header-title">{title}</span>
            {subtitle && <span className="header-subtitles">{subtitle}</span>}
            {!isMobile && envTitle && <span className="header-env-titles">{envTitle}</span>}
          </div>
        </div>

        <div className="header-buttons-container">{buttons}</div>
      </div>
    </header>
  );
}
