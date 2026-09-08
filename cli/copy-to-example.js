import { copyFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Ensure example/js directory exists
mkdirSync('./example/js', { recursive: true });

copyFileSync('./dist/index.js', './example/js/index.js');
copyFileSync('./dist/wbs-pf-zbar.wasm', './example/js/wbs-pf-zbar.wasm');

console.log('✓ Copied dist/index.js to example/js/index.js');
console.log('✓ Copied dist/wbs-pf-zbar.wasm to example/js/wbs-pf-zbar.wasm');