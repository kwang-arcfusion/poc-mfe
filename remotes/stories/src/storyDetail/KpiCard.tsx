// remotes/stories/src/storyDetail/KpiCard.tsx
import * as React from 'react';
import { Card, Text, Tooltip, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Info16Regular, ArrowDown16Regular, ArrowUp16Regular } from '@fluentui/react-icons';

export type Delta = { direction: 'up' | 'down' | 'flat'; text: string };

const useStyles = makeStyles({
  kpiCard: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '8px',
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    height: '100%', // ✨ ทำให้การ์ดสูงเท่ากัน
  },
  head: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  label: {
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '.03em',
    fontSize: tokens.fontSizeBase200,
  },
  ctx: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: tokens.spacingVerticalXS },
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
  caption: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200 },
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
  caption?: string;
};

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  delta,
  chips = [],
  definition,
  caption,
}) => {
  const s = useStyles();
  return (
    <Card className={s.kpiCard} appearance="filled-alternative">
      <div className={s.head}>
        <Text className={s.label}>{label}</Text>
        {definition && (
          <Tooltip
            withArrow
            content={{ children: definition as React.ReactNode }}
            relationship="label"
          >
            <span aria-label="definition">
              <Info16Regular />
            </span>
          </Tooltip>
        )}
      </div>

      <div className={s.row}>
        <span className={s.value}>{value}</span>
        {delta && <DeltaBadge delta={delta} />}
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

      {caption && <Text className={s.caption}>{caption}</Text>}
    </Card>
  );
};