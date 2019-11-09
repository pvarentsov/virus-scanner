import { ClamaAVCommandType } from '../types/ClamaAVCommandType';
import { Readable, Transform } from 'stream';
import { IClamAVCommand } from '../IClamAVCommand';
import { ClamAVCommandFactoryError } from './error/ClamAVCommandFactoryError';
import { ClamAVCommandDataTransformer } from '../data-transformer/ClamAVCommandDataTransformer';

export class ClamAVCommandFactory {

    private readonly commandType: ClamaAVCommandType;

    private readonly commandRule: ClamAVCommandRule;

    private readonly commandPrefix: string | undefined;

    private readonly commandPostfix: string | undefined;

    private readonly data: Readable | undefined;

    private constructor(type: ClamaAVCommandType, data?: Readable) {
        this.commandType = type;
        this.commandRule = ClamAVCommandFactory.findCommandRule(this.commandType);

        this.data = data;

        if (this.commandRule.needPrefix) {
            this.commandPrefix = ClamAVCommandFactory.commandPrefix;
        }
        if (this.commandRule.needPostfix) {
            this.commandPostfix = ClamAVCommandFactory.commandPostfix;
        }
    }

    public static createCommand(commandType: ClamaAVCommandType, data?: Readable): IClamAVCommand {
        const commandFactory: ClamAVCommandFactory = new ClamAVCommandFactory(commandType, data);
        commandFactory.validateCommand();

        const command: IClamAVCommand = {
            name   : commandType,
            prefix : commandFactory.commandPrefix,
            postfix: commandFactory.commandPostfix,
            data   : ClamAVCommandFactory.transformData(commandType, data)
        };

        return command;
    }

    private validateCommand(): void {
        if (!this.data && this.commandRule.needData) {
            throw ClamAVCommandFactoryError.createCommandValidationError({ commandType: this.commandType, needData: true });
        }
        if (this.data && !this.commandRule.needData) {
            throw ClamAVCommandFactoryError.createCommandValidationError({ commandType: this.commandType, needData: false });
        }
    }

    private static findCommandRule(type: ClamaAVCommandType): ClamAVCommandRule {
        const rule: ClamAVCommandRule | undefined = ClamAVCommandFactory.commandRules[type];

        if (!rule) {
            throw ClamAVCommandFactoryError.createUnknownCommandError(type);
        }

        return rule;
    }

    private static transformData(commandType: ClamaAVCommandType, data?: Readable): Readable | undefined {
        let resultData: Readable | undefined;

        if (data instanceof Readable) {
            resultData = data;

            const transformer: (() => Transform) | undefined = ClamAVCommandFactory.dataTransformers[commandType];

            if (transformer) {
                resultData = data.pipe(transformer());
            }
        }

        return resultData;
    }

    private static readonly commandPrefix: string = 'z';

    private static readonly commandPostfix: string = '\0';

    private static readonly commandRules: ClamAVCommandRules = {
        [ClamaAVCommandType.PING]: {
            needPrefix : false,
            needPostfix: false,
            needData   : false,
        },

        [ClamaAVCommandType.VERSION]: {
            needPrefix : false,
            needPostfix: false,
            needData   : false,
        },

        [ClamaAVCommandType.INSTREAM]: {
            needPrefix : true,
            needPostfix: true,
            needData   : true,
        },
    };

    private static readonly dataTransformers: ClamAVDataTransformers = {
        [ClamaAVCommandType.INSTREAM]: ClamAVCommandDataTransformer.INSTREAM,
    };

}

type ClamAVCommandRule = { needPrefix: boolean, needPostfix: boolean, needData: boolean };

type ClamAVCommandRules = { [command: string]: ClamAVCommandRule };

type ClamAVDataTransformers = { [command: string]: () => Transform };
