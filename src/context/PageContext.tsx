import React, { createContext, useContext, useState } from "react";

export type MessageType = "info" | "success" | "warning" | "error";
export interface Message {
  type: MessageType;
  text: string;
}

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

  return (
    <PageContext.Provider value={{ pageTitle, setPageTitle, message, setMessage }}>
      {children}
    </PageContext.Provider>
  );
};
  
export const usePageContext = () => {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error("usePageContext must be used inside <PageProvider>");
  return ctx;
};
