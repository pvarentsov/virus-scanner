import { ServiceInputParameters } from '../../../../core/service';
import { Readable } from 'stream';
import { IsInstance, IsNumber } from 'class-validator';

export class SyncScanInputParameters extends ServiceInputParameters {

    @IsInstance(Readable)
    public readonly file: Readable;

    @IsNumber()
    public readonly fileSizeInBytes: number;

    constructor(file: Readable, fileSizeInBytes: number) {
        super();

        this.file = file;
        this.fileSizeInBytes = fileSizeInBytes;
    }

    public static async create(file: Readable, fileSizeInBytes: number): Promise<SyncScanInputParameters> {
        const inputParameters: SyncScanInputParameters = new SyncScanInputParameters(file, fileSizeInBytes);
        await inputParameters.validate();

        return inputParameters;
    }

}
