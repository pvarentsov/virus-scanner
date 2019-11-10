import { ClamAVClient, ClamAVScanDetails } from '../../../core/lib/clamav';
import { SyncScanInputParameters, SyncScanOutputParameters } from '../..';

// TODO: Research problem with implementing of the IService

export class SyncScanService {

    public async execute(inputParameters: SyncScanInputParameters): Promise<SyncScanOutputParameters> {
        const clamAVHost: string = 'localhost';
        const clamAVPort: number = 3310;

        const scanDetails: ClamAVScanDetails = await ClamAVClient.scanStream(inputParameters.file, { host: clamAVHost, port: clamAVPort });

        return SyncScanOutputParameters.create(scanDetails.Message, scanDetails.Status);
    }

}
