import { Controller, Inject, Post, Req } from '@nestjs/common';
import { IService } from '../../../core/service';
import { SyncScanInputParameters, SyncScanOutputParameters, SyncScanService } from '../../../application';
import * as Busboy from 'busboy';
import { Request } from 'express';
import { Readable } from 'stream';
import IBusboy = busboy.Busboy;

@Controller(`v1/scan`)
export class ScanController {

    constructor(
        @Inject(SyncScanService)
        private readonly syncScanService: IService
    ) {}

    @Post('sync')
    public async syncScan(@Req() request: Request): Promise<SyncScanOutputParameters> {
        return new Promise((resolve: ResolveCallback<SyncScanOutputParameters>, reject: RejectCallback): void => {
            const busboy: IBusboy = new Busboy({headers: request.headers, limits: {files: 1}});

            busboy.on('file', async (fieldName: string, fileInputStream: Readable): Promise<void> => {
                try {
                    const fileSize: number = parseInt(request.headers['content-length']!, 10);

                    const syncScanInputParameters: SyncScanInputParameters = await SyncScanInputParameters.create(fileInputStream, fileSize);
                    const syncScanOutputParameters: SyncScanOutputParameters = await this.syncScanService.execute(syncScanInputParameters);

                    resolve(syncScanOutputParameters);

                } catch (err) {
                    fileInputStream.resume();
                    reject(err);
                }
            });

            request.pipe(busboy);
        });
    }
}
