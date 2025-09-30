import { copyFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Ensure example/js directory exists
mkdirSync('./example/js', { recursive: true });

// Copy the built file
copyFileSync('./dist/index.js', './example/js/index.js');

console.log('✓ Copied dist/index.js to example/js/index.js');