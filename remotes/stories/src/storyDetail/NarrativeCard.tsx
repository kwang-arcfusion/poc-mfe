// remotes/stories/src/storyDetail/NarrativeCard.tsx
import * as React from 'react';
import { Card, Text, Body1, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import {
  Document20Color,
  Document24Color,
  Document28Color,
  TextBulletListSquareSparkle24Color,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    lineHeight: 1.6,
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    fontSize: '18px',
  },
  narrativeText: {},
  narrativeTitle: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  tldr: {
    ...shorthands.borderLeft('4px', 'solid', tokens.colorBrandBackground),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding('10px', '14px'),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    lineHeight: 1.6,
  },
  bullet: {
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
    backgroundColor: tokens.colorBrandBackground,
    marginTop: '8px',
    flexShrink: 0,
  },
  stack: { display: 'flex', flexDirection: 'column', rowGap: '12px' },
});

export const NarrativeCard: React.FC = () => {
  const s = useStyles();
  return (
    <div className={s.card}>
      <div className={s.narrativeTitle}>
        <Document24Color />
        <Text className={s.title}>Narrative</Text>
      </div>

      <div className={s.tldr}>
        <Body1>
          <strong>TL;DR</strong> — Purchases dropped <strong>−88%</strong> related to{' '}
          <strong>Phone Verification (OTP)</strong> and a <strong>payment timeout</strong> event on
          Aug 5, especially on mobile, while metrics (impr/click/spend) remained similar.
        </Body1>
      </div>

      <div className={s.stack}>
        <div className={s.bullet}>
          <span className={s.dot} />
          <span className={s.narrativeText}>
            <strong>Strong top-funnel</strong>: Impressions +3%, CTR −7%, Spend −2% → Not a traffic
            acquisition issue.
          </span>
        </div>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>Checkout is the bottleneck</strong>: Purchases/1k clicks from 6.86 →{' '}
            <strong>0.82</strong>; The change began on Aug 4–5.
          </Body1>
        </div>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>Mobile hit hardest</strong>: drop-off after OTP increased +27%, TTI increased
            +0.6s from heatmap scripts.
          </Body1>
        </div>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>Supporting events</strong>: payment provider timeout <em>Aug 5, 01:10–03:20</em>{' '}
            (8% error); OTP enabled Aug 4.
          </Body1>
        </div>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>Competition/ad pricing</strong> didn't change much (CPM/CPC remained similar) →
            Rules out an auction issue.
          </Body1>
        </div>
      </div>
    </div>
  );
};
