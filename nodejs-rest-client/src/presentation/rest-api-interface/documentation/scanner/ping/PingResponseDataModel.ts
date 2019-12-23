import { ApiProperty } from '@nestjs/swagger';

export class PingResponseDataModel {

    @ApiProperty({ type: 'string' })
    public readonly message: string;

}
