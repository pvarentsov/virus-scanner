import { BaseResponseModel } from '../../common/BaseResponseModel';
import { ApiModelProperty } from '@nestjs/swagger';
import { PingResponseDataModel } from './PingResponseDataModel';

export class PingResponse extends BaseResponseModel {

    @ApiModelProperty({ type: PingResponseDataModel })
    public readonly data: PingResponseDataModel;

}
