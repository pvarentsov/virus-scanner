import { Controller, Get, HttpCode, Inject, Post, Req } from '@nestjs/common';
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
import { Config } from '../../core/configuration';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SyncScanResponse } from './documentation/scanner/sync-scan/SyncScanResponse';
import { PingResponse } from './documentation/scanner/ping/PingResponse';
import { GetVersionResponse } from './documentation/scanner/get-version/GetVersionResponse';
import { SyncScanBody } from './documentation/scanner/sync-scan/SyncScanBody';
import IBusboy = busboy.Busboy;

@Controller(`${Config.API_BASE_PATH}/scanner`)
@ApiTags('Scanner')
export class ScanController {

    constructor(
        @Inject(ScanTokens.SyncScanService)
        private readonly syncScanService: IService<SyncScanInputParameters, SyncScanOutputParameters>,

        @Inject(ScanTokens.PingScannerService)
        private readonly pingScannerService: IService<void, PingScannerOutputParameters>,

        @Inject(ScanTokens.GetScannerVersionService)
        private readonly getScannerVersionService: IService<void, GetScannerVersionOutputParameters>,
    ) {}

    @Post('sync-scan')
    @HttpCode(200)
    @ApiConsumes('multipart/form-data')
    @ApiBody({type: SyncScanBody})
    @ApiResponse({status: 200, type: SyncScanResponse})
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
    @HttpCode(200)
    @ApiResponse({status: 200, type: PingResponse})
    public async ping(): Promise<ServerResponse> {
        const pingDetails: PingScannerOutputParameters = await this.pingScannerService.execute();
        return ServerResponse.createSuccessResponse(pingDetails);
    }

    @Get('version')
    @HttpCode(200)
    @ApiResponse({status: 200, type: GetVersionResponse})
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
                const errorMessage: string = RequestValidationError.MULTIPART_FORM_EMPTY_MESSAGE();
                reject(RequestValidationError.create(errorMessage));
            }
        });
    }
}
