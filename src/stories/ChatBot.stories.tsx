import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useCallback } from 'react';
import { ChatBot } from '../Components/ChatBot/ChatBot';
import type { ChatBotMessage } from '../Components/ChatBot/ChatBot';

const meta: Meta = {
  title: 'UI/ChatBot',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

const BOT_RESPONSES = [
  'Hello! How can I help you today?',
  'That\'s a great question. Let me look into that for you.',
  'I understand. Could you provide more details?',
  'Sure, I can help with that!',
  'Thank you for your patience while I process this.',
];

const makeId = () => Math.random().toString(36).slice(2);

const INITIAL: ChatBotMessage[] = [
  { id: makeId(), sender: 'bot',  text: 'Welcome! How can I assist you today?', createdAt: Date.now() - 60000 },
  { id: makeId(), sender: 'user', text: 'I need help with my order.',            createdAt: Date.now() - 30000 },
  { id: makeId(), sender: 'bot',  text: 'Of course! Please provide your order number.', createdAt: Date.now() - 15000 },
];

export const Default: Story = {
  name: 'Interactive chat',
  render: () => {
    const [messages, setMessages] = useState<ChatBotMessage[]>(INITIAL);
    const [pending,  setPending]  = useState<ChatBotMessage>({ id: '', text: '', sender: 'user', createdAt: 0 });

    const handleSend = useCallback((msg: ChatBotMessage) => {
      setMessages((prev) => [...prev, { ...msg, id: makeId(), createdAt: Date.now() }]);

      // Simulate bot reply after a short delay
      const botMsg: ChatBotMessage = { id: makeId(), sender: 'bot', text: '', loading: true, createdAt: Date.now() + 100 };
      setMessages((prev) => [...prev, botMsg]);

      setTimeout(() => {
        const reply = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
        setMessages((prev) =>
          prev.map((m) => m.id === botMsg.id ? { ...m, text: reply, loading: false } : m)
        );
      }, 1000);
    }, []);

    return (
      <div style={{ height: 520, maxWidth: 640, border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
        <ChatBot
          user="Demo user"
          indexDbName="storybook-chat"
          isIndexDb={false}
          preLoadedMessages={messages}
          newMessage={pending}
          setMessagesVoice={setPending}
          handleSendMessage={handleSend}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  name: 'Empty conversation',
  render: () => {
    const [pending, setPending] = useState<ChatBotMessage>({ id: '', text: '', sender: 'user', createdAt: 0 });
    return (
      <div style={{ height: 520, maxWidth: 640, border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
        <ChatBot
          user="New user"
          indexDbName="storybook-chat-empty"
          isIndexDb={false}
          preLoadedMessages={[]}
          newMessage={pending}
          setMessagesVoice={setPending}
          handleSendMessage={(msg) => console.log('sent:', msg)}
        />
      </div>
    );
  },
};
