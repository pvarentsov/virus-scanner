import { Transform, TransformCallback } from 'stream';

export class ClamAVCommandDataTransformer {

    public static readonly INSTREAM = (): Transform => {
        const transform: Transform = new Transform();

        transform._transform = (chunk: Buffer, encoding: string, callback: TransformCallback): void => {
            const chunkLengthPart: Buffer = Buffer.alloc(4);
            chunkLengthPart.writeUInt32BE(chunk.length, 0);

            const chunkPart: Buffer = chunk;

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

}
