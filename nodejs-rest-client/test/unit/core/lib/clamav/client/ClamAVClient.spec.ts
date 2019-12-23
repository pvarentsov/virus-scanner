import {
    ClamAVClient,
    ClamAVConnectionOptions,
    ClamAVPingDetails,
    ClamAVScanDetails,
    ClamAVVersionDetails
} from '../../../../../../src/core/lib/clamav';
import { IMockClamAVServer, MockHelper } from '../../../../../.helper/MockHelper';
import { Readable } from 'stream';
import { ClamAVScanStatus } from '../../../../../../src/core/lib/clamav/client/types/ClamAVScanStatus';
import { ClamAVClientError } from '../../../../../../src/core/lib/clamav/client/errors/ClamAVClientError';

let mockClamAVServer: IMockClamAVServer;

afterEach(() => {
    mockClamAVServer.disable();
});

describe('ClamAVClient', () => {
    const connectionOptions: ClamAVConnectionOptions = { host: 'localhost', port: 42 };
    const serverDelayInMs: number = 100;

    describe(`Send SCAN command`, () => {

        it('Expect parsed SCAN details object with CLEAN status', async () => {
            const mockReceivedData: string = 'stream: OK\0\n';
            const mockReadStream: Readable = MockHelper.createReadStream(Buffer.alloc(1));

            mockClamAVServer = MockHelper.createClamAVServer({
                sendOnConnection: mockReceivedData,
                delayInMs       : serverDelayInMs
            });

            const expectedDetails: ClamAVScanDetails = {
                Message: 'Ok',
                Status : ClamAVScanStatus.CLEAN
            };

            const scanDetails: ClamAVScanDetails = await ClamAVClient.scanStream(mockReadStream, connectionOptions);

            expect(scanDetails).toEqual(expectedDetails);
        });

        it('Expect parsed SCAN details object with INFECTED status', async () => {
            const mockReceivedData: string = 'stream: Some-Signature FOUND\0\n';
            const mockReadStream: Readable = MockHelper.createReadStream(Buffer.alloc(1));

            mockClamAVServer = MockHelper.createClamAVServer({
                sendOnConnection: mockReceivedData,
                delayInMs       : serverDelayInMs
            });

            const expectedDetails: ClamAVScanDetails = {
                Message: 'Some-Signature found',
                Status : ClamAVScanStatus.INFECTED
            };

            const scanDetails: ClamAVScanDetails = await ClamAVClient.scanStream(mockReadStream, connectionOptions);

            expect(scanDetails).toEqual(expectedDetails);
        });

        const scanAbortedTestDescription: string =
            `When the client receives a response but the data has not yet been sent, ` +
            `expect ClamAVClientError says that the scanning was aborted due to "Internal ERROR"`;

        it(scanAbortedTestDescription, async () => {
            const mockReceivedData: string = 'Internal ERROR';
            const mockReadStream: Readable = MockHelper.createReadStream(Buffer.alloc(10));

            mockClamAVServer = MockHelper.createClamAVServer({
                sendOnConnection: mockReceivedData,
                delayInMs       : 0
            });

            const expectedError: ClamAVClientError = ClamAVClientError.createScanAbortedError('Internal ERROR');

            await expect(ClamAVClient.scanStream(mockReadStream, connectionOptions)).rejects.toEqual(expectedError);
        });

    });

    describe(`Send PING command`, () => {

        it('Expect parsed PONG details object', async () => {
            const mockReceivedData: string = 'PONG\0\n';

            mockClamAVServer = MockHelper.createClamAVServer({
                sendOnConnection: mockReceivedData,
                delayInMs       : serverDelayInMs
            });

            const expectedDetails: ClamAVPingDetails = { Message: 'PONG' };

            const pingDetails: ClamAVPingDetails = await ClamAVClient.ping(connectionOptions);

            expect(pingDetails).toEqual(expectedDetails);
        });

        const connectionTimedOutTestDescription: string =
            `When the server response time exceeded the "timeoutInMs" option, ` +
            `expect ClamAVClientError says the connection to ClamAV server was timed out`;

        it(connectionTimedOutTestDescription, async () => {
            const mockReceivedData: string = 'Internal ERROR';

            mockClamAVServer = MockHelper.createClamAVServer({
                sendOnConnection: mockReceivedData,
                delayInMs       : serverDelayInMs
            });

            const expectedError: ClamAVClientError = ClamAVClientError.createConnectionTimedOutError();

            const scanConnectionOptions: ClamAVConnectionOptions = { ...connectionOptions, timeoutInMs: 50 };

            await expect(ClamAVClient.ping(scanConnectionOptions)).rejects.toEqual(expectedError);
        });

    });

    describe(`Send VERSION command`, () => {

        it('Expect parsed VERSION details object', async () => {
            const mockReceivedData: string = 'ClamAV 0.102.0/25000/Wed Jan 01 00:00:00 2019\0\n';

            mockClamAVServer = MockHelper.createClamAVServer({
                sendOnConnection: mockReceivedData,
                delayInMs       : serverDelayInMs
            });

            const expectedDetails: ClamAVVersionDetails = {
                ClamAV           : '0.102.0',
                SignatureDatabase: { version: '25000', buildTime: 'Wed Jan 01 00:00:00 2019' }
            };

            const versionDetails: ClamAVVersionDetails = await ClamAVClient.getVersion(connectionOptions);

            expect(versionDetails).toEqual(expectedDetails);
        });

    });

});
