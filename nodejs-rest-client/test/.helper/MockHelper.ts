import { Readable } from 'stream';

export class MockHelper {

    public static createMockReadStream(buffer?: Buffer): Readable {
        const data: Buffer = buffer || Buffer.from('');
        const readStream: Readable = new Readable();

        readStream.push(data);
        readStream.push(null);

        return readStream;
    }

    public static createBuffer(options: { sizeInBytes: number, UIntData: number[],  }): Buffer {
        if (options.sizeInBytes !== options.UIntData.length) {
            throw new Error('MockHelper: UIntData length does not match the sizeInBytes');
        }

        const sourceBuffer: Buffer = Buffer.alloc(options.sizeInBytes);

        options.UIntData.forEach(
            (UIntChunk: number, index: number) => sourceBuffer.writeUInt8(UIntChunk, index)
        );

        return sourceBuffer;
    }

}
