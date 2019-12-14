import * as  dotenv from 'dotenv';
import * as path from 'path';

const envPath: string = path.resolve(__dirname, '../env/unit-test.env');

dotenv.config({ path: envPath });
