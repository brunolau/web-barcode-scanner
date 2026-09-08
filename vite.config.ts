import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve, dirname } from 'path';
import { readFileSync, existsSync } from 'fs';
import type { Plugin } from 'vite';

function emitZbarWasm(): Plugin {
    return {
        name: 'emit-zbar-wasm',
        enforce: 'pre',
        transform(code, id) {
            const cleanId = id.split('?')[0];
            if (!cleanId.includes('@undecaf/zbar-wasm') || !/\.m?js$/.test(cleanId)) {
                return null;
            }
            if (!code.includes('zbar.wasm')) {
                return null;
            }

            const wasmPath = resolve(dirname(cleanId), 'zbar.wasm');
            if (!existsSync(wasmPath)) {
                return null;
            }

            const referenceId = this.emitFile({
                type: 'asset',
                fileName: 'wbs-pf-zbar.wasm',
                source: readFileSync(wasmPath),
            });

            const rewritten = code.replace(
                /new URL\(\s*["']zbar\.wasm["']\s*,\s*import\.meta\.url\s*\)/g,
                `new URL(import.meta.ROLLUP_FILE_URL_${referenceId}, import.meta.url)`
            );

            return { code: rewritten, map: null };
        }
    };
}

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'WebBarcodeScanner',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
        },
        rollupOptions: {
            external: [],
            output: {
                assetFileNames: '[name][extname]'
            }
        }
    },
    plugins: [
        emitZbarWasm(),
        dts({
            include: ['src/**/*.ts'],
            exclude: ['src/scanners/**/*.ts'],
            insertTypesEntry: true
        })
    ]
});
