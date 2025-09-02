// remotes/stories/src/storyDetail/WrapupKpis.tsx
import * as React from 'react';
import { makeStyles, Text, tokens } from '@fluentui/react-components';
import { DataLine24Color } from '@fluentui/react-icons';
import type { Story } from '@arcfusion/types';
import { KpiCard } from './KpiCard';
import { transformStoryToKpis } from './utils';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '14px',
    '@media (min-width: 760px)': { gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' },
  },
  titleWrap: { display: 'flex', alignItems: 'center', gap: '6px' },

  title: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    fontSize: '18px',
  },
});

interface WrapupKpisProps {
    story: Story;
}

export const WrapupKpis: React.FC<WrapupKpisProps> = ({ story }) => {
  const s = useStyles();
  const kpis = transformStoryToKpis(story);

  return (
    <>
      <div className={s.titleWrap}>
        <DataLine24Color />
        <Text className={s.title}>Wrapup KPIs</Text>
      </div>
      <section className={s.grid} aria-label="Wrap-up KPIs">
        {kpis.map((kpiProps, index) => (
            <KpiCard key={index} {...kpiProps} />
        ))}
      </section>
    </>
  );
};