import { Module } from '@nestjs/common';
import { ScanController } from '../../../presentation/rest-api-interface/ScanController';
import { GetScannerVersionService, PingScannerService, SyncScanService } from '../../../application/scanner';
import { ScanTokens } from './ScanTokens';

@Module({
    controllers: [
        ScanController
    ],
    providers: [
        {
            provide : ScanTokens.SyncScanService,
            useClass: SyncScanService
        },
        {
            provide : ScanTokens.PingScannerService,
            useClass: PingScannerService
        },
        {
            provide : ScanTokens.GetScannerVersionService,
            useClass: GetScannerVersionService
        },
    ]
})
export class ScanModule {}
