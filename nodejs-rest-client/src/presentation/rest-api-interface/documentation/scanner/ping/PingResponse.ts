import { BaseResponseModel } from '../../common/BaseResponseModel';
import { ApiProperty } from '@nestjs/swagger';
import { PingResponseDataModel } from './PingResponseDataModel';

export class PingResponse extends BaseResponseModel {

    @ApiProperty({ type: PingResponseDataModel })
    public readonly data: PingResponseDataModel;

}
