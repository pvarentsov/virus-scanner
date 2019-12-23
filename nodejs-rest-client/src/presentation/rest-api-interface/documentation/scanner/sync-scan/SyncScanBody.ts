import { ApiProperty } from '@nestjs/swagger';

export class SyncScanBody {

    @ApiProperty({ type: 'string', format: 'binary' })
    public readonly file: string;

}
