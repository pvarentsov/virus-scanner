import { Readable } from 'stream';

export type ClamAVCommand = {

    name: string;

    prefix?: string;

    postfix?: string;

    data?: Readable;

};
