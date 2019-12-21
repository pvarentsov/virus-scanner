import { ClamaAVCommandType } from '../../../../../../../src/core/lib/clamav/command/types/ClamaAVCommandType';
import { ClamAVCommandFactory } from '../../../../../../../src/core/lib/clamav/command/factory/ClamAVCommandFactory';
import { ClamAVCommand } from '../../../../../../../src/core/lib/clamav/command/types/ClamAVCommand';
import { Readable } from 'stream';
import {
    ClamAVCommandFactoryError
} from '../../../../../../../src/core/lib/clamav/command/factory/errors/ClamAVCommandFactoryError';
import { MockBuilder } from '../../../../../../.helper/MockBuilder';

describe('ClamAVCommandFactory', () => {

    describe(`Create PING command`, () => {

        it('When commandType is PING and data is not set, expect PING ClamAVCommand object', () => {
            const expectedCommand: ClamAVCommand = {
                name   : ClamaAVCommandType.PING,
                prefix : undefined,
                postfix: undefined,
                data   : undefined
            };

            const command: ClamAVCommand = ClamAVCommandFactory.createCommand(ClamaAVCommandType.PING);

            expect(command).toEqual(expectedCommand);
        });

        it('When commandType is PING and data is set, expect it throws ClamAVCommandFactoryError', () => {
            const expectedError: ClamAVCommandFactoryError = ClamAVCommandFactoryError.createCommandValidationError({
                commandType: ClamaAVCommandType.PING,
                needData   : false
            });

            const mockReadStream: Readable = MockBuilder.createMockReadStream();
            
            const createCommandFunction: () => void = (): void => {
                ClamAVCommandFactory.createCommand(ClamaAVCommandType.PING, mockReadStream);
            };
            
            expect(createCommandFunction).toThrow(expectedError);
        });

    });

    describe(`Create VERSION command`, () => {

        it('When commandType is VERSION and data is not set, expect VERSION ClamAVCommand object', () => {
            const expectedCommand: ClamAVCommand = {
                name   : ClamaAVCommandType.VERSION,
                prefix : undefined,
                postfix: undefined,
                data   : undefined
            };

            const command: ClamAVCommand = ClamAVCommandFactory.createCommand(ClamaAVCommandType.VERSION);

            expect(command).toEqual(expectedCommand);
        });

        it('When commandType is VERSION and data is set, expect it throws ClamAVCommandFactoryError', () => {
            const expectedError: ClamAVCommandFactoryError = ClamAVCommandFactoryError.createCommandValidationError({
                commandType: ClamaAVCommandType.VERSION,
                needData   : false
            });

            const mockReadStream: Readable = MockBuilder.createMockReadStream();

            const createCommandFunction: () => void = (): void => {
                ClamAVCommandFactory.createCommand(ClamaAVCommandType.VERSION, mockReadStream);
            };

            expect(createCommandFunction).toThrow(expectedError);
        });

    });

    describe(`Create INSTREAM command`, () => {

        it('When commandType is INSTREAM and data is set, expect INSTREAM ClamAVCommand object', () => {
            const mockReadStream: Readable = MockBuilder.createMockReadStream();

            const command: ClamAVCommand = ClamAVCommandFactory.createCommand(
                ClamaAVCommandType.INSTREAM,
                mockReadStream
            );

            expect(command.name).toBe(ClamaAVCommandType.INSTREAM);
            expect(command.prefix).toBe('z');
            expect(command.postfix).toBe('\0');
            expect(command.data).toBeInstanceOf(Readable);
        });

        it('When commandType is INSTREAM and data is not set, expect it throws ClamAVCommandFactoryError', () => {
            const expectedError: ClamAVCommandFactoryError = ClamAVCommandFactoryError.createCommandValidationError({
                commandType: ClamaAVCommandType.INSTREAM,
                needData   : true
            });

            const createCommandFunction: () => void = (): void => {
                ClamAVCommandFactory.createCommand(ClamaAVCommandType.INSTREAM);
            };

            expect(createCommandFunction).toThrow(expectedError);
        });

    });

});
