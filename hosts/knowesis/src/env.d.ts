// hosts/knowesis/src/env.d.ts
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
    AUTH0_DOMAIN: string;
    AUTH0_CLIENT_ID: string;
  };
};
