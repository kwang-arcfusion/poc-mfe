/* dev-only live reload for remotes */
if (process.env.NODE_ENV !== 'production') {
  type Remote = { name: string; url: string };

  const REMOTES: Remote[] = [
    { name: 'ask_ai', url: 'ws://localhost:3001/ws' },
    { name: 'home', url: 'ws://localhost:3002/ws' },
    { name: 'stories', url: 'ws://localhost:3003/ws' },
    { name: 'overview', url: 'ws://localhost:3004/ws' },
  ];

  const state: { timer: ReturnType<typeof setTimeout> | null } = { timer: null };

  const scheduleReload = (src: string) => {
    if (state.timer) return;
    state.timer = setTimeout(() => {
      console.log('[remote-live-reload] change from', src, '→ reloading host');
      window.location.reload();
      state.timer = null;
    }, 100); // debounce
  };

  REMOTES.forEach(({ name, url }) => {
    try {
      const ws = new WebSocket(url);
      let initialized = false; // ignore messages during initial connect/refresh
      let lastHash: string | null = null;

      ws.addEventListener('message', (ev: MessageEvent<string>) => {
        let msg: { type?: string; data?: string } | undefined;
        try {
          msg = JSON.parse(ev.data);
        } catch {
          return;
        }

        switch (msg?.type) {
          case 'hash':
            if (initialized && lastHash && msg.data && msg.data !== lastHash) {
              scheduleReload(name);
            }
            lastHash = msg.data ?? null;
            break;

          case 'ok':
          case 'still-ok':
            if (!initialized) initialized = true;
            break;

          case 'content-changed':
            if (initialized) scheduleReload(name);
            break;

          case 'warnings':
          case 'errors':
            // don't reload on warnings/errors; wait for next "ok"
            break;

          default:
            break;
        }
      });

      ws.addEventListener('error', () => {});
      ws.addEventListener('close', () => {});
    } catch {
      /* noop */
    }
  });
}

/** mark this file as a module so TS is happy */
export {};
