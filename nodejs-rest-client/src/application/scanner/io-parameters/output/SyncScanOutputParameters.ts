import { ClamAVScanStatus } from '../../../../core/lib/clamav/client/types/ClamAVScanStatus';
import { ServiceOutputParameters } from '../../../../core/service';

export class SyncScanOutputParameters extends ServiceOutputParameters {

    public readonly message: string;

    public readonly status: ClamAVScanStatus;

    private constructor(message: string, status: ClamAVScanStatus) {
        super();

        this.message = message;
        this.status = status;
    }

    public static create(message: string, status: ClamAVScanStatus): SyncScanOutputParameters {
        return new SyncScanOutputParameters(message, status);
    }

}
