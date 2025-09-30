

import {
    WebBarcodeScannerOptions,
    ScannerError,
    CameraSwitchResult,
    FlashToggleResult,
    FocusDistanceResult,
    CameraInfo,
    IWebBarcodeDecoder,
    BarcodeFormat,
    BarcodeDetectorType,
    ExtendedMediaTrackCapabilities,
    ExtendedMediaTrackConstraintSet,
    ExtendedMediaTrackSettings
} from './data';
import { NativeBarcodeDecoder } from './scanners/native';
import { ZBarBarcodeDecoder } from './scanners/zbar';

// Re-export public types and enums
export {
    BarcodeFormat,
    BarcodeDetectorType,
    type WebBarcodeScannerOptions,
    type ScannerError,
    type CameraSwitchResult,
    type FlashToggleResult,
    type FocusDistanceResult,
    type CameraInfo,
    type DecodedBarcode
} from './data';

/**
 * Internal camera device information
 */
interface CameraDevice {
    device: MediaDeviceInfo;
    index: number;
}

/**
 * Advanced barcode scanner with tap-to-focus, camera selection, and flash control.
 * 
 * This class provides a complete barcode/QR code scanning solution with advanced
 * camera features including:
 * - Automatic camera selection (prioritizes back cameras with best focus capabilities)
 * - Tap-to-focus using contrast detection
 * - Manual focus distance control
 * - Flash/torch control
 * - Multiple camera switching
 * - iOS and Android support
 * - Multiple decoder backends (Native, ZBar)
 * 
 * @example
 * ```typescript
 * import { WebBarcodeScanner, BarcodeDetectorType, BarcodeFormat } from '@your-package/barcode-scanner';
 * 
 * const scanner = new WebBarcodeScanner({
 *   container: document.getElementById('scanner-container')!,
 *   debug: true,
 *   detectorType: BarcodeDetectorType.AUTO,
 *   formats: [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13],
 *   onCodeScanned: (code, format) => {
 *     console.log('Scanned:', code, 'Format:', format);
 *   },
 *   onError: (error) => {
 *     console.error('Error:', error.type, error.message);
 *   }
 * });
 * 
 * await scanner.init();
 * ```
 */
export class WebBarcodeScanner {
    // Configuration
    private readonly container: HTMLElement;
    private readonly onCodeScanned: (code: string, format: string) => void;
    private readonly onError: (error: ScannerError) => void;
    private readonly debug: boolean;
    private readonly detectorType: BarcodeDetectorType;
    private readonly formats: BarcodeFormat[];

    // DOM Elements
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    // Media Stream
    private stream: MediaStream | null = null;
    private track: MediaStreamTrack | null = null;

    // Barcode Decoder
    private decoder: IWebBarcodeDecoder | null = null;

    // State
    private scanning: boolean = false;
    private focusing: boolean = false;
    private manualFocusMode: boolean = false;
    private decoding: boolean = false;
    private lastDecodeTime: number = 0;
    private minDecodeInterval: number = 100;

    // Focus UI Elements
    private focusElements: HTMLElement[] = [];

    // Camera Management
    private availableCameras: MediaDeviceInfo[] = [];
    private currentCameraIndex: number = 0;
    private focusDistanceCapability: ExtendedMediaTrackCapabilities['focusDistance'] | null = null;

    constructor(options: WebBarcodeScannerOptions) {
        this.container = options.container;
        this.onCodeScanned = options.onCodeScanned || (() => { });
        this.onError = options.onError || (() => { });
        this.debug = options.debug || false;
        this.detectorType = options.detectorType || BarcodeDetectorType.AUTO;
        this.formats = options.formats || Object.values(BarcodeFormat);

        if (!this.container) {
            throw new Error('Container element is required');
        }

        this.video = document.createElement('video');
        this.video.className = 'barcode-scanner-video';
        this.video.setAttribute('playsinline', '');
        this.video.setAttribute('autoplay', '');

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'barcode-scanner-canvas';

        this.container.appendChild(this.video);
        this.container.appendChild(this.canvas);

        const context = this.canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
            throw new Error('Failed to get 2D context from canvas');
        }
        this.ctx = context;
    }

    private log(...args: any[]): void {
        if (this.debug) {
            console.log('[WebBarcodeScanner]', ...args);
        }
    }

    private warn(...args: any[]): void {
        if (this.debug) {
            console.warn('[WebBarcodeScanner]', ...args);
        }
    }

    private error(...args: any[]): void {
        if (this.debug) {
            console.error('[WebBarcodeScanner]', ...args);
        }
    }

    private async initializeDecoder(): Promise<void> {
        let detectorToUse = this.detectorType;

        if (detectorToUse === BarcodeDetectorType.AUTO) {
            if (typeof (window as any).BarcodeDetector !== 'undefined') {
                detectorToUse = BarcodeDetectorType.NATIVE;
                this.log('Auto-selected Native BarcodeDetector');
            } else {
                detectorToUse = BarcodeDetectorType.ZBAR;
                this.log('Auto-selected ZBar decoder (Native not available)');
            }
        }

        try {
            if (detectorToUse === 'native') {
                this.decoder = new NativeBarcodeDecoder(this.formats);
                this.log('Initialized Native BarcodeDetector');
            } else if (detectorToUse === 'zbar') {
                this.decoder = new ZBarBarcodeDecoder(this.formats);
                this.log('Initialized ZBar decoder');
            } else {
                throw new Error(`Unknown detector type: ${detectorToUse}`);
            }
        } catch (err) {
            const error = err as Error;
            this.error('Failed to initialize decoder:', error);
            this.onError({ type: 'decoder', message: error.message, error });
            throw error;
        }
    }

    public async init(): Promise<void> {
        try {
            await this.initializeDecoder();
            await this.setupCamera();
            this.setupEventListeners();
            this.startScanning();
        } catch (err) {
            const error = err as Error;
            this.error('Init error:', error);
            this.onError({ type: 'init', message: error.message, error });
            throw error;
        }
    }

    private async setupCamera(): Promise<void> {
        let permissionStream: MediaStream | null = null;
        try {
            permissionStream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.log('Camera permission granted');
        } catch (err) {
            const error = err as Error;
            this.error('Camera permission denied:', error);
            throw new Error('Camera permission denied');
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        this.availableCameras = devices.filter(d => d.kind === 'videoinput');

        this.log('Available cameras:', this.availableCameras.map((d, i) => `[${i}] ${d.label}`));

        if (permissionStream) {
            permissionStream.getTracks().forEach(track => track.stop());
        }

        if (this.currentCameraIndex === 0) {
            await this.selectBestCamera();
        }

        const selectedDevice = this.availableCameras[this.currentCameraIndex];
        this.log(`Using camera [${this.currentCameraIndex}]:`, selectedDevice?.label);

        const constraints: MediaStreamConstraints = {
            video: {
                deviceId: selectedDevice ? { exact: selectedDevice.deviceId } : undefined,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.video.srcObject = this.stream;
        this.track = this.stream.getVideoTracks()[0];

        await new Promise<void>(resolve => {
            this.video.onloadedmetadata = () => resolve();
        });

        await this.setupContinuousFocus();
    }

    private async selectBestCamera(): Promise<void> {
        const backCameras: CameraDevice[] = this.availableCameras
            .map((d, index) => ({ device: d, index }))
            .filter(({ device }) =>
                device.label.toLowerCase().includes('back') ||
                device.label.toLowerCase().includes('rear') ||
                device.label.toLowerCase().includes('environment')
            );

        this.log('Found back cameras:', backCameras.map(c => `[${c.index}] ${c.device.label}`));

        if (backCameras.length === 0) {
            if (this.availableCameras.length > 0) {
                this.currentCameraIndex = this.availableCameras.length - 1;
                this.log('No back camera found, using last camera');
            }
            return;
        }

        let bestCamera: number | null = null;
        let bestFocusRange = 0;

        for (const { device, index } of backCameras) {
            try {
                const testStream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: device.deviceId } }
                });

                const testTrack = testStream.getVideoTracks()[0];
                const capabilities = testTrack.getCapabilities() as ExtendedMediaTrackCapabilities;

                testTrack.stop();
                testStream.getTracks().forEach(track => track.stop());

                const minDist = capabilities.focusDistance?.min ?? null;
                const maxDist = capabilities.focusDistance?.max ?? null;

                const focusRange = (minDist !== null && maxDist !== null)
                    ? maxDist - minDist
                    : 0;

                this.log(`Camera [${index}] "${device.label}" focus range:`, focusRange);

                if (focusRange > bestFocusRange) {
                    bestFocusRange = focusRange;
                    bestCamera = index;
                }
            } catch (err) {
                this.warn(`Could not test camera [${index}]:`, err);
            }
        }

        if (bestFocusRange === 0) {
            this.log('No camera with focus distance support found, trying iOS camera selection');

            const ultraWideCamera = backCameras.find(({ device }) =>
                device.label.toLowerCase().includes('ultra wide') ||
                device.label.toLowerCase().includes('ultrawide')
            );

            if (ultraWideCamera) {
                bestCamera = ultraWideCamera.index;
                this.log(`Selected Ultra Wide camera [${bestCamera}]`);
            } else {
                const wideCamera = backCameras.find(({ device }) =>
                    device.label.toLowerCase().includes('wide')
                );

                if (wideCamera) {
                    bestCamera = wideCamera.index;
                    this.log(`Selected Wide camera [${bestCamera}]`);
                } else {
                    bestCamera = backCameras[0].index;
                    this.log(`Selected first back camera [${bestCamera}]`);
                }
            }
        } else {
            this.log(`Auto-selected camera [${bestCamera}] with best focus range: ${bestFocusRange.toFixed(2)}`);
        }

        if (bestCamera !== null) {
            this.currentCameraIndex = bestCamera;
        }
    }

    private async setupContinuousFocus(): Promise<void> {
        if (!this.track) return;

        const capabilities = this.track.getCapabilities() as ExtendedMediaTrackCapabilities;
        this.log('Camera capabilities:', capabilities);

        const hasFocusMode = capabilities.focusMode && capabilities.focusMode.length > 0;
        const minDist = capabilities.focusDistance?.min ?? null;
        const maxDist = capabilities.focusDistance?.max ?? null;
        const hasFocusDistance = minDist !== null && maxDist !== null;

        this.log('Focus Mode support:', hasFocusMode ? capabilities.focusMode : 'None');
        this.log('Focus Distance support:', hasFocusDistance ? { min: minDist, max: maxDist } : 'None');

        this.focusDistanceCapability = hasFocusDistance ? capabilities.focusDistance : null;

        try {
            if (hasFocusMode && capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
                await this.track.applyConstraints({
                    advanced: [{ focusMode: 'continuous' } as ExtendedMediaTrackConstraintSet]
                });
                this.log('Continuous focus enabled');
            }

            if (hasFocusDistance && minDist !== null) {
                await this.track.applyConstraints({
                    advanced: [{ focusDistance: minDist } as ExtendedMediaTrackConstraintSet]
                });
                this.log('Focus distance set to minimum for close range');
            }
        } catch (err) {
            this.warn('Could not set continuous focus:', err);
        }

        this.log('Current settings:', this.track.getSettings());
    }

    private setupEventListeners(): void {
        this.container.addEventListener('click', (e) => this.handleTapToFocus(e));
    }

    private createFocusIndicator(x: number, y: number): void {
        this.clearFocusIndicators();

        const focusOuter = document.createElement('div');
        focusOuter.className = 'focus-outer active';
        focusOuter.style.left = x + 'px';
        focusOuter.style.top = y + 'px';
        this.container.appendChild(focusOuter);
        this.focusElements.push(focusOuter);

        const focusSquare = document.createElement('div');
        focusSquare.className = 'focus-square active';
        focusSquare.style.left = x + 'px';
        focusSquare.style.top = y + 'px';

        const cornerBL = document.createElement('div');
        cornerBL.className = 'focus-corner-bl';
        focusSquare.appendChild(cornerBL);

        const cornerBR = document.createElement('div');
        cornerBR.className = 'focus-corner-br';
        focusSquare.appendChild(cornerBR);

        this.container.appendChild(focusSquare);
        this.focusElements.push(focusSquare);

        setTimeout(() => {
            this.clearFocusIndicators();
        }, 2000);
    }

    private clearFocusIndicators(): void {
        this.focusElements.forEach(el => el.remove());
        this.focusElements = [];
    }

    private async handleTapToFocus(e: MouseEvent): Promise<void> {
        if (this.focusing) {
            this.log('Already focusing, skipping...');
            return;
        }

        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.log('Tap at:', x, y);

        this.createFocusIndicator(x, y);

        this.focusing = true;

        await this.searchBestFocus(x, y, rect);

        this.focusing = false;
    }

    private async searchBestFocus(tapX: number, tapY: number, videoRect: DOMRect): Promise<void> {
        if (!this.track) return;

        const capabilities = this.track.getCapabilities() as ExtendedMediaTrackCapabilities;

        const minDist = capabilities.focusDistance?.min ?? null;
        const maxDist = capabilities.focusDistance?.max ?? null;

        if (minDist === null || maxDist === null) {
            this.warn('Focus distance not supported, trying fallback');
            await this.fallbackFocus();
            return;
        }

        try {
            const step = capabilities.focusDistance?.step ?? (maxDist - minDist) / 15;

            this.log('Focus range:', minDist, 'to', maxDist, 'step:', step);

            const focusAreaSize = 100;

            this.canvas.width = focusAreaSize;
            this.canvas.height = focusAreaSize;

            let bestFocus = minDist;
            let bestContrast = 0;

            const testDistances: number[] = [];
            for (let d = minDist; d <= maxDist; d += step * 2) {
                testDistances.push(d);
            }

            this.log('Testing', testDistances.length, 'focus distances');

            for (const distance of testDistances) {
                try {
                    await this.track.applyConstraints({
                        advanced: [{
                            focusMode: 'manual',
                            focusDistance: distance
                        } as ExtendedMediaTrackConstraintSet]
                    });

                    this.manualFocusMode = true;

                    await new Promise(resolve => setTimeout(resolve, 120));

                    const contrast = this.calculateContrast(tapX, tapY, videoRect, focusAreaSize);

                    this.log('Distance:', distance.toFixed(2), 'Contrast:', contrast.toFixed(2));

                    if (contrast > bestContrast) {
                        bestContrast = contrast;
                        bestFocus = distance;
                    }
                } catch (err) {
                    this.warn('Focus adjustment failed at distance', distance, err);
                }
            }

            this.log('Best focus found:', bestFocus, 'with contrast:', bestContrast);

            await this.track.applyConstraints({
                advanced: [{
                    focusMode: 'manual',
                    focusDistance: bestFocus
                } as ExtendedMediaTrackConstraintSet]
            });

            setTimeout(async () => {
                if (this.track && capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
                    try {
                        await this.track.applyConstraints({
                            advanced: [{ focusMode: 'continuous' } as ExtendedMediaTrackConstraintSet]
                        });
                        this.manualFocusMode = false;
                        this.log('Returned to continuous focus');
                    } catch (err) {
                        this.warn('Could not return to continuous:', err);
                    }
                }
            }, 2500);
        } catch (err) {
            const error = err as Error;
            this.error('Search best focus error:', error);
            this.onError({ type: 'focus', message: 'Focus failed', error });
        }
    }

    private calculateContrast(centerX: number, centerY: number, videoRect: DOMRect, areaSize: number): number {
        const scaleX = this.video.videoWidth / videoRect.width;
        const scaleY = this.video.videoHeight / videoRect.height;

        const sx = Math.max(0, (centerX - areaSize / 2) * scaleX);
        const sy = Math.max(0, (centerY - areaSize / 2) * scaleY);

        const sw = Math.min(areaSize * scaleX, this.video.videoWidth - sx);
        const sh = Math.min(areaSize * scaleY, this.video.videoHeight - sy);

        this.ctx.drawImage(
            this.video,
            sx, sy, sw, sh,
            0, 0, areaSize, areaSize
        );

        const imageData = this.ctx.getImageData(0, 0, areaSize, areaSize);
        const data = imageData.data;

        let sum = 0;
        let sumSq = 0;
        const pixelCount = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
            const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
            sum += gray;
            sumSq += gray * gray;
        }

        const mean = sum / pixelCount;
        const variance = (sumSq / pixelCount) - (mean * mean);
        const stdDev = Math.sqrt(Math.max(0, variance));

        return stdDev;
    }

    private async fallbackFocus(): Promise<void> {
        if (!this.track) return;

        const capabilities = this.track.getCapabilities() as ExtendedMediaTrackCapabilities;

        try {
            if (capabilities.focusMode && capabilities.focusMode.includes('single-shot')) {
                await this.track.applyConstraints({
                    advanced: [{ focusMode: 'single-shot' } as ExtendedMediaTrackConstraintSet]
                });

                this.log('Single-shot focus triggered');

                setTimeout(async () => {
                    if (this.track && capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
                        await this.track.applyConstraints({
                            advanced: [{ focusMode: 'continuous' } as ExtendedMediaTrackConstraintSet]
                        });
                    }
                }, 1500);
            }
        } catch (err) {
            this.warn('Fallback focus failed:', err);
        }
    }

    public async switchCamera(): Promise<CameraSwitchResult> {
        if (this.availableCameras.length <= 1) {
            this.log('Only one camera available');
            return { success: false, message: 'Only one camera available' };
        }

        if (this.track) {
            this.track.stop();
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        this.manualFocusMode = false;
        this.currentCameraIndex = (this.currentCameraIndex + 1) % this.availableCameras.length;

        try {
            await this.setupCamera();
            return {
                success: true,
                cameraIndex: this.currentCameraIndex,
                totalCameras: this.availableCameras.length,
                cameraLabel: this.availableCameras[this.currentCameraIndex]?.label
            };
        } catch (err) {
            const error = err as Error;
            this.error('Camera switch error:', error);
            this.onError({ type: 'camera_switch', message: 'Camera switch failed', error });
            return { success: false, message: 'Camera switch failed' };
        }
    }

    public async toggleFlash(): Promise<FlashToggleResult> {
        if (!this.track) {
            return { success: false, message: 'Camera not initialized' };
        }

        try {
            const capabilities = this.track.getCapabilities() as ExtendedMediaTrackCapabilities;

            if (capabilities.torch) {
                const currentSettings = this.track.getSettings() as ExtendedMediaTrackSettings;
                const currentFlashState = currentSettings.torch || false;
                const newFlashState = !currentFlashState;

                await this.track.applyConstraints({
                    advanced: [{ torch: newFlashState } as ExtendedMediaTrackConstraintSet]
                });

                this.log('Flash toggled:', newFlashState);
                return { success: true, enabled: newFlashState };
            } else {
                return { success: false, message: 'Flash not supported' };
            }
        } catch (err) {
            const error = err as Error;
            this.error('Flash toggle error:', error);
            this.onError({ type: 'flash', message: 'Flash toggle failed', error });
            return { success: false, message: 'Flash error' };
        }
    }

    public getCameraInfo(): CameraInfo {
        const capabilities = this.track?.getCapabilities() as ExtendedMediaTrackCapabilities | undefined;
        const minDist = capabilities?.focusDistance?.min ?? null;
        const maxDist = capabilities?.focusDistance?.max ?? null;
        const hasFocusDistance = minDist !== null && maxDist !== null;

        return {
            cameraLabel: this.availableCameras[this.currentCameraIndex]?.label || 'Unknown',
            cameraIndex: this.currentCameraIndex,
            totalCameras: this.availableCameras.length,
            hasFocusDistance,
            focusDistanceRange: hasFocusDistance ? { min: minDist, max: maxDist } : null,
            capabilities
        };
    }

    public async setFocusDistance(distance: number): Promise<FocusDistanceResult> {
        if (!this.focusDistanceCapability) {
            return { success: false, message: 'Focus distance not supported' };
        }

        if (!this.track) {
            return { success: false, message: 'Camera not initialized' };
        }

        try {
            const capabilities = this.track.getCapabilities() as ExtendedMediaTrackCapabilities;

            if (!this.manualFocusMode) {
                if (capabilities.focusMode && capabilities.focusMode.includes('manual')) {
                    await this.track.applyConstraints({
                        advanced: [{ focusMode: 'manual' } as ExtendedMediaTrackConstraintSet]
                    });
                    this.manualFocusMode = true;
                    this.log('Switched to manual focus mode');
                }
            }

            await this.track.applyConstraints({
                advanced: [{ focusDistance: distance } as ExtendedMediaTrackConstraintSet]
            });

            this.log('Focus distance set to:', distance);
            return { success: true, distance };
        } catch (err) {
            this.warn('Could not adjust focus distance:', err);
            return { success: false, message: 'Failed to set focus distance' };
        }
    }

    public startScanning(): void {
        this.scanning = true;
        this.scan();
    }

    private scan(): void {
        if (!this.scanning) return;

        requestAnimationFrame(async () => {
            const now = Date.now();
            const timeSinceLastDecode = now - this.lastDecodeTime;

            if (timeSinceLastDecode < this.minDecodeInterval) {
                this.scan();
                return;
            }

            if (this.decoding) {
                this.scan();
                return;
            }

            this.decoding = true;
            this.lastDecodeTime = now;

            try {
                if (this.decoder && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
                    const barcodes = await this.decoder.decode(this.video);

                    if (barcodes.length > 0) {
                        const barcode = barcodes[0];
                        this.log('Barcode scanned:', barcode.rawValue, 'Format:', barcode.format);
                        this.onCodeScanned(barcode.rawValue, barcode.format);

                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            } catch (err) {
                const error = err as Error;
                this.warn('Scan error:', error);
            } finally {
                this.decoding = false;
            }

            this.scan();
        });
    }

    public stop(): void {
        this.log('Stopping scanner...');
        this.scanning = false;

        this.clearFocusIndicators();

        if (this.decoder) {
            this.decoder.destroy();
            this.decoder = null;
        }

        if (this.track) {
            this.track.stop();
        }

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        if (this.video.srcObject) {
            this.video.srcObject = null;
        }

        this.stream = null;
        this.track = null;

        this.log('Scanner stopped');
    }

    public isScanning(): boolean {
        return this.scanning;
    }

    public isFocusing(): boolean {
        return this.focusing;
    }

    public getVideoElement(): HTMLVideoElement {
        return this.video;
    }

    public getCanvasElement(): HTMLCanvasElement {
        return this.canvas;
    }

    public getStream(): MediaStream | null {
        return this.stream;
    }

    public getTrack(): MediaStreamTrack | null {
        return this.track;
    }

    public getDecoderType(): string {
        if (!this.decoder) return 'none';
        if (this.decoder instanceof NativeBarcodeDecoder) return 'native';
        if (this.decoder instanceof ZBarBarcodeDecoder) return 'zbar';
        return 'unknown';
    }

    public getSupportedFormats(): BarcodeFormat[] {
        return [...this.formats];
    }
}