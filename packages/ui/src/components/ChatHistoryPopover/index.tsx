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
  Text, // ✨ 1. Import TabList และ Tab
  TabList,
  Tab,
} from '@fluentui/react-components';
import { Chat24Regular, Chat24Filled } from '@fluentui/react-icons';
// ✨ 2. Import Type เพิ่มเติม
import { useChatHistoryStore, type ChatHistoryTab } from '@arcfusion/store';
import type { ConversationSummary } from '@arcfusion/types';
import { useNavigate } from 'react-router-dom';

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
  }, // ✨ 3. เพิ่ม Style สำหรับ TabList
  tabContainer: {},
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
  const navigate = useNavigate(); // ✨ 4. ดึง State และ Actions ใหม่จาก Store
  const {
    conversations,
    askConversations,
    storyConversations,
    isLoading,
    isPopoverOpen,
    activeTab,
    fetchConversations,
    togglePopover,
    closePopover,
    setActiveTab,
  } = useChatHistoryStore();

  useEffect(() => {
    if (isPopoverOpen && conversations.length === 0) {
      fetchConversations();
    }
  }, [isPopoverOpen, conversations.length, fetchConversations]); // ✨ 5. ปรับปรุง Handler ให้รองรับทั้งสองกรณี

  const handleSelectConversation = (convo: ConversationSummary) => {
    if (convo.story_id) {
      // ถ้ามี story_id, navigate ไปที่หน้า story detail พร้อมส่ง thread_id ไปใน URL
      navigate(`/stories/${convo.story_id}?thread=${convo.thread_id}`);
    } else {
      // ถ้าไม่มี, navigate ไปที่หน้า ask_ai เหมือนเดิม
      navigate(`/ask_ai/${convo.thread_id}`);
    }
    closePopover();
  }; // ✨ 6. สร้างฟังก์ชัน Helper เพื่อ render รายการแชท (ลดโค้ดซ้ำซ้อน)

  const renderList = (items: ConversationSummary[]) => {
    if (items.length === 0) {
      return (
        <div className={styles.center}>
          <Text>No history yet</Text>
        </div>
      );
    }

    return items.map((convo) => (
      <div
        key={convo.id}
        className={styles.listItem}
        onClick={() => handleSelectConversation(convo)} // <-- ใช้ Handler ที่ปรับปรุงแล้ว
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
    ));
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={togglePopover} positioning="below-end">
      <PopoverTrigger>
        <Button
          appearance="transparent"
          icon={isPopoverOpen ? <Chat24Filled /> : <Chat24Regular />}
          aria-label="Chat History"
        />
      </PopoverTrigger>

      <PopoverSurface className={styles.popoverSurface}>
        {/* ✨ 7. เพิ่ม TabList UI */}
        <div className={styles.tabContainer}>
          <TabList
            selectedValue={activeTab}
            onTabSelect={(_, data) => setActiveTab(data.value as ChatHistoryTab)}
          >
            <Tab value="ask">Ask</Tab> <Tab value="story">Story</Tab>
          </TabList>
        </div>

        <div className={styles.listContainer}>
          {isLoading ? (
            <div className={styles.center}>
              <Spinner />
            </div>
          ) : // ✨ 8. ใช้เงื่อนไขเพื่อเลือกว่าจะ render list ไหน
          activeTab === 'ask' ? (
            renderList(askConversations)
          ) : (
            renderList(storyConversations)
          )}
        </div>
      </PopoverSurface>
    </Popover>
  );
};
