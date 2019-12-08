import { ApiModelProperty } from '@nestjs/swagger';

export class PingResponseDataModel {

    @ApiModelProperty({ type: 'string' })
    public readonly message: string;

}
