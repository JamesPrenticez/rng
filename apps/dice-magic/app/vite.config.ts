/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/apps/dice-magic/app',
  server: {
    port: 4202,
    host: 'localhost',
    fs: {
      allow: [
        path.resolve(__dirname, '../../../libs/shared'),
      ],
    },
  },
  preview: {
    port: 4302,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  assetsInclude: ['**/*.gltf'],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../../dist/apps/dice-magic/app',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
