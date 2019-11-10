import { Module } from '@nestjs/common';
import { ScanController } from '../../presentation/rest-api-interface/v1/ScanController';
import { SyncScanService } from '../../application';

@Module({
    controllers: [
        ScanController
    ],
    providers: [
        SyncScanService
    ]
})
export class ScanModule {}
