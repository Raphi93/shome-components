
// ChatBot.types.ts
export type ChatBotMessage = {
  id: string;
  text: string;
  sender: "user" | "bot";
  loading?: boolean;
  createdAt: number;
};

export type ChatBotProps = {
  preLoadedMessages: ChatBotMessage[];
  chatButtomChildren?: React.ReactNode;
  user: string;
  indexDbName: string;
  isIndexDb: boolean;
  newMessage: ChatBotMessage;
  setMessagesVoice: (message: ChatBotMessage) => void;
  handleSendMessage: (message: ChatBotMessage) => void;
};