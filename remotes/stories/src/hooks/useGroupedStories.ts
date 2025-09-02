// remotes/stories/src/hooks/useGroupedStories.ts
import { useMemo } from 'react';
// ✨ 1. เปลี่ยนการ import Story type จาก @arcfusion/types
import type { Story } from '@arcfusion/types';

// --- Date Formatting Helper ---
// Formats a Date object into a string like "14 Aug 2025"
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// --- Custom Hook: useGroupedStories ---
// This hook takes an array of stories and groups them by date.
// It also provides the formatted title for each group ("Today", "Yesterday", etc.).
export const useGroupedStories = (stories: Story[]) => {
  const groupedStories = useMemo(() => {
    const groups: { [key: string]: Story[] } = {};

    // 1. Group stories by their date string (e.g., "2025-08-26")
    stories.forEach((story) => {
      // ✨ 2. แก้ไขจากการใช้ story.timestamp มาเป็น story.created_at และแปลงเป็น Date object
      const dateKey = new Date(story.created_at).toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(story);
    });

    // 2. Get today's and yesterday's date for comparison
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // 3. Convert the grouped object into a sorted array with formatted titles
    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort dates descending
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