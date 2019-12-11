import { ClamAVPingDetails, ClamAVScanDetails, ClamAVVersionDetails } from '../..';
import { ClamAVScanStatus } from '../types/ClamAVScanStatus';

export class ClamAVClientResponseParser {

    /**
     *  Available message values:
     *  * stream: OK
     *  * stream: Some-Signature FOUND
     */
    public static parseScanDetails(message: string): ClamAVScanDetails {
        const parsedMessage: string = ClamAVClientResponseParser.clearNoise(message)
            .replace('stream: ', '')
            .replace('FOUND', 'found')
            .replace('OK', 'Ok');

        const status: ClamAVScanStatus = message.includes('OK') && !message.includes('FOUND')
            ? ClamAVScanStatus.CLEAN
            : ClamAVScanStatus.INFECTED;

        return { Message: parsedMessage, Status: status };
    }

    /**
     *  Available values:
     *  * PONG\n
     */
    public static parsePingDetails(message: string): ClamAVPingDetails {
        const parsedMessage: string = ClamAVClientResponseParser
            .clearNoise(message)
            .replace('\n', '');

        return { Message: parsedMessage };
    }

    /**
     *  Available values:
     *  * ClamAV 0.102.0/25000/Wed Jan 01 00:00:00 2019\n
     */
    public static parseVersionDetails(message: string): ClamAVVersionDetails {
        let clamAVVersion: string = '';
        let signatureDatabaseVersion: string = '';
        let signatureDatabaseBuildTime: string = '';

        // Parsing of the ClamAV version

        const cleanMessage: string = ClamAVClientResponseParser.clearNoise(message);

        const clamAVVersionRegexp: RegExp = new RegExp(`ClamAV ([0-9.]*)\\/`, 'g');
        const matchesWithClamAVVersion: string[] | null = cleanMessage.match(clamAVVersionRegexp);

        if (matchesWithClamAVVersion && matchesWithClamAVVersion.length > 0) {
            clamAVVersion = matchesWithClamAVVersion[0]
                .replace('ClamAV ', '')
                .replace('/', '');
        }

        // Parsing of the Signature Database version

        const signatureDatabaseVersionRegexp: RegExp = new RegExp(`ClamAV ${clamAVVersion}\\/[0-9]+\\/`, 'g');
        const matchesWithSignatureDatabaseVersion: string[] | null = cleanMessage.match(signatureDatabaseVersionRegexp);

        if (matchesWithSignatureDatabaseVersion && matchesWithSignatureDatabaseVersion.length > 0) {
            signatureDatabaseVersion = matchesWithSignatureDatabaseVersion[0]
                .replace(`ClamAV ${clamAVVersion}/`, '')
                .replace('/', '');
        }

        // Parsing of the Signature Database Build Time

        if (clamAVVersion && signatureDatabaseVersion) {
            signatureDatabaseBuildTime = cleanMessage
                .replace(`ClamAV ${clamAVVersion}/${signatureDatabaseVersion}/`, '')
                .replace('\n', '');    
        }

        const versionDetails: ClamAVVersionDetails = {
            ClamAV           : clamAVVersion,
            SignatureDatabase: { version: signatureDatabaseVersion, buildTime: signatureDatabaseBuildTime}
        };

        return versionDetails;
    }

    public static clearNoise(message: string): string {
        return message
            .replace(new RegExp('\\u0000', 'g'), '');

    }

}
