// remotes/stories/src/storyDetail/KpiCard.tsx
import * as React from 'react';
import { Card, Text, Tooltip, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Info16Regular, ArrowDown16Regular, ArrowUp16Regular } from '@fluentui/react-icons';
import { Delta } from './types';

const useStyles = makeStyles({
  kpiCard: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '8px',
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    borderColor: tokens.colorNeutralStroke2,
  },
  head: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  label: {
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '.03em',
    fontSize: tokens.fontSizeBase200,
  },
  ctx: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  chip: {
    ...shorthands.padding('4px', '8px'),
    ...shorthands.borderRadius('999px'),
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
  row: { display: 'flex', alignItems: 'baseline', columnGap: '10px' },
  value: { fontSize: '28px', fontWeight: tokens.fontWeightBold, lineHeight: 1 },
  delta: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: '6px',
    fontSize: tokens.fontSizeBase300,
  },
  down: { color: tokens.colorPaletteRedForeground1 },
  up: { color: tokens.colorPaletteGreenForeground2 },
  spark: {
    width: '100%',
    height: '50px',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  caption: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200 },
  goal: {
    width: '100%',
    height: '8px',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius('999px'),
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${tokens.colorPaletteRedBackground1}, ${tokens.colorPaletteRedBorderActive})`,
  },
});

const DeltaBadge: React.FC<{ delta: Delta }> = ({ delta }) => {
  const s = useStyles();
  const Icon = delta.direction === 'down' ? ArrowDown16Regular : ArrowUp16Regular;
  const cls = delta.direction === 'down' ? s.down : s.up;
  return (
    <span className={`${s.delta} ${cls}`}>
      <Icon aria-hidden />
      {delta.text}
    </span>
  );
};

export type KpiCardProps = {
  label: string;
  value: string | number;
  delta?: Delta;
  chips?: string[];
  definition?: React.ReactNode;
  sparkColor?: string;
  sparkPoints?: number[]; // 0..1
  caption?: string;
  goalPct?: number;
  goalCaption?: string;
};

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  delta,
  chips = [],
  definition,
  sparkColor = tokens.colorNeutralForeground2,
  sparkPoints,
  caption,
  goalPct,
  goalCaption,
}) => {
  const s = useStyles();
  return (
    <Card className={s.kpiCard} appearance="filled-alternative">
      <div className={s.head}>
        <Text className={s.label}>{label}</Text>
        {definition && (
          <Tooltip withArrow content={definition} relationship="label">
            <span aria-label="definition">
              <Info16Regular />
            </span>
          </Tooltip>
        )}
      </div>

      {chips.length > 0 && (
        <div className={s.ctx}>
          {chips.map((c) => (
            <span key={c} className={s.chip}>
              {c}
            </span>
          ))}
        </div>
      )}

      <div className={s.row}>
        <span className={s.value}>{value}</span>
        {delta && <DeltaBadge delta={delta} />}
      </div>

      {sparkPoints && sparkPoints.length > 1 && (
        <svg className={s.spark} viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden>
          <polyline
            points="0,40 100,40"
            stroke={tokens.colorNeutralStroke2}
            strokeDasharray="3 4"
            fill="none"
          />
          <polyline
            points={sparkPoints
              .map((p, i) => `${(i / (sparkPoints.length - 1)) * 100},${40 - p * 30}`)
              .join(' ')}
            fill="none"
            stroke={sparkColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}

      {caption && <Text className={s.caption}>{caption}</Text>}

      {typeof goalPct === 'number' && (
        <>
          <div className={s.goal}>
            <div className={s.goalFill} style={{ width: `${goalPct}%` }} />
          </div>
          {goalCaption && <Text className={s.caption}>{goalCaption}</Text>}
        </>
      )}
    </Card>
  );
};
