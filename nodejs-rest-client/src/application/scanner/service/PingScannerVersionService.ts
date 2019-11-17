import { ClamAVClient, ClamAVConnectionOptions, ClamAVPingDetails } from '../../../core/lib/clamav';
import { IService } from '../../../core/service';
import { Injectable } from '@nestjs/common';
import { PingScannerOutputParameters } from '..';
import { Config } from '../../../core/configuration';

@Injectable()
export class PingScannerVersionService implements IService<void, PingScannerOutputParameters> {

    public async execute(): Promise<PingScannerOutputParameters> {
        const connectionOptions: ClamAVConnectionOptions = {
            host       : Config.CLAMAV_HOST,
            port       : Config.CLAMAV_PORT,
            timeoutInMs: Config.CLAMAV_TIMEOUT,
        };

        const pingDetails: ClamAVPingDetails = await ClamAVClient.ping(connectionOptions);

        return PingScannerOutputParameters.create(pingDetails);
    }

}
