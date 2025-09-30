import { scanImageData } from '@undecaf/zbar-wasm';
import { IWebBarcodeDecoder, DecodedBarcode, BarcodeFormat } from '../data';

/**
 * ZBar WASM implementation using @undecaf/zbar-wasm
 * @internal
 */
export class ZBarBarcodeDecoder implements IWebBarcodeDecoder {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private formats: BarcodeFormat[];

    constructor(formats: BarcodeFormat[]) {
        this.formats = formats;
        this.canvas = document.createElement('canvas');
        const context = this.canvas.getContext('2d', { willReadFrequently: true });
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
            [BarcodeFormat.CODE_128]: 'zbar_code128',
            [BarcodeFormat.CODE_39]: 'zbar_code39',
            [BarcodeFormat.CODE_93]: 'zbar_code93',
            [BarcodeFormat.CODABAR]: 'zbar_codabar',
            [BarcodeFormat.EAN_8]: 'zbar_ean8',
            [BarcodeFormat.EAN_13]: 'zbar_ean13',
            [BarcodeFormat.ITF]: 'zbar_i25',
            [BarcodeFormat.UPC_A]: 'zbar_upca',
            [BarcodeFormat.UPC_E]: 'zbar_upce',
            [BarcodeFormat.QR_CODE]: 'zbar_qrcode',
            [BarcodeFormat.DATA_MATRIX]: 'zbar_none',
            [BarcodeFormat.PDF417]: 'zbar_pdf417'
        };
    }

    destroy(): void {
        // Cleanup canvas
        this.canvas.width = 0;
        this.canvas.height = 0;
    }
}