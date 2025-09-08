// packages/ui/src/components/Chat/ChatInputBar.tsx
import React, { useState } from 'react';
import { makeStyles, tokens, Textarea, Button } from '@fluentui/react-components';
import { Send24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  bottomBar: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: tokens.spacingVerticalS,
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    maxWidth: '820px',
    position: 'relative',
  },
  textarea: { width: '100%', paddingRight: '50px' },
  sendButton: { position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' },
  sourceInfo: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    paddingTop: tokens.spacingVerticalS,
  },
});

// 👈 1. เพิ่ม size เข้าไปใน Props Interface
interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  isStreaming: boolean;
  sourceInfoText?: string;
  size?: 'small' | 'medium' | 'large'; // เพิ่ม type ของ size
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  isStreaming,
  sourceInfoText,
  size = 'large', // 👈 2. รับ prop และกำหนดค่า default เป็น 'large'
}) => {
  const styles = useStyles();
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isStreaming) return;
    onSendMessage(trimmed);
    setInputValue('');
  };

  return (
    <div className={styles.bottomBar}>
      <div className={styles.inputContainer}>
        <Textarea
          resize="vertical"
          placeholder="Ask Anything..."
          className={styles.textarea}
          size={size} // 👈 3. ส่ง prop size ไปให้ Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          appearance="transparent"
          icon={<Send24Regular />}
          className={styles.sendButton}
          aria-label="Send message"
          onClick={handleSend}
          disabled={!inputValue.trim() || isStreaming}
        />
      </div>
      {sourceInfoText && <div className={styles.sourceInfo}>{sourceInfoText}</div>}
    </div>
  );
};