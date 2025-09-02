import { ReactNode } from 'react';
import { usePageContext } from '../../../context/PageContext';
import { MessageBox } from '../../MessageBox/MessageBox';

import '../AppLayouts.css'

export interface AppMainProps {
  children?: ReactNode;
  upperComponent?: ReactNode;
  hideTitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Main({
  children,
  upperComponent,
  hideTitle = true,
  className,
  onClick = () => {},
}: AppMainProps) {
 const { pageTitle, message, setMessage } = usePageContext();

  return (
    <main onClick={onClick} className={className}>
      {upperComponent}
      {pageTitle && !hideTitle && <h1>{pageTitle}</h1>}
      {message && <MessageBox {...message} setMessage={setMessage} />}
      {children}
    </main>
  );
}