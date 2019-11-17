import { ClamAVClient, ClamAVConnectionOptions, ClamAVVersionDetails } from '../../../core/lib/clamav';
import { IService } from '../../../core/service';
import { Injectable } from '@nestjs/common';
import { GetScannerVersionOutputParameters } from '..';
import { Config } from '../../../core/configuration';

@Injectable()
export class GetScannerVersionService implements IService<void, GetScannerVersionOutputParameters> {

    public async execute(): Promise<GetScannerVersionOutputParameters> {
        const connectionOptions: ClamAVConnectionOptions = {
            host       : Config.CLAMAV_HOST,
            port       : Config.CLAMAV_PORT,
            timeoutInMs: Config.CLAMAV_TIMEOUT,
        };

        const versionDetails: ClamAVVersionDetails = await ClamAVClient.getVersion(connectionOptions);

        return GetScannerVersionOutputParameters.create(versionDetails);
    }

}
