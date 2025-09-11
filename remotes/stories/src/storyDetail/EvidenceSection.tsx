// remotes/stories/src/storyDetail/EvidenceSection.tsx
import * as React from 'react';
import { useMemo } from 'react';
import { Text, makeStyles, tokens } from '@fluentui/react-components';
import { DataPie24Color } from '@fluentui/react-icons';
import type { Story } from '@arcfusion/types';
import { EChartRenderer } from './EChartRenderer';

const useStyles = makeStyles({
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
  const chartOptions = useMemo(() => {
    if (!story.echart_config) return null;

    const newConfig = JSON.parse(JSON.stringify(story.echart_config));

    return {
      ...newConfig,
      title: {
        ...newConfig.title,
        show: false,
      },
      legend: {
        ...newConfig.legend,
        show: false,
      },
      grid: {
        ...newConfig.grid,
        left: '50px',
        right: '20px',
        top: '30px',
        bottom: '30px',
      },
      yAxis: {
        ...newConfig.yAxis,
        nameTextStyle: {
          align: 'left',
        },
      },
      series: (newConfig.series || []).map((s: any) => ({
        ...s,
        barWidth: '40%',
      })),
    };
  }, [story.echart_config]);

  return (
    <section>
      <EChartRenderer config={chartOptions} />{' '}
    </section>
  );
};
