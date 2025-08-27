// remotes/stories/src/storyDetail/ContextChips.tsx
import * as React from 'react';
import { Badge, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '8px',
    rowGap: '8px',
  },
});

type Props = { items: string[] };

export const ContextChips: React.FC<Props> = ({ items }) => {
  const s = useStyles();
  return (
    <div className={s.row} role="toolbar" aria-label="บริบทของเรื่องราว">
      {items.map((txt) => (
        <Badge key={txt} appearance="outline">
          {txt}
        </Badge>
      ))}
    </div>
  );
};
