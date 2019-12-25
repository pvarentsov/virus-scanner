import {
    SyncScanInputParameters,
    SyncScanOutputParameters,
    SyncScanService,
} from '../../../../../src/application/scanner';
import { Test, TestingModule } from '@nestjs/testing';
import { ScanTokens } from '../../../../../src/infrastructure/module/scanner/ScanTokens';
import { IService } from '../../../../../src/core/service';
import { IMockClamAVServer, MockHelper } from '../../../../.helper/MockHelper';
import { ClamAVScanStatus } from '../../../../../src/core/lib/clamav/client/types/ClamAVScanStatus';
import { Readable } from 'stream';
import { RequestValidationError } from '../../../../../src/core/base-errors/RequestValidationError';
import { Config } from '../../../../../src/core/configuration';

describe('SyncScanService', () => {
    const serverDelayInMs: number = 10;

    let mockClamAVServer: IMockClamAVServer;
    let service: IService<SyncScanInputParameters, SyncScanOutputParameters>;

    afterEach(() => {
        mockClamAVServer.disable();
    });

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide   : ScanTokens.SyncScanService,
                    useClass  : SyncScanService
                },
            ],
        }).compile();

        service = module.get<IService<SyncScanInputParameters, SyncScanOutputParameters>>(ScanTokens.SyncScanService);
    });

    describe(`Execute`, () => {

        it('Expect SyncScanOutputParameters object with CLEAN status', async () => {
            const mockReceivedData: string = 'stream: OK';
            const mockReadStream: Readable = MockHelper.createReadStream(Buffer.alloc(1));

            mockClamAVServer = MockHelper.createClamAVServer({
                sendOnConnection: mockReceivedData,
                delayInMs       : serverDelayInMs
            });

            const expectedResult: SyncScanOutputParameters = SyncScanOutputParameters.create({
                Message: 'Ok',
                Status : ClamAVScanStatus.CLEAN
            });

            const inputParameters: SyncScanInputParameters = await SyncScanInputParameters.create(mockReadStream, 1);
            const result: SyncScanOutputParameters = await service.execute(inputParameters);

            expect(result).toEqual(expectedResult);
        });

        it('Expect SyncScanOutputParameters object with INFECTED status', async () => {
            const mockReceivedData: string = 'stream: Some-Signature FOUND';
            const mockReadStream: Readable = MockHelper.createReadStream(Buffer.alloc(1));

            mockClamAVServer = MockHelper.createClamAVServer({
                sendOnConnection: mockReceivedData,
                delayInMs       : serverDelayInMs
            });

            const expectedResult: SyncScanOutputParameters = SyncScanOutputParameters.create({
                Message: 'Some-Signature found',
                Status : ClamAVScanStatus.INFECTED
            });

            const inputParameters: SyncScanInputParameters = await SyncScanInputParameters.create(mockReadStream, 1);
            const result: SyncScanOutputParameters = await service.execute(inputParameters);

            expect(result).toEqual(expectedResult);
        });

        const requestValidationErrorTestDescription: string =
            `When the file size exceeded the value of the MAX_SYNC_SCAN_FILE_SIZE environment variable, ` +
            `expect RequestValidationError says that file size was exceeded`;

        it(requestValidationErrorTestDescription, async () => {
            const mockReadStream: Readable = MockHelper.createReadStream(Buffer.alloc(1));

            const expectedError: RequestValidationError = RequestValidationError.create(
                RequestValidationError.FILE_SIZE_EXCEEDED_MESSAGE(Config.MAX_SYNC_SCAN_FILE_SIZE)
            );

            const inputParameters: SyncScanInputParameters = await SyncScanInputParameters.create(
                mockReadStream,
                Config.MAX_SYNC_SCAN_FILE_SIZE + 1
            );

            await expect(service.execute(inputParameters)).rejects.toEqual(expectedError);
        });

    });

});
