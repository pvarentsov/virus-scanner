import { Readable } from 'stream';

export interface IClamAVCommand {

    name: string;

    prefix?: string;

    postfix?: string;

    data?: Readable;

}
