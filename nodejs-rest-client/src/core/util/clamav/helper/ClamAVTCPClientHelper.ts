import { ClamAVScanDetails } from '../types/ClamAVScanDetails';
import { ClamAVScanStatus } from '../types/ClamAVScanStatus';
import { Transform, TransformCallback } from 'stream';

export class ClamAVTCPClientHelper {

    public static transformReadStreamToClamAVInstream = (): Transform => {
        const transform: Transform = new Transform();

        transform._transform = (chunk: Uint8Array, encoding: string, callback: TransformCallback): void => {
            const chunkLengthPart: Buffer = Buffer.alloc(4);
            chunkLengthPart.writeUInt32BE(chunk.length, 0);

            const chunkPart: Uint8Array = chunk;

            transform.push(chunkLengthPart);
            transform.push(chunkPart);

            callback();
        };

        transform._flush = (callback: TransformCallback): void => {
            const zeroLengthPart: Buffer = Buffer.alloc(4);
            zeroLengthPart.writeUInt32BE(0, 0);

            transform.push(zeroLengthPart);

            callback();
        };

        return transform;
    }

    public static parseScanDetails(message: string): ClamAVScanDetails {
        const parsedMessage: string = message
            .replace('\u0000', '')
            .replace('stream: ', '')
            .replace('FOUND', 'found')
            .replace('OK', 'Ok');

        const status: ClamAVScanStatus = message.includes('OK') && !message.includes('FOUND')
            ? ClamAVScanStatus.CLEAN
            : ClamAVScanStatus.INFECTED;

        return { message: parsedMessage, status: status };
    }

}
