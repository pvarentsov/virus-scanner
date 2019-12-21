import { Readable } from 'stream';

export class MockBuilder {

    public static createMockReadStream(buffer?: Buffer): Readable {
        const data: Buffer = buffer || Buffer.from('');
        const readStream: Readable = new Readable();

        readStream.push(data);
        readStream.push(null);

        return readStream;
    }

}
