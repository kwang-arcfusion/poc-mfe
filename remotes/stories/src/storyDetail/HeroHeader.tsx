import * as React from 'react';
import { Card, Title1, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  hero: {
    ...shorthands.padding('18px'),
    ...shorthands.borderRadius('18px'),
    backgroundImage: `linear-gradient(180deg, ${tokens.colorNeutralBackground1}, ${tokens.colorNeutralBackground2})`,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    flexDirection: 'column',
    rowGap: '8px',
  },
  delta: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: '8px',
    ...shorthands.padding('8px', '12px'),
    ...shorthands.border('1px', 'solid', tokens.colorPaletteRedBorder2),
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
    fontWeight: tokens.fontWeightSemibold,
    width: 'fit-content',
  },
  meta: {
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '12px',
    rowGap: '6px',
    fontSize: tokens.fontSizeBase200,
  },
});

type Props = {
  title: string;
  deltaText: string;
  meta: string[];
};

export const HeroHeader: React.FC<Props> = ({ title, deltaText, meta }) => {
  const s = useStyles();
  return (
    <Card appearance="filled-alternative" className={s.hero}>
      <Title1 as="h1">{title}</Title1>
      <span className={s.delta}>▼ {deltaText}</span>
      <div className={s.meta}>
        {meta.map((m) => (
          <Text key={m}>{m}</Text>
        ))}
      </div>
    </Card>
  );
};
