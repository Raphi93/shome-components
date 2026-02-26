import { ReactNode } from 'react';
import { usePageContext } from '../../context/PageContext';
import { AppMessageBox } from '../AppMessageBox/AppMessageBox';

export interface AppPageWrapperProps {
  children?: ReactNode;
  upperComponent?: ReactNode;
  hideTitle?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

/**
 * NewMain component wrapper that renders the main page area, including an optional
 * component above the title, the page title from context, an application message box,
 * and the component's children.
 *
 * @param children - The main content to render inside the <main> element.
 * @param upperComponent - Optional element rendered above the page title (for example, a toolbar or breadcrumbs).
 * @param hideTitle - If true, the page title from context will not be rendered. Default: false.
 * @param className - Optional CSS class name(s) applied to the <main> element.
 * @param onClick - Click handler attached to the <main> element. Default: noop.
 *
 * @returns A React element representing the main content area.
 *
 * @remarks
 * - This component reads pageTitle, message, and setMessage from usePageContext().
 * - If pageTitle exists and hideTitle is false, an <h1> with the page title is rendered.
 * - If message exists, an <AppMessageBox /> is rendered and given the message plus the setMessage callback.
 *
 * @example
 * <NewMain upperComponent={<Toolbar />} className="page" onClick={() => {}}>
 *   <PageContent />
 * </NewMain>
 */
export function Main({
  children,
  upperComponent,
  hideTitle = false,
  className,
  onClick,
}: AppPageWrapperProps) {
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
