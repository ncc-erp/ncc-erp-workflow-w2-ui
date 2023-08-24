import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const defaultConfig = {
  plugins: [react(), tsconfigPaths()],
}

export default defineConfig(({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    return {
      ...defaultConfig,
      server: {
        proxy: process.env.USE_VITE_PROXY !== 'false'
          ? {
            '/api': {
              target: process.env.VITE_SERVER_URL,
              changeOrigin: true,
            }
          }
          : {}
      }
    }
  }
);
