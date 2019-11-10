import { Readable } from 'stream';
import * as net from 'net';
import { Socket } from 'net';
import { ClamAVCommandFactory } from '../command/factory/ClamAVCommandFactory';
import { ClamaAVCommandType } from '../command/types/ClamaAVCommandType';
import { ClamAVScanDetails } from './types/ClamAVScanDetails';
import { ClamAVPingDetails } from './types/ClamAVPingDetails';
import { ClamAVVersionDetails } from './types/ClamAVVersionDetails';
import { ClamAVClientResponseParser } from './parser/ClamAVClientResponseParser';
import { ClamAVClientError } from './errors/ClamAVClientError';
import { ClamAVConnectionOptions } from './types/ClamAVConnectionOptions';
import { ClamAVCommand } from '../command/types/ClamAVCommand';

export class ClamAVClient {

    private readonly host: string;

    private readonly port: number;

    private readonly timeoutInMs: number;

    private readonly parsedCommand: string;

    private readonly inputData: { isFinished: boolean, stream: Readable } | undefined;

    private readonly commandResponseChunks: Buffer[];

    private constructor(host: string, port: number, timeoutInMs: number | undefined, command: ClamAVCommand) {
        this.host = host;
        this.port = port;
        this.timeoutInMs = timeoutInMs || ClamAVClient.DEFAULT_TIMEOUT_IN_MS;
        this.parsedCommand = ClamAVClient.parseCommand(command);

        if (command.data) {
            this.inputData = { isFinished: false, stream: command.data };
        }

        this.commandResponseChunks = [];
    }

    public static async scanStream(stream: Readable, options: ClamAVConnectionOptions): Promise<ClamAVScanDetails> {
        const command: ClamAVCommand = ClamAVCommandFactory.createCommand(ClamaAVCommandType.INSTREAM, stream);
        const client: ClamAVClient = new ClamAVClient(options.host, options.port, options.timeoutInMs, command);

        const responseMessage: string = await client.sendCommand();

        return ClamAVClientResponseParser.parseScanDetails(responseMessage);
    }

    public static async ping(options: ClamAVConnectionOptions): Promise<ClamAVPingDetails> {
        const command: ClamAVCommand = ClamAVCommandFactory.createCommand(ClamaAVCommandType.PING);
        const client: ClamAVClient = new ClamAVClient(options.host, options.port, options.timeoutInMs, command);

        const responseMessage: string = await client.sendCommand();

        return ClamAVClientResponseParser.parsePingDetails(responseMessage);
    }

    public static async getVersion(options: ClamAVConnectionOptions): Promise<ClamAVVersionDetails> {
        const command: ClamAVCommand = ClamAVCommandFactory.createCommand(ClamaAVCommandType.VERSION);
        const client: ClamAVClient = new ClamAVClient(options.host, options.port, options.timeoutInMs, command);

        const responseMessage: string = await client.sendCommand();

        return ClamAVClientResponseParser.parseVersionDetails(responseMessage);
    }

    private async sendCommand(): Promise<string> {
        return new Promise((resolve: (value: string) => void, reject: (error: Error) => void): void => {

            const connectTimer: NodeJS.Timeout = setTimeout(
                () => socket.destroy(ClamAVClientError.createConnectionTimedOutError()),
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
                    reject(ClamAVClientError.createScanAbortedError(commandResultBuffer.toString('utf-8')));
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

    private static parseCommand(command: ClamAVCommand): string {
        let parsedCommand: string = command.name;

        if (command.prefix) {
            parsedCommand = command.prefix + parsedCommand;
        }
        if (command.postfix) {
            parsedCommand = parsedCommand + command.postfix;
        }

        return parsedCommand;
    }

    private static readonly DEFAULT_TIMEOUT_IN_MS: number = 5000;

}
