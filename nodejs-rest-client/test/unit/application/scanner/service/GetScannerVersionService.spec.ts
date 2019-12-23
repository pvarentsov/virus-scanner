import { GetScannerVersionOutputParameters, GetScannerVersionService, } from '../../../../../src/application/scanner';
import { Test, TestingModule } from '@nestjs/testing';
import { ScanTokens } from '../../../../../src/infrastructure/module/scanner/ScanTokens';
import { IService } from '../../../../../src/core/service';
import { IMockClamAVServer, MockHelper } from '../../../../.helper/MockHelper';

describe('GetScannerVersionService', () => {
    const serverDelayInMs: number = 100;

    let mockClamAVServer: IMockClamAVServer;
    let service: IService<void, GetScannerVersionOutputParameters>;

    afterEach(() => {
        mockClamAVServer.disable();
    });

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide   : ScanTokens.GetScannerVersionService,
                    useClass  : GetScannerVersionService
                },
            ],
        }).compile();

        service = module.get<IService<void, GetScannerVersionOutputParameters>>(ScanTokens.GetScannerVersionService);
    });

    describe(`Execute`, () => {

        it('Expect GetScannerVersionOutputParameters object with version details', async () => {
            const mockReceivedData: string = 'ClamAV 0.102.0/25000/Wed Jan 01 00:00:00 2019';

            mockClamAVServer = MockHelper.createClamAVServer({
                sendOnConnection: mockReceivedData,
                delayInMs       : serverDelayInMs
            });

            const expectedResult: GetScannerVersionOutputParameters = GetScannerVersionOutputParameters.create({
                ClamAV           : '0.102.0',
                SignatureDatabase: { version: '25000', buildTime: 'Wed Jan 01 00:00:00 2019' }
            });

            const result: GetScannerVersionOutputParameters = await service.execute();

            expect(result).toEqual(expectedResult);
        });

    });

});
