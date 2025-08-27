// remotes/stories/src/storyDetail/types.ts
export type Delta = { direction: 'up' | 'down' | 'flat'; text: string };

export type FunnelRow = {
  step: string;
  now: number | string;
  prior: number | string;
  delta: string;
};

export type BreakdownRow = {
  seg: string;
  conversions?: number;
  cpa?: string;
  share?: string;
  delta: string;
};
