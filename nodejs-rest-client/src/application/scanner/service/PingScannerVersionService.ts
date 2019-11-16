import { ClamAVClient, ClamAVConnectionOptions, ClamAVPingDetails } from '../../../core/lib/clamav';
import { IService } from '../../../core/service';
import { Injectable } from '@nestjs/common';
import { PingScannerOutputParameters } from '..';

@Injectable()
export class PingScannerVersionService implements IService<void, PingScannerOutputParameters> {

    public async execute(): Promise<PingScannerOutputParameters> {

        // TODO: Add config provider

        const connectionOptions: ClamAVConnectionOptions = { host: 'localhost', port: 3310 };
        const pingDetails: ClamAVPingDetails = await ClamAVClient.ping(connectionOptions);

        return PingScannerOutputParameters.create(pingDetails);
    }

}
