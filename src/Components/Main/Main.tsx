'use client';

import { usePageContext } from '../../context/PageContext';
import { AppMessageBox } from '../AppMessageBox/AppMessageBox';

import type { MainProps } from './Main.type';
export type { MainProps } from './Main.type';

export function Main({
  children,
  upperComponent,
  hideTitle = false,
  className,
  onClick,
}: MainProps) {
  const { pageTitle, message, setMessage } = usePageContext();

  return (
    <main onClick={onClick} className={className}>
      {upperComponent}
      {pageTitle && !hideTitle && <h1>{pageTitle}</h1>}
      {message && <AppMessageBox type={message.type as any} text={message.text} />}
      {children}
    </main>
  );
}
