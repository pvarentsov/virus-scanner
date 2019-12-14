import { Config } from '../../../../../src/core/configuration';

describe('Config', () => {

    describe('Positive cases', () => {

        it('Should be defined with API_HOST variable', () => {
            expect(typeof Config.API_HOST === 'string').toBeTruthy();
        });

        it('Should be defined with API_PORT variable', () => {
            expect(typeof Config.API_PORT === 'number').toBeTruthy();
        });

        it('Should be defined with API_BASE_PATH variable', () => {
            expect(typeof Config.API_BASE_PATH === 'string').toBeTruthy();
        });

        it('Should be defined with API_DOCUMENTATION_HOST variable', () => {
            expect(typeof Config.API_DOCUMENTATION_HOST === 'string').toBeTruthy();
        });

        it('Should be defined with API_CLUSTER_ENABLE variable', () => {
            expect(typeof Config.API_CLUSTER_ENABLE === 'number').toBeTruthy();
        });

        it('Should be defined with CLAMAV_HOST variable', () => {
            expect(typeof Config.CLAMAV_HOST === 'string').toBeTruthy();
        });

        it('Should be defined with CLAMAV_PORT variable', () => {
            expect(typeof Config.CLAMAV_PORT === 'number').toBeTruthy();
        });

        it('Should be defined with CLAMAV_TIMEOUT variable', () => {
            expect(typeof Config.CLAMAV_TIMEOUT === 'number').toBeTruthy();
        });

        it('Should be defined with LOG_FORMAT variable', () => {
            expect(typeof Config.LOG_FORMAT === 'string').toBeTruthy();
        });

        it('Should be defined with LOG_DISABLE_COLORS variable', () => {
            expect(typeof Config.LOG_DISABLE_COLORS === 'number').toBeTruthy();
        });

        it('Should be defined with MAX_SYNC_SCAN_FILE_SIZE variable', () => {
            expect(typeof Config.MAX_SYNC_SCAN_FILE_SIZE === 'number').toBeTruthy();
        });

    });

});
