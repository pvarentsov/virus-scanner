import { BaseResponseModel } from '../../common/BaseResponseModel';
import { ApiProperty } from '@nestjs/swagger';
import { GetVersionResponseDataModel } from './GetVersionResponseDataModel';

export class GetVersionResponse extends BaseResponseModel {

    @ApiProperty({ type: GetVersionResponseDataModel })
    public readonly data: GetVersionResponseDataModel;

}
