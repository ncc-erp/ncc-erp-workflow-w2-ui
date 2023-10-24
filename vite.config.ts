import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const defaultConfig = {
  plugins: [react(), tsconfigPaths()],
};

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const proxyRoutes = [
    '/api',
    '/CompOnly',
    '/_content',
    '/designer.config.json',
    '/v1',
  ];

  const proxyConfig = proxyRoutes.reduce((config, route) => {
    config[route] = {
      target: process.env.VITE_PROXY_SERVER_URL,
      changeOrigin: !route.startsWith('/v1'), // Change origin only for routes not starting with "/v1"
    };
    return config;
  }, {});

  return {
    ...defaultConfig,
    server: {
      proxy: process.env.VITE_PROXY_SERVER_URL ? proxyConfig : {},
    },
  };
});
