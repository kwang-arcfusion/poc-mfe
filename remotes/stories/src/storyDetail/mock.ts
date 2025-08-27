// remotes/stories/src/storyDetail/mock.ts
import type { TrendPoint } from './TrendChart';
import type { BreakdownRow, FunnelRow } from './types';

export const trendCurrent: TrendPoint[] = [
  { day: 'Aug 3', value: 13 },
  { day: 'Aug 4', value: 7 },
  { day: 'Aug 5', value: 5 },
  { day: 'Aug 6', value: 6 },
  { day: 'Aug 7', value: 4 },
  { day: 'Aug 8', value: 4 },
  { day: 'Aug 9', value: 4 },
];

export const trendPrior: TrendPoint[] = [
  { day: 'Jul 27', value: 50 },
  { day: 'Jul 28', value: 56 },
  { day: 'Jul 29', value: 52 },
  { day: 'Jul 30', value: 55 },
  { day: 'Jul 31', value: 54 },
  { day: 'Aug 1', value: 51 },
  { day: 'Aug 2', value: 54 },
];

export const funnelRows: FunnelRow[] = [
  { step: 'Landing View', now: 860, prior: 890, delta: '-3 pt' },
  { step: 'Add to Cart', now: 64, prior: 66, delta: '≈' },
  { step: 'Checkout Start', now: 38, prior: 38, delta: '≈' },
  { step: 'Purchase', now: 0.82, prior: 6.86, delta: 'ตกหนัก' },
];

export const breakdownDevice: BreakdownRow[] = [
  { seg: 'Mobile', conversions: 22, cpa: '฿2,900', delta: '−61%' },
  { seg: 'Desktop', conversions: 8, cpa: '฿2,350', delta: '−43%' },
];

export const breakdownRegion: BreakdownRow[] = [
  { seg: 'BKK', share: '37%', delta: '−52%' },
  { seg: 'North', share: '12%', delta: '−71%' },
];
