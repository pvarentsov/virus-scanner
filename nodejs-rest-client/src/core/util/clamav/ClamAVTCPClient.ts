import * as net from 'net';
import { Socket } from 'net';
import { ClamAVScanDetails } from './types/ClamAVScanDetails';
import * as stream from 'fs';
import { ClamAVTCPClientHelper } from './helper/ClamAVTCPClientHelper';

export class ClamAVTCPClient {

    private static PORT: number = 3310;

    private static HOST: string = 'localhost';

    private static TIMEOUT: number = 5000;

    private static SCAN_STREAM_COMMAND: string = 'zINSTREAM\0';

    public static async scanStream(readStream: stream.ReadStream): Promise<ClamAVScanDetails> {
        const scanMessage: string = await ClamAVTCPClient.sendTCPCommandToScanStream(readStream);
        return ClamAVTCPClientHelper.parseScanDetails(scanMessage);
    }

    private static sendTCPCommandToScanStream = (readStream: stream.ReadStream): Promise<string> => {
        let isReadStreamFinished: boolean = false;

        return new Promise((resolve: ResolveCallback, reject: RejectCallback): void => {
            const scanResponseChunks: Buffer[] = [];

            const connectAttemptTimer: NodeJS.Timeout = setTimeout(
                () => socket.destroy(new Error('Timeout connecting to server')),
                ClamAVTCPClient.TIMEOUT
            );

            const socketOnDataListener: (chunk: Buffer) => void = (chunk: Buffer): void => {
                clearTimeout(connectAttemptTimer);

                if (!readStream.isPaused()) {
                    readStream.pause();
                }

                scanResponseChunks.push(chunk);
            };
            const socketOnEndListener: () => void = (): void => {
                clearTimeout(connectAttemptTimer);

                const scanResultBuffer: Buffer = Buffer.concat(scanResponseChunks);

                if (!isReadStreamFinished) {
                    reject(new Error('Scan aborted. Reply from server: ' + scanResultBuffer));
                }

                resolve(scanResultBuffer.toString('utf-8'));
            };
            const socketOnConnectListener: () => void = (): void => {
                socket.write(ClamAVTCPClient.SCAN_STREAM_COMMAND);

                readStream.addListener('end', () => {
                    isReadStreamFinished = true;
                    readStream.destroy();
                });
                readStream.addListener('error', reject);

                readStream.pipe(ClamAVTCPClientHelper.transformReadStreamToClamAVInstream()).pipe(socket);
            };

            const socket: Socket = net
                .createConnection({ host: ClamAVTCPClient.HOST, port: ClamAVTCPClient.PORT })
                .setTimeout(ClamAVTCPClient.TIMEOUT);

            socket.addListener('connect', socketOnConnectListener);
            socket.addListener('data', socketOnDataListener);
            socket.addListener('end', socketOnEndListener);
            socket.addListener('error', reject);
        });
    }

}
