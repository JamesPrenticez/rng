/// <reference types='vitest' />
import { draco } from '@gltf-transform/functions';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import gltf from 'vite-plugin-gltf';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    root: __dirname,
    cacheDir: '../../../node_modules/.vite/apps/lobby/frontend',
    server: {
        port: 4200,
        host: 'localhost',
    },
    preview: {
        port: 5200,
        host: 'localhost',
    },
    plugins: [
        react(),
        nxViteTsPaths(),
        nxCopyAssetsPlugin(['*.md']),
        svgr(),
        gltf({ transform: [draco()] }),
    ],
    build: {
        outDir: '../../../dist/apps/lobby/frontend',
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
});
