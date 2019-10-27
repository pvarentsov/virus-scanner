import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { RootModule } from '../module/RootModule';
import * as path from 'path';
import * as fs from 'fs';
import { ReadStream } from 'fs';
import { ClamAVScanDetails, ClamavTCPClient } from '../core/util/ClamavTCPClient';

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

        const infectedScanDetails: ClamAVScanDetails = await ClamavTCPClient.scanStream(infectedFileReadStream);

        const cleanFilePath: string = path.normalize(__dirname + '/static/clean-file.txt');
        const cleanFileReadStream: ReadStream = fs.createReadStream(cleanFilePath);

        const cleanScanDetails: ClamAVScanDetails = await ClamavTCPClient.scanStream(cleanFileReadStream);

        console.log(infectedScanDetails);
        console.log(cleanScanDetails);
    }

}
