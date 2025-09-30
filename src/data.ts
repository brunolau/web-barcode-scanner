/**
 * Configuration options for BarcodeScanner initialization
 */
export interface WebBarcodeScannerOptions {
    /** The container element where the scanner will be mounted */
    container: HTMLElement;

    /** Callback function invoked when a barcode/QR code is successfully scanned */
    onCodeScanned?: (code: string) => void;

    /** Callback function invoked when an error occurs */
    onError?: (error: ScannerError) => void;

    /** Enable debug logging to console (default: false) */
    debug?: boolean;
}

/**
 * Error information returned by the scanner
 */
export interface ScannerError {
    /** Type of error that occurred */
    type: 'init' | 'focus' | 'camera_switch' | 'flash' | 'scan';

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