import { Module } from '@nestjs/common';
import { ScanModule } from './scanner/ScanModule';
import { InfrastructureModule } from './infrastructure/InfrastructureModule';

@Module({
    imports: [
        InfrastructureModule,
        ScanModule
    ],
})
export class RootModule {}
