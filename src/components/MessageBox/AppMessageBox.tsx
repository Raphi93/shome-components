import React from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";

import "./AppMessageBox.scss";
import { Button } from "../Button/Button";

export type AppMessageType = "info" | "success" | "warning" | "error";

export interface AppMessage {
  type: AppMessageType;
  text: string;
}

export interface AppMessageBoxProps extends AppMessage {
  setMessage: (msg: AppMessage | null) => void;
}

export const AppMessageBox: React.FC<AppMessageBoxProps> = ({ type, text, setMessage }) => {
  if (!text) return null;

  return (
    <div
      className={`message-box message-${type}`}
    >
          <span>{text}</span>
          <Button onClick={() => setMessage(null)} icon={faX} />
    </div>
  );
};