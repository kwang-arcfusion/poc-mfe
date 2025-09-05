import { useMemo } from 'react';
import type { Story } from '@arcfusion/types';

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
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

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((dateKey) => {
        let title: string;
        if (dateKey === todayStr) {
          title = 'Today';
        } else if (dateKey === yesterdayStr) {
          title = 'Yesterday';
        } else {
          title = formatDate(new Date(dateKey));
        }
        return {
          title,
          stories: groups[dateKey],
        };
      });
  }, [stories]);

  return groupedStories;
};