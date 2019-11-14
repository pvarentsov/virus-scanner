import { ServiceOutputParameters } from '../../../../core/service';
import { ClamAVVersionDetails } from '../../../../core/lib/clamav';

export class GetScannerVersionOutputParameters extends ServiceOutputParameters {

    public readonly clamAV: string;

    public readonly signatureDatabase: { version: string, buildTime: string };

    private constructor(versionDetails: ClamAVVersionDetails) {
        super();

        this.clamAV = versionDetails.ClamAV;
        this.signatureDatabase = { version: versionDetails.SignatureDatabase.version, buildTime: versionDetails.SignatureDatabase.buildTime };
    }

    public static create(versionDetails: ClamAVVersionDetails): GetScannerVersionOutputParameters {
        return new GetScannerVersionOutputParameters(versionDetails);
    }

}
