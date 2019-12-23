import { MockHelper } from '../../../../../../.helper/MockHelper';
import { Readable } from 'stream';
import { ClamAVCommandDataTransformer } from '../../../../../../../src/core/lib/clamav/command/data-transformer/ClamAVCommandDataTransformer';

describe('ClamAVCommandDataTransformer', () => {

    describe(`Transform INSTREAM stream`, () => {

        const testDescription: string =
            `When stream contains buffer = 11111111, ` +
            `expect transformed stream contains buffer with:\n` +
            `          1. "Data Length Part" where length = 1 byte in the 32 bit format;\n` +
            `          2. "Data Part" where data = 11111111;\n` +
            `          3. "Data End Flag Part" where flag = 0 in the 32 bit format.`;

        it(testDescription, async () => {
            const sourceBuffer: Buffer = MockHelper.createBuffer({ sizeInBytes: 1, UIntData: [255] });
            const sourceReadStream: Readable = MockHelper.createMockReadStream(sourceBuffer);

            const expectedBuffer: Buffer = MockHelper.createBuffer({
                sizeInBytes: 9,
                UIntData   : [
                    0,
                    0,
                    0,
                    1,
                    255,
                    0,
                    0,
                    0,
                    0,
                ]
            });

            const transformedReadStream: Readable = sourceReadStream.pipe(ClamAVCommandDataTransformer.INSTREAM());
            const transformedBuffer: Buffer = await pipeStreamToBuffer(transformedReadStream);

            expect(transformedBuffer).toEqual(expectedBuffer);
        });

    });

});

async function pipeStreamToBuffer(readStream: Readable): Promise<Buffer> {
    const buffer: Buffer = await new Promise<Buffer>(
        (resolve: (value: Buffer) => void, reject: (e: Error) => void): void => {

            const chunks: Buffer[] = [];

            readStream.on('data', (chunk: Buffer) => chunks.push(chunk));
            readStream.on('end', () => resolve(Buffer.concat(chunks)));
            readStream.on('error', reject);
        }
    );

    return buffer;
}
