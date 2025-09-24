import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from '@r2wc/react-to-web-component';

import { initApiClient } from '@arcfusion/client';
import AskAiComponent from './AskAi';
import { ChatSessionProvider } from '@arcfusion/store';
import { FluentProvider } from '@fluentui/react-components';
import { arcusionLightTheme } from '@arcfusion/ui';

const API_URL = 'https://chat-with-data-336404645436.asia-southeast1.run.app/api';
initApiClient(API_URL);

const AskAiWithProviders = ({ chatid }: any) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const fluentTheme = arcusionLightTheme;

  const handleNavigate = (path: string, options?: { replace?: boolean }) => {
    if (rootRef.current) {
      const event = new CustomEvent('navigate', {
        bubbles: true,
        composed: true,
        detail: { path, options },
      });
      rootRef.current.dispatchEvent(event);
    }
  };

  return (
    <div ref={rootRef} style={{ height: '100%' }}>
      <FluentProvider theme={fluentTheme} style={{ height: '100%' }}>
        <ChatSessionProvider>
          <AskAiComponent navigate={handleNavigate} chatId={chatid} />
        </ChatSessionProvider>
      </FluentProvider>
    </div>
  );
};

const AskAiWebComponent = reactToWebComponent(AskAiWithProviders, {
  props: {
    chatid: 'string',
  },
});

if (!customElements.get('ask-ai-component')) {
  customElements.define('ask-ai-component', AskAiWebComponent);
}
