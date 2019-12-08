import { BaseResponseModel } from '../../common/BaseResponseModel';
import { ApiModelProperty } from '@nestjs/swagger';
import { SyncScanResponseDataModel } from './SyncScanResponseDataModel';

export class SyncScanResponse extends BaseResponseModel {

    @ApiModelProperty({ type: SyncScanResponseDataModel })
    public readonly data: SyncScanResponseDataModel;

}
