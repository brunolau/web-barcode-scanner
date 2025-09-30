import { scanImageData } from '@undecaf/zbar-wasm';

/**
 * Extended MediaTrackCapabilities with experimental camera features
 * These features are available in Chrome/Android but may not be in all browsers
 */
interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
    focusDistance?: {
        max: number;
        min: number;
        step?: number;
    };
    focusMode?: string[];
    torch?: boolean;
}

/**
 * Extended MediaTrackConstraintSet for advanced camera controls
 */
interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
    focusDistance?: number;
    focusMode?: string;
    torch?: boolean;
}

/**
 * Extended MediaTrackSettings with experimental features
 */
interface ExtendedMediaTrackSettings extends MediaTrackSettings {
    focusDistance?: number;
    focusMode?: string;
    torch?: boolean;
}

/**
 * Supported barcode formats
 */
export enum BarcodeFormat {
    // 1D Formats
    CODE_128 = 'code_128',
    CODE_39 = 'code_39',
    CODE_93 = 'code_93',
    CODABAR = 'codabar',
    EAN_8 = 'ean_8',
    EAN_13 = 'ean_13',
    ITF = 'itf',
    UPC_A = 'upc_a',
    UPC_E = 'upc_e',

    // 2D Formats
    QR_CODE = 'qr_code',
    DATA_MATRIX = 'data_matrix',
    AZTEC = 'aztec',
    PDF417 = 'pdf417'
}

/**
 * Barcode detector implementation type
 */
export enum BarcodeDetectorType {
    /** Automatically select best available detector */
    AUTO = 'auto',
    /** Use native browser BarcodeDetector API */
    NATIVE = 'native',
    /** Use ZBar WASM library */
    ZBAR = 'zbar'
}

/**
 * Decoded barcode result
 */
export interface DecodedBarcode {
    /** The decoded text/data */
    rawValue: string;
    /** The barcode format */
    format: string;
    /** Optional bounding box */
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

/**
 * Interface for barcode decoder implementations
 */
export interface IWebBarcodeDecoder {
    /**
     * Decodes barcodes from a video element
     * @param video - The video element to decode from
     * @returns Array of decoded barcodes
     */
    decode(video: HTMLVideoElement): Promise<DecodedBarcode[]>;

    /**
     * Cleanup resources
     */
    destroy(): void;
}

/**
 * Configuration options for BarcodeScanner initialization
 */
export interface BarcodeScannerOptions {
    /** The container element where the scanner will be mounted */
    container: HTMLElement;

    /** Callback function invoked when a barcode/QR code is successfully scanned */
    onCodeScanned?: (code: string, format: string) => void;

    /** Callback function invoked when an error occurs */
    onError?: (error: ScannerError) => void;

    /** Enable debug logging to console (default: false) */
    debug?: boolean;

    /** Barcode detector type to use (default: AUTO) */
    detectorType?: BarcodeDetectorType;

    /** Supported barcode formats (default: all formats) */
    formats?: BarcodeFormat[];
}

/**
 * Error information returned by the scanner
 */
export interface ScannerError {
    /** Type of error that occurred */
    type: 'init' | 'focus' | 'camera_switch' | 'flash' | 'scan' | 'decoder';

    /** Human-readable error message */
    message: string;

    /** Original error object if available */
    error?: Error;
}

/**
 * Result of camera switch operation
 */
export interface CameraSwitchResult {
    /** Whether the camera switch was successful */
    success: boolean;

    /** Index of the currently selected camera */
    cameraIndex?: number;

    /** Total number of available cameras */
    totalCameras?: number;

    /** Label/name of the currently selected camera */
    cameraLabel?: string;

    /** Error message if switch failed */
    message?: string;
}

/**
 * Result of flash toggle operation
 */
export interface FlashToggleResult {
    /** Whether the flash toggle was successful */
    success: boolean;

    /** Current state of the flash (true = on, false = off) */
    enabled?: boolean;

    /** Error message if toggle failed */
    message?: string;
}

/**
 * Result of focus distance adjustment
 */
export interface FocusDistanceResult {
    /** Whether the focus distance was successfully set */
    success: boolean;

    /** The focus distance that was set */
    distance?: number;

    /** Error message if adjustment failed */
    message?: string;
}

/**
 * Information about the current camera
 */
export interface CameraInfo {
    /** Label/name of the current camera */
    cameraLabel: string;

    /** Index of the current camera */
    cameraIndex: number;

    /** Total number of available cameras */
    totalCameras: number;

    /** Whether the camera supports manual focus distance control */
    hasFocusDistance: boolean;

    /** Focus distance range if supported */
    focusDistanceRange: { min: number; max: number } | null;

    /** Full camera capabilities object */
    capabilities: ExtendedMediaTrackCapabilities | undefined;
}

/**
 * Internal camera device information
 */
interface CameraDevice {
    device: MediaDeviceInfo;
    index: number;
}

/**
 * Native BarcodeDetector implementation
 */
class NativeBarcodeDecoder implements IWebBarcodeDecoder {
    private detector: any; // BarcodeDetector
    private formats: BarcodeFormat[];

    constructor(formats: BarcodeFormat[]) {
        this.formats = formats;

        // Check if native BarcodeDetector is available
        if (typeof (window as any).BarcodeDetector === 'undefined') {
            throw new Error('Native BarcodeDetector is not supported in this browser');
        }

        // Map our formats to native format names
        const nativeFormats = this.mapToNativeFormats(formats);
        this.detector = new (window as any).BarcodeDetector({ formats: nativeFormats });
    }

    private mapToNativeFormats(formats: BarcodeFormat[]): string[] {
        const mapping: { [key in BarcodeFormat]: string } = {
            [BarcodeFormat.CODE_128]: 'code_128',
            [BarcodeFormat.CODE_39]: 'code_39',
            [BarcodeFormat.CODE_93]: 'code_93',
            [BarcodeFormat.CODABAR]: 'codabar',
            [BarcodeFormat.EAN_8]: 'ean_8',
            [BarcodeFormat.EAN_13]: 'ean_13',
            [BarcodeFormat.ITF]: 'itf',
            [BarcodeFormat.UPC_A]: 'upc_a',
            [BarcodeFormat.UPC_E]: 'upc_e',
            [BarcodeFormat.QR_CODE]: 'qr_code',
            [BarcodeFormat.DATA_MATRIX]: 'data_matrix',
            [BarcodeFormat.AZTEC]: 'aztec',
            [BarcodeFormat.PDF417]: 'pdf417'
        };

        return formats.map(f => mapping[f]);
    }

    async decode(video: HTMLVideoElement): Promise<DecodedBarcode[]> {
        try {
            const barcodes = await this.detector.detect(video);
            return barcodes.map((barcode: any) => ({
                rawValue: barcode.rawValue,
                format: barcode.format,
                boundingBox: barcode.boundingBox ? {
                    x: barcode.boundingBox.x,
                    y: barcode.boundingBox.y,
                    width: barcode.boundingBox.width,
                    height: barcode.boundingBox.height
                } : undefined
            }));
        } catch (error) {
            return [];
        }
    }

    destroy(): void {
        // Native detector doesn't need cleanup
    }
}

/**
 * ZBar WASM implementation using @undecaf/zbar-wasm
 */
class ZBarBarcodeDecoder implements IWebBarcodeDecoder {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private formats: BarcodeFormat[];

    constructor(formats: BarcodeFormat[]) {
        this.formats = formats;
        this.canvas = document.createElement('canvas');
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D context for ZBar decoder');
        }
        this.ctx = context;
    }

    async decode(video: HTMLVideoElement): Promise<DecodedBarcode[]> {
        try {
            // Capture frame from video
            this.canvas.width = video.videoWidth;
            this.canvas.height = video.videoHeight;
            this.ctx.drawImage(video, 0, 0);

            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

            // Scan the image using the imported scanImageData function
            const results = await scanImageData(imageData);

            if (!results || results.length === 0) {
                return [];
            }

            // Filter by supported formats and map results
            return results
                .filter((result: any) => this.isFormatSupported(result.typeName))
                .map((result: any) => ({
                    rawValue: result.decode(),
                    format: this.mapZBarFormat(result.typeName),
                    boundingBox: result.points && result.points.length >= 2 ? {
                        x: Math.min(...result.points.map((p: any) => p.x)),
                        y: Math.min(...result.points.map((p: any) => p.y)),
                        width: Math.max(...result.points.map((p: any) => p.x)) - Math.min(...result.points.map((p: any) => p.x)),
                        height: Math.max(...result.points.map((p: any) => p.y)) - Math.min(...result.points.map((p: any) => p.y))
                    } : undefined
                }));
        } catch (error) {
            return [];
        }
    }

    private isFormatSupported(zbarFormat: string): boolean {
        const formatMap = this.getZBarFormatMap();
        const normalizedFormat = zbarFormat.toLowerCase();

        for (const [format, zbarName] of Object.entries(formatMap)) {
            if (zbarName === normalizedFormat && this.formats.includes(format as BarcodeFormat)) {
                return true;
            }
        }

        return false;
    }

    private mapZBarFormat(zbarFormat: string): string {
        const formatMap = this.getZBarFormatMap();
        const normalizedFormat = zbarFormat.toLowerCase();

        for (const [format, zbarName] of Object.entries(formatMap)) {
            if (zbarName === normalizedFormat) {
                return format;
            }
        }

        return zbarFormat;
    }

    private getZBarFormatMap(): { [key: string]: string } {
        return {
            [BarcodeFormat.CODE_128]: 'code-128',
            [BarcodeFormat.CODE_39]: 'code-39',
            [BarcodeFormat.CODE_93]: 'code-93',
            [BarcodeFormat.CODABAR]: 'codabar',
            [BarcodeFormat.EAN_8]: 'ean-8',
            [BarcodeFormat.EAN_13]: 'ean-13',
            [BarcodeFormat.ITF]: 'i2/5',
            [BarcodeFormat.UPC_A]: 'ean-13', // UPC-A is subset of EAN-13
            [BarcodeFormat.UPC_E]: 'ean-8', // UPC-E is subset of EAN-8
            [BarcodeFormat.QR_CODE]: 'qr-code',
            [BarcodeFormat.DATA_MATRIX]: 'datamatrix',
            [BarcodeFormat.PDF417]: 'pdf417'
        };
    }

    destroy(): void {
        // Cleanup canvas
        this.canvas.width = 0;
        this.canvas.height = 0;
    }
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
 * const scanner = new BarcodeScanner({
 *   container: document.getElementById('scanner-container'),
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
export class BarcodeScanner {
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
    private minDecodeInterval: number = 100; // Minimum ms between decode attempts

    // Focus UI Elements
    private focusElements: HTMLElement[] = [];

    // Camera Management
    private availableCameras: MediaDeviceInfo[] = [];
    private currentCameraIndex: number = 0;
    private focusDistanceCapability: ExtendedMediaTrackCapabilities['focusDistance'] | null = null;

    /**
     * Creates a new BarcodeScanner instance
     * 
     * @param options - Configuration options for the scanner
     * @throws {Error} If container element is not provided
     */
    constructor(options: BarcodeScannerOptions) {
        this.container = options.container;
        this.onCodeScanned = options.onCodeScanned || (() => { });
        this.onError = options.onError || (() => { });
        this.debug = options.debug || false;
        this.detectorType = options.detectorType || BarcodeDetectorType.AUTO;
        this.formats = options.formats || Object.values(BarcodeFormat);

        if (!this.container) {
            throw new Error('Container element is required');
        }

        // Create video element
        this.video = document.createElement('video');
        this.video.className = 'barcode-scanner-video';
        this.video.setAttribute('playsinline', '');
        this.video.setAttribute('autoplay', '');

        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'barcode-scanner-canvas';

        // Append elements to container
        this.container.appendChild(this.video);
        this.container.appendChild(this.canvas);

        // Get canvas context
        const context = this.canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
            throw new Error('Failed to get 2D context from canvas');
        }
        this.ctx = context;
    }

    /**
     * Logs debug messages to console if debug mode is enabled
     * @param args - Arguments to log
     */
    private log(...args: any[]): void {
        if (this.debug) {
            console.log('[BarcodeScanner]', ...args);
        }
    }

    /**
     * Logs warning messages to console if debug mode is enabled
     * @param args - Arguments to log
     */
    private warn(...args: any[]): void {
        if (this.debug) {
            console.warn('[BarcodeScanner]', ...args);
        }
    }

    /**
     * Logs error messages to console if debug mode is enabled
     * @param args - Arguments to log
     */
    private error(...args: any[]): void {
        if (this.debug) {
            console.error('[BarcodeScanner]', ...args);
        }
    }

    /**
     * Initializes the barcode decoder based on the selected type
     */
    private async initializeDecoder(): Promise<void> {
        let detectorToUse = this.detectorType;

        // Auto-select best available decoder
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
            if (detectorToUse === BarcodeDetectorType.NATIVE) {
                this.decoder = new NativeBarcodeDecoder(this.formats);
                this.log('Initialized Native BarcodeDetector');
            } else if (detectorToUse === BarcodeDetectorType.ZBAR) {
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

    /**
     * Initializes the barcode scanner
     * 
     * This method:
     * 1. Initializes the barcode decoder
     * 2. Requests camera permissions
     * 3. Enumerates available cameras
     * 4. Selects the best camera (back camera with best focus capabilities)
     * 5. Sets up the video stream
     * 6. Configures continuous autofocus
     * 7. Starts barcode scanning
     * 
     * @throws {Error} If camera permission is denied or initialization fails
     */
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

    /**
     * Sets up the camera by requesting permissions and selecting the best camera
     * 
     * On iOS, camera labels are only available after permissions are granted,
     * so we first request access, then enumerate devices.
     * 
     * Camera selection priority:
     * 1. Back camera with largest focus distance range (best for scanning)
     * 2. Back "ultra wide" camera (iOS)
     * 3. Back "wide" camera (iOS)
     * 4. First back camera found
     * 5. Last camera in list (usually back camera)
     */
    private async setupCamera(): Promise<void> {
        // Request camera permission first (required for iOS to get proper labels)
        let permissionStream: MediaStream | null = null;
        try {
            permissionStream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.log('Camera permission granted');
        } catch (err) {
            const error = err as Error;
            this.error('Camera permission denied:', error);
            throw new Error('Camera permission denied');
        }

        // Enumerate devices - iOS will now return proper labels
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.availableCameras = devices.filter(d => d.kind === 'videoinput');

        this.log('Available cameras:', this.availableCameras.map((d, i) => `[${i}] ${d.label}`));

        // Stop permission stream
        if (permissionStream) {
            permissionStream.getTracks().forEach(track => track.stop());
        }

        // Auto-select best camera on first load
        if (this.currentCameraIndex === 0) {
            await this.selectBestCamera();
        }

        const selectedDevice = this.availableCameras[this.currentCameraIndex];
        this.log(`Using camera [${this.currentCameraIndex}]:`, selectedDevice?.label);

        // Open the selected camera
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

        // Wait for video to be ready
        await new Promise<void>(resolve => {
            this.video.onloadedmetadata = () => resolve();
        });

        await this.setupContinuousFocus();
    }

    /**
     * Selects the best camera from available cameras
     * 
     * Priority:
     * 1. Back camera with best focus distance range
     * 2. iOS-specific: Ultra wide or wide camera
     * 3. First back camera
     * 4. Last camera (fallback)
     */
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

        // Test each back camera for focus capabilities
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

        // If no camera has focus distance support, use iOS camera name heuristics
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

    /**
     * Sets up continuous autofocus mode if supported by the camera
     * 
     * Also sets the focus distance to minimum (optimized for close-range scanning)
     * if focus distance control is available.
     */
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

    /**
     * Sets up event listeners for tap-to-focus
     */
    private setupEventListeners(): void {
        this.container.addEventListener('click', (e) => this.handleTapToFocus(e));
    }

    /**
     * Creates visual focus indicator at the tapped position
     * 
     * @param x - X coordinate relative to container
     * @param y - Y coordinate relative to container
     */
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

    /**
     * Removes all focus indicator elements from the DOM
     */
    private clearFocusIndicators(): void {
        this.focusElements.forEach(el => el.remove());
        this.focusElements = [];
    }

    /**
     * Handles tap-to-focus gesture
     * 
     * When the user taps on the video, this method:
     * 1. Shows a visual focus indicator
     * 2. Searches for the best focus distance using contrast detection
     * 3. Applies the optimal focus
     * 4. Returns to continuous autofocus after a delay
     * 
     * @param e - Click event
     */
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

    /**
     * Searches for the optimal focus distance by testing multiple distances
     * and measuring image contrast at the tapped location
     * 
     * The algorithm:
     * 1. Tests focus distances from min to max
     * 2. For each distance, captures a small area around the tap point
     * 3. Calculates image contrast (standard deviation of pixel brightness)
     * 4. Selects the distance with highest contrast (sharpest image)
     * 
     * @param tapX - X coordinate of tap
     * @param tapY - Y coordinate of tap
     * @param videoRect - Bounding rectangle of video element
     */
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

            // Return to continuous focus after delay
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

    /**
     * Calculates image contrast (sharpness) at a specific area
     * 
     * Uses standard deviation of pixel brightness as a measure of contrast.
     * Higher values indicate sharper, more focused images.
     * 
     * @param centerX - X coordinate of center point
     * @param centerY - Y coordinate of center point
     * @param videoRect - Bounding rectangle of video element
     * @param areaSize - Size of the area to analyze (in pixels)
     * @returns Standard deviation of pixel brightness (contrast measure)
     */
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

    /**
     * Fallback focus method when manual focus distance is not supported
     * 
     * Attempts to trigger single-shot autofocus if available
     */
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

    /**
     * Switches to the next available camera
     * 
     * Cycles through all available cameras. The stream is restarted with the new camera.
     * 
     * @returns Result object containing success status and camera information
     */
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

    /**
     * Toggles the camera flash/torch on or off
     * 
     * @returns Result object containing success status and flash state
     */
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

    /**
     * Gets information about the current camera
     * 
     * @returns Camera information object
     */
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

    /**
     * Sets the manual focus distance
     * 
     * Switches to manual focus mode and sets the focus to the specified distance.
     * The distance should be within the range returned by getCameraInfo().
     * 
     * @param distance - Focus distance value
     * @returns Result object containing success status
     */
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

    /**
     * Starts the barcode scanning loop
     * 
     * Continuously attempts to decode barcodes/QR codes from the video stream.
     * Calls the onCodeScanned callback when a code is detected.
     * Uses requestAnimationFrame for efficient, non-blocking scanning.
     */
    public startScanning(): void {
        this.scanning = true;
        this.scan();
    }

    /**
     * Internal scanning loop with throttling to prevent overload
     * 
     * Uses requestAnimationFrame for smooth performance and implements
     * a minimum interval between decode attempts to prevent CPU overload.
     */
    private scan(): void {
        if (!this.scanning) return;

        requestAnimationFrame(async () => {
            const now = Date.now();
            const timeSinceLastDecode = now - this.lastDecodeTime;

            // Throttle decode attempts
            if (timeSinceLastDecode < this.minDecodeInterval) {
                this.scan();
                return;
            }

            // Skip if already decoding
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

                        // Pause briefly after successful scan
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

    /**
     * Stops the scanner and releases all resources
     * 
     * This method:
     * 1. Stops the scanning loop
     * 2. Clears focus indicators
     * 3. Destroys the barcode decoder
     * 4. Stops and releases the camera stream
     * 5. Cleans up video element
     * 
     * Always call this method when done using the scanner to prevent
     * resource leaks and ensure the camera is properly released.
     */
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

    /**
     * Gets the current scanning state
     * 
     * @returns True if scanner is currently scanning for barcodes
     */
    public isScanning(): boolean {
        return this.scanning;
    }

    /**
     * Gets the current focusing state
     * 
     * @returns True if scanner is currently performing tap-to-focus
     */
    public isFocusing(): boolean {
        return this.focusing;
    }

    /**
     * Gets the video element
     * 
     * Useful for applying custom styles or accessing video properties
     * 
     * @returns The video element displaying the camera feed
     */
    public getVideoElement(): HTMLVideoElement {
        return this.video;
    }

    /**
     * Gets the canvas element
     * 
     * @returns The canvas element used for image processing
     */
    public getCanvasElement(): HTMLCanvasElement {
        return this.canvas;
    }

    /**
     * Gets the current media stream
     * 
     * @returns The active media stream or null if not initialized
     */
    public getStream(): MediaStream | null {
        return this.stream;
    }

    /**
     * Gets the current media track
     * 
     * @returns The active video track or null if not initialized
     */
    public getTrack(): MediaStreamTrack | null {
        return this.track;
    }

    /**
     * Gets the currently used decoder type
     * 
     * @returns The decoder type being used
     */
    public getDecoderType(): string {
        if (!this.decoder) return 'none';
        if (this.decoder instanceof NativeBarcodeDecoder) return 'native';
        if (this.decoder instanceof ZBarBarcodeDecoder) return 'zbar';
        return 'unknown';
    }

    /**
     * Gets the supported barcode formats
     * 
     * @returns Array of supported barcode formats
     */
    public getSupportedFormats(): BarcodeFormat[] {
        return [...this.formats];
    }
}