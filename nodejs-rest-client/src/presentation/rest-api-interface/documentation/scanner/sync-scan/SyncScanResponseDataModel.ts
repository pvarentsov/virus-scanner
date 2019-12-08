import { ApiModelProperty } from '@nestjs/swagger';
import { ClamAVScanStatus } from '../../../../../core/lib/clamav/client/types/ClamAVScanStatus';

export class SyncScanResponseDataModel {

    @ApiModelProperty({ type: 'string' })
    public readonly message: string;

    @ApiModelProperty({ enum: [ClamAVScanStatus.CLEAN, ClamAVScanStatus.INFECTED] })
    public readonly status: ClamAVScanStatus;

}
