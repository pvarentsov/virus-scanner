import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseModel {

    @ApiProperty({type: 'number'})
    public readonly code: number;

    @ApiProperty({type: 'string'})
    public readonly message: string;

    @ApiProperty({type: 'number', description: ' Timestamp in milliseconds'})
    public readonly timestamp: number;

    @ApiProperty({type: 'object'})
    public readonly data: {};

}
