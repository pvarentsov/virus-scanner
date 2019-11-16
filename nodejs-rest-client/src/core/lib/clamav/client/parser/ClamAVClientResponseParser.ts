import { ClamAVPingDetails, ClamAVScanDetails, ClamAVVersionDetails } from '../..';
import { ClamAVScanStatus } from '../types/ClamAVScanStatus';

export class ClamAVClientResponseParser {

    public static parseScanDetails(message: string): ClamAVScanDetails {
        const parsedMessage: string = message
            .replace('\u0000', '')
            .replace('stream: ', '')
            .replace('FOUND', 'found')
            .replace('OK', 'Ok');

        const status: ClamAVScanStatus = message.includes('OK') && !message.includes('FOUND')
            ? ClamAVScanStatus.CLEAN
            : ClamAVScanStatus.INFECTED;

        return { Message: parsedMessage, Status: status };
    }

    public static parsePingDetails(message: string): ClamAVPingDetails {
        const parsedMessage: string = message.replace('\n', '');
        return { Message: parsedMessage };
    }

    public static parseVersionDetails(message: string): ClamAVVersionDetails {
        let clamAVVersion: string = '';
        let signatureDatabaseVersion: string = '';
        let signatureDatabaseBuildTime: string = '';

        // Parsing of the ClamAV version

        const clamAVVersionRegexp: RegExp = new RegExp(`ClamAV ([0-9.]*)\\/`, 'g');
        const matchesWithClamAVVersion: string[] | null = message.match(clamAVVersionRegexp);

        if (matchesWithClamAVVersion && matchesWithClamAVVersion.length > 0) {
            clamAVVersion = matchesWithClamAVVersion[0]
                .replace('ClamAV ', '')
                .replace('/', '');
        }

        // Parsing of the Signature Database version

        const signatureDatabaseVersionRegexp: RegExp = new RegExp(`ClamAV ${clamAVVersion}\\/[0-9]+\\/`, 'g');
        const matchesWithSignatureDatabaseVersion: string[] | null = message.match(signatureDatabaseVersionRegexp);

        if (matchesWithSignatureDatabaseVersion && matchesWithSignatureDatabaseVersion.length > 0) {
            signatureDatabaseVersion = matchesWithSignatureDatabaseVersion[0]
                .replace(`ClamAV ${clamAVVersion}/`, '')
                .replace('/', '');
        }

        // Parsing of the Signature Database Build Time

        if (clamAVVersion && signatureDatabaseVersion) {
            signatureDatabaseBuildTime = message
                .replace(`ClamAV ${clamAVVersion}/${signatureDatabaseVersion}/`, '')
                .replace('\n', '');    
        }

        const versionDetails: ClamAVVersionDetails = {
            ClamAV           : clamAVVersion,
            SignatureDatabase: { version: signatureDatabaseVersion, buildTime: signatureDatabaseBuildTime}
        };

        return versionDetails;
    }

}
