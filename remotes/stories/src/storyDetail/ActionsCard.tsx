// remotes/stories/src/storyDetail/ActionsCard.tsx
import * as React from 'react';
import { Text, Body1, Badge, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { CheckmarkCircle24Color } from '@fluentui/react-icons';
import type { Story } from '@arcfusion/types';

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
    backgroundColor: tokens.colorNeutralBackground2,
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
  sub: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

interface ActionsCardProps {
  story: Story;
}

export const ActionsCard: React.FC<ActionsCardProps> = ({ story }) => {
  const s = useStyles();

  if (!story.recommended_actions || story.recommended_actions.length === 0) {
    return null; // Don't render if there are no actions
  }

  return (
    <div className={s.card}>
      <div className={s.titleGroup}>
        <CheckmarkCircle24Color />
        <Text className={s.title}>Recommended Actions</Text>
      </div>

      <div className={s.stack}>
        {story.recommended_actions.map((action, index) => (
          <div key={index} className={s.item}>
            <span className={s.dot} />
            <div className={s.itemContent}>
              <Body1>
                <strong>{action.description}</strong>
              </Body1>
              <Badge
                appearance="tint"
                color={action.type === 'investigate' ? 'danger' : 'brand'}
                style={{ whiteSpace: 'nowrap', width: 'fit-content' }}
              >
                {action.type}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
