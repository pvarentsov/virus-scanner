import { ClamAVClient, ClamAVConnectionOptions, ClamAVScanDetails } from '../../../core/lib/clamav';
import { IService } from '../../../core/service';
import { Injectable } from '@nestjs/common';
import { SyncScanInputParameters, SyncScanOutputParameters } from '..';

@Injectable()
export class SyncScanService implements IService<SyncScanInputParameters, SyncScanOutputParameters> {

    public async execute(inputParameters: SyncScanInputParameters): Promise<SyncScanOutputParameters> {

        // TODO: Add config provider

        const connectionOptions: ClamAVConnectionOptions = { host: 'localhost', port: 3310 };
        const scanDetails: ClamAVScanDetails = await ClamAVClient.scanStream(inputParameters.file, connectionOptions);

        return SyncScanOutputParameters.create(scanDetails);
    }

}
