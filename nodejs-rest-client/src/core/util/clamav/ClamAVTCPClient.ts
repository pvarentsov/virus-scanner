import * as net from 'net';
import { Socket } from 'net';
import { Transform, TransformCallback } from 'stream';
import { ClamAVScanDetails } from './types/ClamAVScanDetails';
import { ClamAVScanStatus } from './types/ClamAVScanStatus';
import * as stream from 'fs';

export class ClamAVTCPClient {

    private static PORT: number = 3310;

    private static HOST: string = 'localhost';

    private static TIMEOUT: number = 5000;

    private static SCAN_STREAM_COMMAND: string = 'zINSTREAM\0';

    public static async scanStream(readStream: stream.ReadStream): Promise<ClamAVScanDetails> {

        const scanMessage: string = await new Promise((resolve: ResolveCallback, reject: RejectCallback): void => {
            const scanResponseChunks: Uint8Array[] = [];

            let readFinished: boolean = false;

            const connectAttemptTimer: NodeJS.Timeout = setTimeout(
                () => socket.destroy(new Error('Timeout connecting to server')),
                ClamAVTCPClient.TIMEOUT
            );

            const socketOnDataListener: (chunk: Uint8Array) => void = (chunk: Uint8Array): void => {
                clearTimeout(connectAttemptTimer);

                if (!readStream.isPaused()) {
                    readStream.pause();
                }

                scanResponseChunks.push(chunk);
            };

            const socketOnEndListener: () => void = (): void => {
                clearTimeout(connectAttemptTimer);

                const scanResultBuffer: Buffer = Buffer.concat(scanResponseChunks);

                if (!readFinished) {
                    reject(new Error('Scan aborted. Reply from server: ' + scanResultBuffer));
                }

                resolve(scanResultBuffer.toString('utf-8'));
            };

            const socketOnConnectListener: () => void = (): void => {
                socket.write(ClamAVTCPClient.SCAN_STREAM_COMMAND);

                readStream.addListener('end', () => {
                    readFinished = true;
                    readStream.destroy();
                });
                readStream.addListener('error', reject);

                readStream.pipe(ClamAVTCPClient.transformStreamToClamAVInstream()).pipe(socket);
            };

            const socket: Socket = net
                .createConnection({ host: ClamAVTCPClient.HOST, port: ClamAVTCPClient.PORT })
                .setTimeout(ClamAVTCPClient.TIMEOUT);

            socket.addListener('connect', socketOnConnectListener);
            socket.addListener('data', socketOnDataListener);
            socket.addListener('end', socketOnEndListener);
            socket.addListener('error', reject);
        });

        return ClamAVTCPClient.parseScanDetails(scanMessage);
    }

    private static transformStreamToClamAVInstream: () => Transform = (): Transform => {
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

    private static parseScanDetails(message: string): ClamAVScanDetails {
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
