/* tslint:disable */

import * as net from 'net';
import { Socket } from 'net';
import { Transform, TransformCallback } from 'stream';
import * as stream from 'fs';

export enum ClamAVScanStatus {

    CLEAN    = 'CLEAN',

    INFECTED = 'INFECTED'
}

export type ClamAVScanDetails = {

    message: string;

    status: ClamAVScanStatus
}

export class ClamavTCPClient {

    private static PORT: number = 3310;

    private static HOST: string = 'localhost';

    private static TIMEOUT: number = 5000;

    private static SCAN_STREAM_COMMAND: string = 'zINSTREAM\0';

    public static async scanStream(readStream: stream.ReadStream): Promise<ClamAVScanDetails> {

        const scanMessage: string = await new Promise((resolve: ResolveCallback, reject: RejectCallback): void => {

            let readFinished: boolean = false;

            const socket: Socket = net.createConnection({host: ClamavTCPClient.HOST, port: ClamavTCPClient.PORT},
                (): void => {
                    socket.write(ClamavTCPClient.SCAN_STREAM_COMMAND);

                    readStream.pipe(ClamavTCPClient.chunkTransform()).pipe(socket);
                    readStream
                        .on('end', () => {
                            readFinished = true;
                            readStream.destroy();
                        })
                        .on('error', reject);
            });

            const replies: Uint8Array[] = [];

            socket
                .setTimeout(ClamavTCPClient.TIMEOUT)
                .on('data', (chunk: Uint8Array) => {
                    clearTimeout(connectAttemptTimer);

                    if (!readStream.isPaused()) {
                        readStream.pause();
                    }
                    replies.push(chunk);
                })
                .on('end', () => {
                    clearTimeout(connectAttemptTimer);

                    const reply: Buffer = Buffer.concat(replies);

                    if (!readFinished) {
                        reject(new Error('Scan aborted. Reply from server: ' + reply));
                    } else {
                        resolve(reply.toString('utf-8'));
                    }
                })
                .on('error', reject);

            const connectAttemptTimer: NodeJS.Timeout = setTimeout(
                () => socket.destroy(new Error('Timeout connecting to server')),
                ClamavTCPClient.TIMEOUT
            );
        });

        return ClamavTCPClient.parseScanDetails(scanMessage);
    }

    private static chunkTransform = (): Transform => {
        return new Transform(
            {
                transform(chunk: string, encoding: string, callback: TransformCallback): void {
                    const length: Buffer = Buffer.alloc(4);
                    length.writeUInt32BE(chunk.length, 0);

                    this.push(length);
                    this.push(chunk);

                    callback();
                },

                flush(callback: TransformCallback): void {
                    const zore: Buffer = Buffer.alloc(4);
                    zore.writeUInt32BE(0, 0);
                    this.push(zore);
                    callback();
                }
            });
    };

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
