import { ApiProperty } from '@nestjs/swagger';
import { ClamAVScanStatus } from '../../../../../core/lib/clamav/client/types/ClamAVScanStatus';

export class SyncScanResponseDataModel {

    @ApiProperty({ type: 'string' })
    public readonly message: string;

    @ApiProperty({ enum: [ClamAVScanStatus.CLEAN, ClamAVScanStatus.INFECTED] })
    public readonly status: ClamAVScanStatus;

}
