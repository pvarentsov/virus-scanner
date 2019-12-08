import { ApiModelProperty } from '@nestjs/swagger';

export class BaseResponseModel {

    @ApiModelProperty({type: 'number'})
    public readonly code: number;

    @ApiModelProperty({type: 'string'})
    public readonly message: string;

    @ApiModelProperty({type: 'number', description: ' Timestamp in milliseconds'})
    public readonly timestamp: number;

    @ApiModelProperty({type: null})
    public readonly data: {};

}
