// packages/ui/src/components/ChatHistoryPopover/index.tsx
import React, { useEffect } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Spinner,
  Text,
  Body1,
  Caption1,
} from '@fluentui/react-components';
import { Chat24Regular, Chat24Filled } from '@fluentui/react-icons';
import { useChatHistoryStore } from '@arcfusion/store';

const useStyles = makeStyles({
  popoverSurface: {
    width: '380px',
    height: 'calc(100vh - 47px)',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.borderColor(tokens.colorNeutralStroke2),
    boxShadow: tokens.shadow16,
  },
  header: {
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    position: 'sticky',
    top: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 1,
  },
  listContainer: {
    overflowY: 'auto',
    flexGrow: 1,
  },
  listItem: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalM),
    alignItems: 'center',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  // ✨ 1. เพิ่ม Style สำหรับ Icon Wrapper
  iconWrapper: {
    flexShrink: 0, // ป้องกันไม่ให้ Icon หดตัว
  },
  itemText: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1, // ✨ 2. กำหนดให้กล่องข้อความยืดเต็มพื้นที่ที่เหลือ
    minWidth: 0,
  },
  itemTitle: {
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemDate: {
    color: tokens.colorNeutralForeground4,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const ChatHistoryPopover = () => {
  const styles = useStyles();
  const {
    conversations,
    isLoading,
    isPopoverOpen,
    fetchConversations,
    togglePopover,
    closePopover,
  } = useChatHistoryStore();

  useEffect(() => {
    if (isPopoverOpen && conversations.length === 0) {
      fetchConversations();
    }
  }, [isPopoverOpen, conversations.length, fetchConversations]);

  const handleSelectConversation = (thread_id: string) => {
    console.log('Selected thread_id:', thread_id);
    // TODO: Implement logic to load this conversation
    closePopover();
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={togglePopover}>
      <PopoverTrigger>
        <Button
          appearance="transparent"
          icon={isPopoverOpen ? <Chat24Filled /> : <Chat24Regular />}
          aria-label="Chat History"
        />
      </PopoverTrigger>

      <PopoverSurface className={styles.popoverSurface}>
        <div className={styles.header}>
          <Text as="h2" size={500} weight="semibold">
            Chat History
          </Text>
        </div>
        <div className={styles.listContainer}>
          {isLoading ? (
            <div className={styles.center}>
              <Spinner />
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((convo) => (
              <div
                key={convo.id}
                className={styles.listItem}
                onClick={() => handleSelectConversation(convo.thread_id)}
              >
                {/* ✨ 3. ครอบ Icon ด้วย div ที่มี Style ใหม่ */}
                <div className={styles.iconWrapper}>
                  <Chat24Regular />
                </div>
                <div className={styles.itemText}>
                  <Text size={300} weight="semibold" className={styles.itemTitle}>
                    {convo.title}
                  </Text>
                  <Text size={200} className={styles.itemDate}>
                    {formatDate(convo.updated_at)}
                  </Text>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.center}>
              <Text>No history yet</Text>
            </div>
          )}
        </div>
      </PopoverSurface>
    </Popover>
  );
};
