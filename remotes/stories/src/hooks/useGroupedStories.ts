// remotes/stories/src/hooks/useGroupedStories.ts
import { useMemo } from 'react';
import type { Story } from '@arcfusion/types';

const formatDateForOlderDates = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatRelativeDate = (dateKey: string): string => {
  const date = new Date(dateKey);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // รีเซ็ตเวลาเพื่อเปรียบเทียบเฉพาะวันที่

  const storyDate = new Date(date);
  storyDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - storyDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays > 1 && diffDays <= 5) {
    return `${diffDays} days ago`;
  }
  return formatDateForOlderDates(storyDate);
};

export const useGroupedStories = (stories: Story[]) => {
  const groupedStories = useMemo(() => {
    const groups: { [key: string]: Story[] } = {};

    stories.forEach((story) => {
      const dateKey = new Date(story.created_at).toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(story);
    });

    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((dateKey) => {
        return {
          title: formatRelativeDate(dateKey),
          originalDate: dateKey,
          stories: groups[dateKey],
        };
      });
  }, [stories]);

  return groupedStories;
};
