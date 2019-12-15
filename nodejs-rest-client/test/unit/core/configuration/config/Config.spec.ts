import { Config } from '../../../../../src/core/configuration';

describe('Config', () => {

    describe(`Config's initialization with environment variables`, () => {

        it('When environment variables are exposed, expect API_HOST to be initialized as string', () => {
            expect(typeof Config.API_HOST === 'string').toBeTruthy();
        });

        it('When environment variables are exposed, expect API_PORT to be initialized as number', () => {
            expect(typeof Config.API_PORT === 'number').toBeTruthy();
        });

        it('When environment variables are exposed, expect API_BASE_PATH to be initialized as string', () => {
            expect(typeof Config.API_BASE_PATH === 'string').toBeTruthy();
        });

        it('When environment variables are exposed, expect API_CLUSTER_ENABLE to be initialized as number', () => {
            expect(typeof Config.API_CLUSTER_ENABLE === 'number').toBeTruthy();
        });

        it('When environment variables are exposed, expect CLAMAV_HOST to be initialized as string', () => {
            expect(typeof Config.CLAMAV_HOST === 'string').toBeTruthy();
        });

        it('When environment variables are exposed, expect CLAMAV_PORT to be initialized as number', () => {
            expect(typeof Config.CLAMAV_PORT === 'number').toBeTruthy();
        });

        it('When environment variables are exposed, expect CLAMAV_TIMEOUT to be initialized as number', () => {
            expect(typeof Config.CLAMAV_TIMEOUT === 'number').toBeTruthy();
        });

        it('When environment variables are exposed, expect LOG_FORMAT to be initialized as string', () => {
            expect(typeof Config.LOG_FORMAT === 'string').toBeTruthy();
        });

        it('When environment variables are exposed, expect LOG_DISABLE_COLORS to be initialized as number', () => {
            expect(typeof Config.LOG_DISABLE_COLORS === 'number').toBeTruthy();
        });

        it('When environment variables are exposed, expect MAX_SYNC_SCAN_FILE_SIZE to be initialized as number', () => {
            expect(typeof Config.MAX_SYNC_SCAN_FILE_SIZE === 'number').toBeTruthy();
        });

    });

});
