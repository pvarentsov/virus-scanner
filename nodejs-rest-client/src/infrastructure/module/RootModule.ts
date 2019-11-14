import { Module } from '@nestjs/common';
import { ScanModule } from './scanner/ScanModule';

@Module({
    imports: [
        ScanModule
    ],
})
export class RootModule {}
