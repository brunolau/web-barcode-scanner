/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

/**
 * Extended MediaTrackCapabilities with experimental camera features
 * These features are available in Chrome/Android but may not be in all browsers
 */
export interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
    focusDistance?: {
        max: number;
        min: number;
        step?: number;
    };
    zoom?: {
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
export interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
    focusDistance?: number;
    focusMode?: string;
    torch?: boolean;
}

/**
 * Extended MediaTrackSettings with experimental features
 */
export interface ExtendedMediaTrackSettings extends MediaTrackSettings {
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
 * Configuration options for WebBarcodeScanner initialization
 */
export interface WebBarcodeScannerOptions {
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

    /** Starts with initial zoom so that users tend to keep barcode further from the device */
    useZoomHack?: boolean

    /** Optional callback when init starts */
    onLoadingStart?: () => void

    /** Optional callback when init ends */
    onLoadingEnd?: () => void
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