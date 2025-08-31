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
} from '@fluentui/react-components';
import { Chat24Regular, Chat24Filled } from '@fluentui/react-icons';
import { useChatHistoryStore } from '@arcfusion/store';
import { useNavigate } from 'react-router-dom'; // ✨ 1. Import useNavigate

const useStyles = makeStyles({
  popoverSurface: {
    width: '380px',
    maxHeight: 'calc(100vh - 47px)',
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
  iconWrapper: {
    flexShrink: 0,
  },
  itemText: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
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
    padding: tokens.spacingVerticalL,
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
  const navigate = useNavigate(); // ✨ 2. Initialize navigate
  const {
    conversations,
    isLoading,
    isPopoverOpen,
    fetchConversations,
    togglePopover,
    closePopover,
  } = useChatHistoryStore();

  useEffect(() => {
    // Fetch conversations only when popover opens and the list is empty
    if (isPopoverOpen && conversations.length === 0) {
      fetchConversations();
    }
  }, [isPopoverOpen, conversations.length, fetchConversations]);

  // ✨ 3. Implement the navigation logic
  const handleSelectConversation = (thread_id: string) => {
    navigate(`/ask_ai/${thread_id}`);
    closePopover(); // Close the popover after selection
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