import { ClamAVScanStatus } from '../../../../core/lib/clamav/client/types/ClamAVScanStatus';
import { ServiceOutputParameters } from '../../../../core/service';
import { ClamAVScanDetails } from '../../../../core/lib/clamav';

export class SyncScanOutputParameters extends ServiceOutputParameters {

    public readonly message: string;

    public readonly status: ClamAVScanStatus;

    private constructor(scanDetails: ClamAVScanDetails) {
        super();

        this.message = scanDetails.Message;
        this.status = scanDetails.Status;
    }

    public static create(scanDetails: ClamAVScanDetails): SyncScanOutputParameters {
        return new SyncScanOutputParameters(scanDetails);
    }

}
