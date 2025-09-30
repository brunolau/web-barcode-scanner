import { IWebBarcodeDecoder, DecodedBarcode, BarcodeFormat } from '../data';

/**
 * Native BarcodeDetector implementation
 * @internal
 */
export class NativeBarcodeDecoder implements IWebBarcodeDecoder {
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