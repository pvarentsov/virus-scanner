import { ServiceOutputParameters } from '../../../../core/service';
import { ClamAVPingDetails } from '../../../../core/lib/clamav';

export class PingScannerOutputParameters extends ServiceOutputParameters {

    public readonly message: string;

    private constructor(pingDetails: ClamAVPingDetails) {
        super();
        this.message = pingDetails.Message;
    }

    public static create(pingDetails: ClamAVPingDetails): PingScannerOutputParameters {
        return new PingScannerOutputParameters(pingDetails);
    }

}
