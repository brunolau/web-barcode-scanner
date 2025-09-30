import { WebBarcodeScannerOptions, CameraInfo, CameraSwitchResult, FlashToggleResult, FocusDistanceResult, ScannerError } from "./data";

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
 * 
 * @example
 * ```typescript
 * const scanner = new BarcodeScanner({
 *   container: document.getElementById('scanner-container'),
 *   debug: true,
 *   onCodeScanned: (code) => {
 *     console.log('Scanned:', code);
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
    private readonly onCodeScanned: (code: string) => void;
    private readonly onError: (error: ScannerError) => void;
    private readonly debug: boolean;

    // DOM Elements
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    // Media Stream
    private stream: MediaStream | null = null;
    private track: MediaStreamTrack | null = null;

    // Barcode Reader
    private codeReader: any; // ZXing.BrowserMultiFormatReader

    // State
    private scanning: boolean = false;
    private focusing: boolean = false;
    private manualFocusMode: boolean = false;

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
    constructor(options: WebBarcodeScannerOptions) {
        this.container = options.container;
        this.onCodeScanned = options.onCodeScanned || (() => { });
        this.onError = options.onError || (() => { });
        this.debug = options.debug || false;

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

        // Initialize ZXing barcode reader
        // Note: Assumes ZXing library is loaded globally
        if (typeof (window as any).ZXing !== 'undefined') {
            this.codeReader = new (window as any).ZXing.BrowserMultiFormatReader();
        } else {
            throw new Error('ZXing library not found. Please include the ZXing library.');
        }
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
     * Initializes the barcode scanner
     * 
     * This method:
     * 1. Requests camera permissions
     * 2. Enumerates available cameras
     * 3. Selects the best camera (back camera with best focus capabilities)
     * 4. Sets up the video stream
     * 5. Configures continuous autofocus
     * 6. Starts barcode scanning
     * 
     * @throws {Error} If camera permission is denied or initialization fails
     */
    public async init(): Promise<void> {
        try {
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
            if (hasFocusMode && ((capabilities.focusMode as string[])?.indexOf('continuous') > -1)) {
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
                if (this.track && capabilities.focusMode && capabilities.focusMode.indexOf('continuous') > -1) {
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
            if (capabilities.focusMode && capabilities.focusMode.indexOf('single-shot') > -1) {
                await this.track.applyConstraints({
                    advanced: [{ focusMode: 'single-shot' } as ExtendedMediaTrackConstraintSet]
                });

                this.log('Single-shot focus triggered');

                setTimeout(async () => {
                    if (this.track && capabilities.focusMode && capabilities.focusMode.indexOf('continuous') > -1) {
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
                if (capabilities.focusMode && capabilities.focusMode.indexOf('manual') > -1) {
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
     */
    public startScanning(): void {
        this.scanning = true;
        this.scan();
    }

    /**
     * Internal scanning loop
     * 
     * Recursively scans for barcodes using the ZXing library.
     * When a barcode is found, it triggers the onCodeScanned callback
     * and pauses for 2 seconds before resuming scanning.
     */
    private async scan(): Promise<void> {
        if (!this.scanning) return;

        try {
            const result = await this.codeReader.decodeOnceFromStream(this.stream);

            if (result) {
                this.log('Barcode scanned:', result.getText());
                this.onCodeScanned(result.getText());
                setTimeout(() => this.scan(), 2000);
            }
        } catch (err) {
            const error = err as Error;
            if (error.name !== 'NotFoundException') {
                this.warn('Scan error:', error);
            }
            if (this.scanning) {
                requestAnimationFrame(() => this.scan());
            }
        }
    }

    /**
     * Stops the scanner and releases all resources
     * 
     * This method:
     * 1. Stops the scanning loop
     * 2. Clears focus indicators
     * 3. Resets the barcode reader
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

        if (this.codeReader) {
            this.codeReader.reset();
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
}