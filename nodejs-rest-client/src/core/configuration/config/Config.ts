import { EnvParser } from '../parser/EnvParser';

export class Config {

    // API
    
    public static readonly API_HOST: string = EnvParser.parseString('API_HOST');

    public static readonly API_PORT: number = EnvParser.parseNumber('API_PORT');

    public static readonly API_BASE_PATH: string = EnvParser.parseString('API_BASE_PATH');

    public static readonly API_CLUSTER_ENABLE: number = EnvParser.parseNumber('API_CLUSTER_ENABLE');
    
    // ClamAV

    public static readonly CLAMAV_HOST: string = EnvParser.parseString('CLAMAV_HOST');

    public static readonly CLAMAV_PORT: number = EnvParser.parseNumber('CLAMAV_PORT');

    public static readonly CLAMAV_TIMEOUT: number = EnvParser.parseNumber('CLAMAV_TIMEOUT');
    
    // Logs

    public static readonly LOG_FORMAT: 'TEXT'|'JSON' = EnvParser.parseString('LOG_FORMAT');

    public static readonly LOG_DISABLE_COLORS: number = EnvParser.parseNumber('LOG_DISABLE_COLORS');
    
    // Files

    public static readonly MAX_SYNC_SCAN_FILE_SIZE: number = EnvParser.parseNumber('MAX_SYNC_SCAN_FILE_SIZE');
    
}
