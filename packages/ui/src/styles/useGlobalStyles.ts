// packages/ui/src/hooks/useGlobalStyles.ts
import { makeStaticStyles } from '@fluentui/react-components';

export const useGlobalStyles = makeStaticStyles({
  body: {
    margin: 0,
    padding: 0,
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  },
  // Add other global styles here in the future
});
