import { ClamAVClient, ClamAVVersionDetails } from '../../../core/lib/clamav';
import { IService } from '../../../core/service';
import { Injectable } from '@nestjs/common';
import { GetScannerVersionOutputParameters } from '..';

@Injectable()
export class GetScannerVersionService implements IService<undefined, GetScannerVersionOutputParameters> {

    public async execute(): Promise<GetScannerVersionOutputParameters> {

        // TODO: Add config provider

        const clamAVHost: string = 'localhost';
        const clamAVPort: number = 3310;

        const versionDetails: ClamAVVersionDetails = await ClamAVClient.getVersion({ host: clamAVHost, port: clamAVPort });

        return GetScannerVersionOutputParameters.create(versionDetails);
    }

}
