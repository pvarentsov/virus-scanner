import { Readable } from 'stream';
import { Socket } from 'net';
import Mitm = require('mitm');

export class MockHelper {

    public static createReadStream(buffer?: Buffer): Readable {
        const data: Buffer = buffer || Buffer.from('11111111');
        const readStream: Readable = new Readable();

        readStream.push(data);
        readStream.push(null);

        return readStream;
    }

    public static createBuffer(options: { sizeInBytes: number, UInt8Data: number[] }): Buffer {
        if (options.sizeInBytes !== options.UInt8Data.length) {
            throw new Error('MockHelper: UInt8Data length does not match the sizeInBytes');
        }

        const sourceBuffer: Buffer = Buffer.alloc(options.sizeInBytes);

        options.UInt8Data.forEach(
            (UInt8Chunk: number, index: number) => sourceBuffer.writeUInt8(UInt8Chunk, index)
        );

        return sourceBuffer;
    }

    public static createClamAVServer(options: { sendOnConnection: string, delayInMs: number }): IMockClamAVServer {
        const clamAVServer: IMockClamAVServer = Mitm();

        clamAVServer.on('connection', (socket: Socket) => {
            setTimeout(() => {
                socket.write(options.sendOnConnection);
                socket.emit('end');
            }, options.delayInMs);
        });

        return clamAVServer;
    }

}

export interface IMockClamAVServer {

    on(event: 'connection', callback: (socket: Socket) => void): void;

    disable(): void;

}
