import { BaseResponseModel } from '../../common/BaseResponseModel';
import { ApiProperty } from '@nestjs/swagger';
import { SyncScanResponseDataModel } from './SyncScanResponseDataModel';

export class SyncScanResponse extends BaseResponseModel {

    @ApiProperty({ type: SyncScanResponseDataModel })
    public readonly data: SyncScanResponseDataModel;

}
