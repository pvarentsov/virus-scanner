import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { RootModule } from '../module/RootModule';
import * as path from 'path';
import * as fs from 'fs';
import { ClamAVClient, ClamAVConnectionOptions, ClamAVScanDetails } from '../core/lib/clamav';

export class ServerApplication {

    private readonly port: 3000;

    private readonly hostname: 'localhost';

    public static create(): ServerApplication {
        return new ServerApplication();
    }

    public async bootstrap(): Promise<void> {
        await this.scanTestFile();

        const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(RootModule);
        await app.listen(this.port, this.hostname);
    }

    private async scanTestFile(): Promise<void> {
        const clamAVConnectionOptions: ClamAVConnectionOptions = {
            host: 'localhost',
            port: 3310,
        };

        const infectedFilePath: string = path.normalize(__dirname + '/static/infected-file.txt');
        const infectedFileReadStream: fs.ReadStream = fs.createReadStream(infectedFilePath);

        const infectedScanDetails: ClamAVScanDetails = await ClamAVClient.scanStream(infectedFileReadStream, clamAVConnectionOptions);

        const cleanFilePath: string = path.normalize(__dirname + '/static/clean-file.txt');
        const cleanFileReadStream: fs.ReadStream = fs.createReadStream(cleanFilePath);

        const cleanScanDetails: ClamAVScanDetails = await ClamAVClient.scanStream(cleanFileReadStream, clamAVConnectionOptions);

        console.log(await ClamAVClient.ping(clamAVConnectionOptions));
        console.log(await ClamAVClient.getVersion(clamAVConnectionOptions));

        console.log(infectedScanDetails);
        console.log(cleanScanDetails);
    }

}
