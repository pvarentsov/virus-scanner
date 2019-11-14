import { ClamAVClient, ClamAVPingDetails } from '../../../core/lib/clamav';
import { IService } from '../../../core/service';
import { Injectable } from '@nestjs/common';
import { PingScannerOutputParameters } from '..';

@Injectable()
export class PingScannerVersionService implements IService<undefined, PingScannerOutputParameters> {

    public async execute(): Promise<PingScannerOutputParameters> {

        // TODO: Add config provider

        const clamAVHost: string = 'localhost';
        const clamAVPort: number = 3310;

        const pingDetails: ClamAVPingDetails = await ClamAVClient.ping({ host: clamAVHost, port: clamAVPort });

        return PingScannerOutputParameters.create(pingDetails);
    }

}
