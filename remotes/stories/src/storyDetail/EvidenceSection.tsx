// remotes/stories/src/storyDetail/EvidenceSection.tsx
import * as React from 'react';
import { Text, makeStyles, tokens } from '@fluentui/react-components';
import { DataPie24Color } from '@fluentui/react-icons';
import type { Story } from '@arcfusion/types';
import { EChartRenderer } from './EChartRenderer';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    '@media (min-width: 900px)': { gridTemplateColumns: '1fr' },
  },
  titleWrap: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' },

  title: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    fontSize: '18px',
  },
});

interface EvidenceSectionProps {
    story: Story;
}

export const EvidenceSection: React.FC<EvidenceSectionProps> = ({ story }) => {
  const s = useStyles();
  return (
    <section>
      <div className={s.titleWrap}>
        <DataPie24Color />
        <Text className={s.title}>Evidence</Text>
      </div>

      <div className={s.grid}>
        <EChartRenderer config={story.echart_config} />
        {/* Placeholder for other evidence components like Breakdown Tables in the future */}
      </div>
    </section>
  );
};