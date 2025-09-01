// remotes/ask_ai/src/components/ChatMessage.tsx
import React from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const useStyles = makeStyles({
  // ✨ START: นำ Style ดั้งเดิมกลับมาใช้ ✨
 root: {
  display: 'flex',
  ...shorthands.gap(tokens.spacingHorizontalM),
  maxWidth: '85%', // กลับมาใช้ 85% เหมือนเดิม
  width: 'fit-content',
    // จัดการการชิดซ้าย-ขวา ที่นี่
  '&[data-sender="user"]': {
   alignSelf: 'flex-end',
   flexDirection: 'row-reverse',
  },
  '&[data-sender="ai"]': {
   alignSelf: 'flex-start',
  },
 },
 bubble: {
  ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
  ...shorthands.borderRadius(tokens.borderRadiusLarge),
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
    // สี Bubble กลับมาเป็นเหมือนเดิม
  '&[data-sender="user"]': {
   backgroundColor: tokens.colorNeutralBackground1,
   color: tokens.colorNeutralForeground1,
  },
  '&[data-sender="ai"]': {
   backgroundColor: tokens.colorNeutralBackground2,
   color: tokens.colorNeutralForeground1,
  },
 },
 markdown: {
  '& p': { marginTop: 0, marginBottom: tokens.spacingVerticalS },
  '& ul, & ol': { ...shorthands.padding(0, 0, 0, tokens.spacingHorizontalL), ...shorthands.margin(0) },
  '& li': { marginBottom: tokens.spacingVerticalXS },
 },
  // ✨ END: สิ้นสุดการนำ Style เดิมกลับมา ✨
});

interface ChatMessageProps {
 sender: 'user' | 'ai';
 content: string;
}

export function ChatMessage({ sender, content }: ChatMessageProps) {
 const styles = useStyles();

 return (
    // ใช้ root div ที่มี alignSelf เพื่อจัดตำแหน่ง
  <div className={styles.root} data-sender={sender}>
   <div className={styles.bubble} data-sender={sender}>
    <div className={styles.markdown}>
     <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
   </div>
  </div>
 );
}