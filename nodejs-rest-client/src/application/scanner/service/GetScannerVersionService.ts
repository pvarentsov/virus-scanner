import { ClamAVClient, ClamAVConnectionOptions, ClamAVVersionDetails } from '../../../core/lib/clamav';
import { IService } from '../../../core/service';
import { Injectable } from '@nestjs/common';
import { GetScannerVersionOutputParameters } from '..';

@Injectable()
export class GetScannerVersionService implements IService<void, GetScannerVersionOutputParameters> {

    public async execute(): Promise<GetScannerVersionOutputParameters> {

        // TODO: Add config provider

        const connectionOptions: ClamAVConnectionOptions = { host: 'localhost', port: 3310 };
        const versionDetails: ClamAVVersionDetails = await ClamAVClient.getVersion(connectionOptions);

        return GetScannerVersionOutputParameters.create(versionDetails);
    }

}
