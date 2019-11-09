import { IClamAVCommand } from '../command/IClamAVCommand';
import { Readable } from 'stream';
import * as net from 'net';
import { Socket } from 'net';
import { ClamAVCommandFactory } from '../command/factory/ClamAVCommandFactory';
import { ClamaAVCommandType } from '../command/types/ClamaAVCommandType';
import { ClamAVScanDetails } from './types/ClamAVScanDetails';
import { ClamAVPingDetails } from './types/ClamAVPingDetails';
import { ClamAVVersionDetails } from './types/ClamAVVersionDetails';
import { ClamAVClientResponseParser } from './parser/ClamAVClientResponseParser';

export class ClamAVClient {

    private readonly port: number;

    private readonly host: string;

    private readonly timeoutInMs: number;

    private readonly parsedCommand: string;

    private readonly inputData: { isFinished: boolean, stream: Readable } | undefined;

    private readonly commandResponseChunks: Buffer[];

    private constructor(port: number = 3310, host: string = 'localhost', timeoutInMs: number = 5000, command: IClamAVCommand) {
        this.port = port;
        this.host = host;
        this.timeoutInMs = timeoutInMs;
        this.parsedCommand = this.parseCommand(command);

        if (command.data) {
            this.inputData = { isFinished: false, stream: command.data };
        }

        this.commandResponseChunks = [];
    }

    public static async scanStream(stream: Readable): Promise<ClamAVScanDetails> {
        const command: IClamAVCommand = ClamAVCommandFactory.createCommand(ClamaAVCommandType.INSTREAM, stream);
        const client: ClamAVClient = new ClamAVClient(undefined, undefined, undefined, command);

        const responseMessage: string = await client.sendCommand();

        return ClamAVClientResponseParser.parseScanDetails(responseMessage);
    }

    public static async ping(): Promise<ClamAVPingDetails> {
        const command: IClamAVCommand = ClamAVCommandFactory.createCommand(ClamaAVCommandType.PING);
        const client: ClamAVClient = new ClamAVClient(undefined, undefined, undefined, command);

        const responseMessage: string = await client.sendCommand();

        return ClamAVClientResponseParser.parsePingDetails(responseMessage);
    }

    public static async getVersion(): Promise<ClamAVVersionDetails> {
        const command: IClamAVCommand = ClamAVCommandFactory.createCommand(ClamaAVCommandType.VERSION);
        const client: ClamAVClient = new ClamAVClient(undefined, undefined, undefined, command);

        const responseMessage: string = await client.sendCommand();

        return ClamAVClientResponseParser.parseVersionDetails(responseMessage);
    }

    private async sendCommand(): Promise<string> {
        return new Promise((resolve: ResolveCallback, reject: RejectCallback): void => {

            const connectTimer: NodeJS.Timeout = setTimeout(
                () => socket.destroy(new Error('Timeout connecting to server')),
                this.timeoutInMs
            );

            const socketOnConnectListener: () => void = (): void => {
                socket.write(this.parsedCommand);

                const inputData: { isFinished: boolean, stream: Readable } | undefined = this.inputData;

                if (inputData) {
                    inputData.stream.addListener('end', () => {
                        inputData.isFinished = true;
                        inputData.stream.destroy();
                    });

                    inputData.stream.addListener('error', reject);

                    inputData.stream.pipe(socket);
                }
            };

            const socketOnDataListener: (chunk: Buffer) => void = (chunk: Buffer): void => {
                clearTimeout(connectTimer);

                if (this.inputData && !this.inputData.stream.isPaused()) {
                    this.inputData.stream.pause();
                }

                this.commandResponseChunks.push(chunk);
            };

            const socketOnEndListener: () => void = (): void => {
                clearTimeout(connectTimer);

                const commandResultBuffer: Buffer = Buffer.concat(this.commandResponseChunks);

                const inputData: { isFinished: boolean, stream: Readable } | undefined = this.inputData;

                if (inputData && !inputData.isFinished) {
                    inputData.stream.destroy();
                    reject(new Error('Scan aborted. Reply from server: ' + commandResultBuffer));
                }

                resolve(commandResultBuffer.toString('utf-8'));
            };

            const socket: Socket = net
                .createConnection({ host: this.host, port: this.port })
                .setTimeout(this.timeoutInMs);

            socket.addListener('connect', socketOnConnectListener);
            socket.addListener('data', socketOnDataListener);
            socket.addListener('end', socketOnEndListener);
            socket.addListener('error', reject);
        });
    }

    private parseCommand(command: IClamAVCommand): string {
        let parsedCommand: string = command.name;

        if (command.prefix) {
            parsedCommand = command.prefix + parsedCommand;
        }
        if (command.postfix) {
            parsedCommand = parsedCommand + command.postfix;
        }

        return parsedCommand;
    }

}
