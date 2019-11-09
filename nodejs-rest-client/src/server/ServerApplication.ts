import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { RootModule } from '../module/RootModule';
import * as path from 'path';
import * as fs from 'fs';
import { ReadStream } from 'fs';
import { ClamAVClient } from '../core/lib/clamav/client/ClamAVClient';
import { ClamAVScanDetails } from '../core/lib/clamav/client/types/ClamAVScanDetails';

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
        const infectedFilePath: string = path.normalize(__dirname + '/static/infected-file.txt');
        const infectedFileReadStream: ReadStream = fs.createReadStream(infectedFilePath);

        const infectedScanDetails: ClamAVScanDetails = await ClamAVClient.scanStream(infectedFileReadStream);

        const cleanFilePath: string = path.normalize(__dirname + '/static/clean-file.txt');
        const cleanFileReadStream: ReadStream = fs.createReadStream(cleanFilePath);

        const cleanScanDetails: ClamAVScanDetails = await ClamAVClient.scanStream(cleanFileReadStream);

        console.log(await ClamAVClient.ping());
        console.log(await ClamAVClient.getVersion());

        console.log(infectedScanDetails);
        console.log(cleanScanDetails);
    }

}
