import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    build: {
        assetsInlineLimit: file => 0 as any,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'WebBarcodeScanner',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
        },
        rollupOptions: {
            // No externals - bundle everything for browser use
            external: []
        }
    },
    plugins: [
        dts({
            include: ['src/**/*.ts'],
            exclude: ['src/scanners/**/*.ts'], // Exclude internal scanners from .d.ts
            insertTypesEntry: true
        })
    ]
});