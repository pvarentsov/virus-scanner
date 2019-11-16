import { Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { IService } from '../../core/service';
import {
    GetScannerVersionOutputParameters,
    PingScannerOutputParameters,
    SyncScanInputParameters,
    SyncScanOutputParameters
} from '../../application/scanner';
import * as Busboy from 'busboy';
import { Request } from 'express';
import { Readable } from 'stream';
import { ScanTokens } from '../../infrastructure/module/scanner/ScanTokens';
import IBusboy = busboy.Busboy;

@Controller('scanner')
export class ScanController {

    constructor(
        @Inject(ScanTokens.SyncScanService)
        private readonly syncScanService: IService<SyncScanInputParameters, SyncScanOutputParameters>,

        @Inject(ScanTokens.PingScannerVersionService)
        private readonly pingScannerService: IService<undefined, PingScannerOutputParameters>,

        @Inject(ScanTokens.GetScannerVersionService)
        private readonly getScannerVersionService: IService<undefined, GetScannerVersionOutputParameters>,
    ) {}

    @Post('sync-scan')
    public async syncScan(@Req() request: Request): Promise<SyncScanOutputParameters> {
        return new Promise((resolve: ResolveCallback<SyncScanOutputParameters>, reject: RejectCallback): void => {
            const busboy: IBusboy = new Busboy({headers: request.headers, limits: {files: 1}});

            busboy.on('file', async (fieldName: string, fileInputStream: Readable): Promise<void> => {
                try {
                    const fileSize: number = parseInt(request.headers['content-length']!, 10);

                    const syncScanInputParameters: SyncScanInputParameters
                        = await SyncScanInputParameters.create(fileInputStream, fileSize);

                    const syncScanOutputParameters: SyncScanOutputParameters
                        = await this.syncScanService.execute(syncScanInputParameters);

                    resolve(syncScanOutputParameters);

                } catch (err) {
                    fileInputStream.resume();
                    reject(err);
                }
            });

            request.pipe(busboy);
        });
    }

    @Post('ping')
    public async ping(): Promise<PingScannerOutputParameters> {
        return this.pingScannerService.execute(undefined);
    }

    @Get('version')
    public async getVersion(): Promise<GetScannerVersionOutputParameters> {
        return this.getScannerVersionService.execute(undefined);
    }
}
