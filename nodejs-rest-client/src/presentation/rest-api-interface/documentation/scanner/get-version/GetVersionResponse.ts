import { BaseResponseModel } from '../../common/BaseResponseModel';
import { ApiModelProperty } from '@nestjs/swagger';
import { GetVersionResponseDataModel } from './GetVersionResponseDataModel';

export class GetVersionResponse extends BaseResponseModel {

    @ApiModelProperty({ type: GetVersionResponseDataModel })
    public readonly data: GetVersionResponseDataModel;

}
