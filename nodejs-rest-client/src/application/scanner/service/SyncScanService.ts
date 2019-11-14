import { ClamAVClient, ClamAVScanDetails } from '../../../core/lib/clamav';
import { IService } from '../../../core/service';
import { Injectable } from '@nestjs/common';
import { SyncScanInputParameters, SyncScanOutputParameters } from '..';

@Injectable()
export class SyncScanService implements IService<SyncScanInputParameters, SyncScanOutputParameters> {

    public async execute(inputParameters: SyncScanInputParameters): Promise<SyncScanOutputParameters> {

        // TODO: Add config provider

        const clamAVHost: string = 'localhost';
        const clamAVPort: number = 3310;

        const scanDetails: ClamAVScanDetails = await ClamAVClient.scanStream(inputParameters.file, { host: clamAVHost, port: clamAVPort });

        return SyncScanOutputParameters.create(scanDetails);
    }

}
