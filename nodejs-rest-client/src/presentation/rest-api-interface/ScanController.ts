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
import { ServerResponse } from '../../infrastructure/response';
import { RequestValidationError } from '../../core/base-errors/RequestValidationError';
import IBusboy = busboy.Busboy;

@Controller('scanner')
export class ScanController {

    constructor(
        @Inject(ScanTokens.SyncScanService)
        private readonly syncScanService: IService<SyncScanInputParameters, SyncScanOutputParameters>,

        @Inject(ScanTokens.PingScannerVersionService)
        private readonly pingScannerService: IService<void, PingScannerOutputParameters>,

        @Inject(ScanTokens.GetScannerVersionService)
        private readonly getScannerVersionService: IService<void, GetScannerVersionOutputParameters>,
    ) {}

    @Post('sync-scan')
    public async syncScan(@Req() request: Request): Promise<ServerResponse> {
        return new Promise(
            (resolve: ResolveCallback<ServerResponse>, reject: RejectCallback): void => {

                const busboy: IBusboy = new Busboy({ headers: request.headers, limits: { files: 1 } });
                const fieldNames: string[] = [];

                busboy.on('file', async (fieldName: string, fileInputStream: Readable): Promise<void> => {
                    try {
                        fieldNames.push(fieldName);

                        const fileSize: number = parseInt(request.headers['content-length']!, 10);

                        const syncScanInputParameters: SyncScanInputParameters
                            = await SyncScanInputParameters.create(fileInputStream, fileSize);

                        const syncScanOutputParameters: SyncScanOutputParameters
                            = await this.syncScanService.execute(syncScanInputParameters);

                        const response: ServerResponse = ServerResponse.createSuccessResponse(syncScanOutputParameters);

                        resolve(response);

                    } catch (err) {
                        fileInputStream.resume();
                        reject(err);
                    }
                });

                this.handleBusboyFinishEvent(busboy, fieldNames, reject);

                request.pipe(busboy);
            }
        );
    }

    @Post('ping')
    public async ping(): Promise<ServerResponse> {
        const pingDetails: PingScannerOutputParameters = await this.pingScannerService.execute();
        return ServerResponse.createSuccessResponse(pingDetails);
    }

    @Get('version')
    public async getVersion(): Promise<ServerResponse> {
        const versionDetails: GetScannerVersionOutputParameters = await this.getScannerVersionService.execute();
        return ServerResponse.createSuccessResponse(versionDetails);
    }

    private handleBusboyFinishEvent = (
        busboy: IBusboy,
        fieldNames: string[],
        reject: RejectCallback

    ): void => {

        busboy.on('finish', (): void => {
            if (fieldNames.length === 0) {
                reject(RequestValidationError.create(`Multipart form is empty.`));
            }
        });
    }
}
