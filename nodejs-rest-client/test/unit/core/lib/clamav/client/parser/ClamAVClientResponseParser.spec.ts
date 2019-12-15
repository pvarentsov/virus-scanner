import { ClamAVPingDetails, ClamAVScanDetails, ClamAVVersionDetails } from '../../../../../../../src/core/lib/clamav';
import { ClamAVScanStatus } from '../../../../../../../src/core/lib/clamav/client/types/ClamAVScanStatus';
import { ClamAVClientResponseParser } from '../../../../../../../src/core/lib/clamav/client/parser/ClamAVClientResponseParser';

describe('ClamAVClientResponseParser', () => {

    describe(`Parse scan details`, () => {

        const cleanMsg: string = 'stream: OK';
        const infectedMsg: string = 'stream: Some-Signature FOUND';

        it(`When details contain "${cleanMsg}", expect ClamAVScanDetails object with clean status`, () => {
            const expectedScanDetails: ClamAVScanDetails = {
                Message: 'Ok',
                Status : ClamAVScanStatus.CLEAN,
            };

            const scanDetails: ClamAVScanDetails = ClamAVClientResponseParser.parseScanDetails(cleanMsg);

            expect(scanDetails).toEqual(expectedScanDetails);
        });

        it(`When details contain "${infectedMsg}", expect ClamAVScanDetails object with infected status`, () => {
            const expectedScanDetails: ClamAVScanDetails = {
                Message: 'Some-Signature found',
                Status : ClamAVScanStatus.INFECTED,
            };

            const scanDetails: ClamAVScanDetails = ClamAVClientResponseParser.parseScanDetails(infectedMsg);

            expect(scanDetails).toEqual(expectedScanDetails);
        });

    });

    describe(`Parse ping details`, () => {

        it(`When details contain "PONG\\n", expect ClamAVPingDetails object with PONG message`, () => {
            const expectedPingDetails: ClamAVPingDetails = {
                Message: 'PONG'
            };

            const message: string = 'PONG\n';

            const pingDetails: ClamAVPingDetails = ClamAVClientResponseParser.parsePingDetails(message);

            expect(pingDetails).toEqual(expectedPingDetails);
        });

    });

    describe(`Parse version details`, () => {

        const testDescription: { when: string, expect: string } = {
            when  : `When details contain "ClamAV '0.100.1/25000/Jan 01.01.2020\\n"`,
            expect: `expect ClamAVVersionDetails object with parsed attributes' values`
        };

        it(`${testDescription.when}, ${testDescription.expect}`,  () => {

            const expectedVersionDetails: ClamAVVersionDetails = {
                ClamAV           : '0.100.1',
                SignatureDatabase: { version: '25000', buildTime: 'Jan 01.01.2020' }
            };

            const message: string = `ClamAV 0.100.1/25000/Jan 01.01.2020\n`;

            const versionDetails: ClamAVVersionDetails = ClamAVClientResponseParser.parseVersionDetails(message);

            expect(versionDetails).toEqual(expectedVersionDetails);
        });

    });

});
