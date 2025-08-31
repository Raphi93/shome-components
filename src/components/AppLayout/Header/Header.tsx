import { ReactNode } from "react";

import './Header.css';

export interface HeaderProps {
    className?: string;
    title: string;
    buttons?: ReactNode;
    subtitle?: string;
    envTitle?: string;
    isMobile?: boolean;
    image?: string;
    noSidebar?: boolean;
}

export function Header({ className, title, buttons, subtitle, envTitle, isMobile, image, noSidebar }: HeaderProps) {
    return (
        <header className={className}>
            <div className="header-content">
                    <div className={noSidebar ? 'header-titles-container' : 'header-titles-container-with-sidebar'}>
                    {image && !noSidebar && (
                        <div className="header-image-container">
                            <img src={image} alt="Logo" className="header-image" />
                        </div>
                    )}
                    <div className={isMobile ? "header-title-wrapper-mobile" : "header-title-wrapper"}>
                        <span className="header-title">{title}</span>
                        <span className="header-subtitles">{subtitle}</span>
                        {!isMobile && <span className="header-env-titles">{envTitle}</span>}
                    </div>
                </div>
                <div className="header-buttons-container">{buttons}</div>
            </div>
        </header>
    );
}