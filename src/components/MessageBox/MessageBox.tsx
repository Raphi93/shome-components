import React from "react";
import { Button } from "../index";
import { faX } from "@fortawesome/free-solid-svg-icons";

import "./MessageBox.css";

export type MessageType = "info" | "success" | "warning" | "error";

export interface Message {
  type: MessageType;
  text: string;
}

export interface MessageBoxProps extends Message {
  setMessage: (msg: Message | null) => void;
}

export const MessageBox: React.FC<MessageBoxProps> = ({ type, text, setMessage }) => {
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
