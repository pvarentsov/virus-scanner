import { ClamAVClient, ClamAVConnectionOptions, ClamAVScanDetails } from '../../../core/lib/clamav';
import { IService } from '../../../core/service';
import { Injectable } from '@nestjs/common';
import { SyncScanInputParameters, SyncScanOutputParameters } from '..';
import { Config } from '../../../core/configuration';
import { RequestValidationError } from '../../../core/base-errors/RequestValidationError';

@Injectable()
export class SyncScanService implements IService<SyncScanInputParameters, SyncScanOutputParameters> {

    public async execute(inputParameters: SyncScanInputParameters): Promise<SyncScanOutputParameters> {
        const fileSizeLimit: number = Config.MAX_SYNC_SCAN_FILE_SIZE;

        if (inputParameters.fileSizeInBytes > fileSizeLimit) {
            const errorMessage: string = RequestValidationError.SIZE_LIMIT_EXCEEDED_MESSAGE(fileSizeLimit);
            throw RequestValidationError.create(errorMessage);
        }

        const connectionOptions: ClamAVConnectionOptions = {
            host       : Config.CLAMAV_HOST,
            port       : Config.CLAMAV_PORT,
            timeoutInMs: Config.CLAMAV_TIMEOUT,
        };

        const scanDetails: ClamAVScanDetails = await ClamAVClient.scanStream(inputParameters.file, connectionOptions);

        return SyncScanOutputParameters.create(scanDetails);
    }

}
