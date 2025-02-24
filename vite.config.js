import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                content: path.resolve(__dirname, 'src/content.ts'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        }
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'public/manifest.json',
                    dest: './'
                },
                {
                    src: 'public/images/*',
                    dest: './images/'
                },
                {
                    src: 'public/styles.css',
                    dest: './'
                }
            ]
        })
    ]
});