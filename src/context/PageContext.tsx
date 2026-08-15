import React, { createContext, useContext, useMemo, useState } from "react";
import { Message } from "..";

export type MessageType = "info" | "success" | "warning" | "error";

interface PageContextValue {
  pageTitle: string | null;
  setPageTitle: (t: string | null) => void;
  message: Message | null;
  setMessage: (m: Message | null) => void;
}

const PageContext = createContext<PageContextValue | undefined>(undefined);

export const PageProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

  // Stable reference: PageProvider wraps the entire app's content, so an
  // unmemoized value object here would re-render every consumer (and
  // everything below them) on every single render of this provider.
  const value = useMemo(
    () => ({ pageTitle, setPageTitle, message, setMessage }),
    [pageTitle, setPageTitle, message, setMessage]
  );

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
};
  
export const usePageContext = () => {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error("usePageContext must be used inside <PageProvider>");
  return ctx;
};