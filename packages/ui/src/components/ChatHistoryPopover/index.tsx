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
  TabList,
  Tab,
  Badge,
} from '@fluentui/react-components';
import { Chat24Regular, Chat24Filled } from '@fluentui/react-icons';
import { useChatHistoryStore, type ChatHistoryTab } from '@arcfusion/store';
import type { ConversationSummary } from '@arcfusion/types';
import { useNavigate } from 'react-router-dom';
import { TASK_DISPLAY_TEXT } from '../Chat/AiStatusIndicator';

const useStyles = makeStyles({
  popoverSurface: {
    width: '380px',
    maxHeight: 'calc(100vh - 48px)',
    padding: 0,
    left: '80px !important',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.borderColor(tokens.colorNeutralStroke2),
    boxShadow: tokens.shadow16,
  },
  header: {
    ...shorthands.padding(
      tokens.spacingVerticalL,
      tokens.spacingHorizontalL,
      tokens.spacingVerticalS
    ),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    top: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 1,
  },
  tabContainer: {
    paddingLeft: '6px',
    paddingRight: '6px',
    boxSizing: 'border-box',
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
  itemStatus: {
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: tokens.spacingVerticalL,
  },
  badgeWrapper: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  const navigate = useNavigate();

  const {
    conversations,
    askConversations,
    storyConversations,
    isLoading,
    isPopoverOpen,
    activeTab,
    streamingThreadId,
    streamingTask,
    unreadResponseInfo, // ✨ เปลี่ยนมาใช้ตัวนี้
    fetchConversations,
    togglePopover,
    closePopover,
    setActiveTab,
  } = useChatHistoryStore();

  useEffect(() => {
    if (isPopoverOpen && conversations.length === 0) {
      fetchConversations();
    }
  }, [isPopoverOpen, conversations.length, fetchConversations]);

  const handleSelectConversation = (convo: ConversationSummary) => {
    if (convo.story_id) {
      navigate(`/stories/${convo.story_id}?thread=${convo.thread_id}`);
    } else {
      navigate(`/ask_ai/${convo.thread_id}`);
    }
    closePopover();
  };

  const renderList = (items: ConversationSummary[]) => {
    if (items.length === 0) {
      return (
        <div className={styles.center}>
          <Text>No history yet</Text>
        </div>
      );
    }

    return items.map((convo) => {
      const isActiveStreaming = convo.thread_id === streamingThreadId;

      return (
        <div
          key={convo.id}
          className={styles.listItem}
          onClick={() => handleSelectConversation(convo)}
        >
          <div className={styles.iconWrapper}>
            {isActiveStreaming ? <Spinner size="tiny" /> : <Chat24Regular />}
          </div>
          <div className={styles.itemText}>
            <Text size={300} weight="semibold" className={styles.itemTitle}>
              {convo.title}
            </Text>
            {isActiveStreaming && streamingTask ? (
              <Text size={200} className={styles.itemStatus}>
                {TASK_DISPLAY_TEXT[streamingTask] || 'Processing...'}
              </Text>
            ) : (
              <Text size={200} className={styles.itemDate}>
                {formatDate(convo.updated_at)}
              </Text>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={togglePopover} positioning="below-end">
      <PopoverTrigger>
        <div className={styles.badgeWrapper}>
          <Button
            appearance="transparent"
            icon={isPopoverOpen ? <Chat24Filled /> : <Chat24Regular />}
            aria-label="Chat History"
          />
          {/* ✨ เงื่อนไขการแสดง Badge */}
          {unreadResponseInfo && (
             <Badge
              size="extra-small"
              appearance="filled"
              color="danger"
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                pointerEvents: 'none', // เพื่อให้คลิกทะลุไปที่ปุ่มได้
              }}
            />
          )}
        </div>
      </PopoverTrigger>
      <PopoverSurface className={styles.popoverSurface}>
        <div className={styles.header}>
          <Text as="h2" size={400} weight="semibold">
            Chat History
          </Text>
        </div>
        <div className={styles.tabContainer}>
          <TabList
            selectedValue={activeTab}
            onTabSelect={(_, data) => setActiveTab(data.value as ChatHistoryTab)}
          >
            <Tab value="ask">Ask</Tab>
            <Tab value="story">Story</Tab>
          </TabList>
        </div>
        <div className={styles.listContainer}>
          {isLoading ? (
            <div className={styles.center}>
              <Spinner />
            </div>
          ) : activeTab === 'ask' ? (
            renderList(askConversations)
          ) : (
            renderList(storyConversations)
          )}
        </div>
      </PopoverSurface>
    </Popover>
  );
};