# Web barcode scanner

**Web barcode scanner** is a browser-based library that aims to help overcome common pitfalls with html5-based barcode scanning.
This mostly involves the focus and default camera selection as well as some other hacks like starting zoomed as the focusing capabilities in browser are often limited.
Library implements smart camera autoselection to pick the most suitable device (commonly the rear camera optimized for scanning). 

Decoding relies on:

- Native [BarcodeDetector API](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector) where available.  
- Automatic fallback to [`@undecaf/zbar-wasm`](https://www.npmjs.com/package/@undecaf/zbar-wasm) for browsers that lack native support.  

---

## Features

✅ Automatically selects the most suitable camera (rear-facing preferred)  
✅ Overcomes focus and zoom pitfalls and modern Android and ios devices  
✅ Wraps the initialization logic into simple class

---

## Installation

Install the package from npm:

```bash
npm install web-barcode-scanner
```

or with yarn:

```bash
yarn add web-barcode-scanner
```

---

## Usage Example

Here’s a minimal example showing how to integrate **WebBarcodeScanner**:

```typescript
import { WebBarcodeScanner } from "web-barcode-scanner";

function startScanner() {
  // Create scanner instance
  const container = document.getElementById('videoContainer');
  const scanner = new WebBarcodeScanner({
    container: container,
    debug: true,
    detectorType: 'auto',
    formats: [
        'qr_code',
        'ean_13',
        'ean_8',
        'code_128',
        'code_39'
    ],
    onCodeScanned: (code, format) => {
        console.log('Code scanned:', code, 'Format:', format);
    },
    onError: (error) => {
        console.error('Scanner error:', error.type, error.message);
    },
    onLoadingStart: () => {
        console.log('Initialization started')
    },
    onLoadingEnd: () => {
        console.log('Initialization end')
    }
  });
}

startScanner();
```

And the HTML:

```html
<div id="videoContainer"></div>
```

---


## License

MIT
