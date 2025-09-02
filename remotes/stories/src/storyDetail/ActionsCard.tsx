// remotes/stories/src/storyDetail/ActionsCard.tsx
import * as React from 'react';
import { Text, Body1, Badge, makeStyles, shorthands, tokens } from '@fluentui/react-components';
// ✨ 1. Import the necessary icon
import { CheckmarkCircle20Regular, CheckmarkCircle24Color } from '@fluentui/react-icons';

// ✨ 2. Adjust all useStyles to match NarrativeCard
const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    lineHeight: 1.6,
  },
  titleGroup: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    fontSize: '18px',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '12px',
  },
  item: {
    display: 'flex',
    columnGap: '10px',
    ...shorthands.padding('10px', '12px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: tokens.colorStatusDangerBackground3,
    marginTop: '8px',
    flexShrink: 0,
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '6px',
    width: '100%',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
  sub: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

// ✨ 3. (Recommended) Move data into an Array for easier management
const recommendedActions = [
  {
    text: 'Reduce OTP friction on Mobile (A/B test) — guest checkout / OTP for high-risk only; cache OTP page',
    badge: { text: 'Today–Tomorrow', color: 'danger' as const },
    kpi: 'KPI: Checkout→Purchase ↑ ≥ +200% within 48 hrs.',
  },
  {
    text: 'Remove heatmap scripts on mobile — use sampling/staging only',
    badge: { text: 'Today', color: 'danger' as const },
    kpi: 'KPI: TTI ↓ ≥ 0.5s',
  },
  {
    text: 'Switch to a backup payment route + Alert — automatic failover + alert when errors > 2%',
    badge: { text: 'Urgent', color: 'danger' as const },
    kpi: 'KPI: Payment error < 1%',
  },
  {
    text: 'Wallet priority / One-click Pay',
    badge: { text: '2–7 Days', color: 'brand' as const },
    kpi: 'KPI: Mobile CPA ↓ ≥ 30%',
  },
  {
    text: 'Remarket to drop-off groups (3 segments) — ATC / Checkout / OTP abandon',
    badge: { text: '2–7 Days', color: 'brand' as const },
    kpi: 'KPI: Remarketing ROAS ≥ 6.0',
  },
  {
    text: 'Simplify Checkout to a single step on Mobile',
    badge: { text: '1–2 Weeks', color: 'success' as const },
    kpi: 'KPI: Mobile purchase rate ≥ 0.5%',
  },
];

export const ActionsCard: React.FC = () => {
  const s = useStyles();
  // ✨ 4. Adjust all JSX to use the new structure and style
  return (
    <div className={s.card}>
      <div className={s.titleGroup}>
        <CheckmarkCircle24Color />
        <Text className={s.title}>Recommended Actions</Text>
      </div>

      <div className={s.stack}>
        {recommendedActions.map((action, index) => (
          <div key={index} className={s.item}>
            <span className={s.dot} />
            <div className={s.itemContent}>
              <div className={s.row}>
                <Body1>
                  <strong>{action.text.split('—')[0]}</strong>
                  {action.text.includes('—') && `—${action.text.split('—')[1]}`}
                </Body1>
                <Badge
                  appearance="tint"
                  color={action.badge.color}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {action.badge.text}
                </Badge>
              </div>
              <Text className={s.sub}>{action.kpi}</Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
