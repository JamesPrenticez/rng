/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    root: __dirname,
    cacheDir: '../../../node_modules/.vite/apps/game-lobby/frontend',
    server: {
        port: 4200,
        host: '0.0.0.0',
        fs: {
          allow: [
            path.resolve(__dirname, '../../../libs/shared'),
          ],
        },
    },
    preview: {
        port: 5200,
        host: 'localhost',
    },
    plugins: [react(), nxViteTsPaths(), svgr()],
    build: {
        outDir: '../../../dist/apps/game-lobby/frontend',
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
});
