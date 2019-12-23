import { PingScannerOutputParameters, PingScannerService } from '../../../../../src/application/scanner';
import { Test, TestingModule } from '@nestjs/testing';
import { ScanTokens } from '../../../../../src/infrastructure/module/scanner/ScanTokens';
import { IService } from '../../../../../src/core/service';
import { IMockClamAVServer, MockHelper } from '../../../../.helper/MockHelper';

describe('PingScannerService', () => {
    const serverDelayInMs: number = 100;

    let mockClamAVServer: IMockClamAVServer;
    let service: IService<void, PingScannerOutputParameters>;

    afterEach(() => {
        mockClamAVServer.disable();
    });

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide   : ScanTokens.PingScannerService,
                    useClass  : PingScannerService
                },
            ],
        }).compile();

        service = module.get<IService<void, PingScannerOutputParameters>>(ScanTokens.PingScannerService);
    });

    describe(`Execute`, () => {

        it('Expect PingScannerOutputParameters object with PONG message', async () => {
            const mockReceivedData: string = 'PONG';

            mockClamAVServer = MockHelper.createClamAVServer({
                sendOnConnection: mockReceivedData,
                delayInMs       : serverDelayInMs
            });

            const expectedResult: PingScannerOutputParameters = PingScannerOutputParameters.create({ Message: 'PONG' });

            const result: PingScannerOutputParameters = await service.execute();

            expect(result).toEqual(expectedResult);
        });

    });

});
