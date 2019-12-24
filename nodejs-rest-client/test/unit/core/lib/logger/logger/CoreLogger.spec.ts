import * as hookStd from 'hook-std';
import { CoreLogger } from '../../../../../../src/core/lib/logger';

type Message = {
    context  : string;
    pid      : number;
    level    : string;
    message  : string;
    timestamp: string
};

describe('CoreLogger', () => {

    describe(`log`, () => {

        const baseLogTestDescription: string =
            'When message is "Hello!" and context is not set, ' +
            'expect log with "info" level, "Hello!" message and "Global" context';

        it(baseLogTestDescription, async () => {

            const hookStdPromise: hookStd.HookPromise = hookStd.stdout((message: string) => {
                hookStdPromise.unhook();

                const messageObject: Message = JSON.parse(message);

                expect(messageObject.context).toBe('Global');
                expect(messageObject.pid).toBe(process.pid);
                expect(messageObject.level).toBe('info');
                expect(messageObject.message).toBe('Hello!');
                expect(typeof messageObject.timestamp === 'string').toBeTruthy();
            });

            CoreLogger.log('Hello!');

            await hookStdPromise;
        });

        const logWithCustomContextTestDescription: string =
            'When message is "Hello!" and context is "Greeting", ' +
            'expect log with "info" level, "Hello!" message and "Greeting" context';

        it(logWithCustomContextTestDescription, async () => {

            const hookStdPromise: hookStd.HookPromise = hookStd.stdout((message: string) => {
                hookStdPromise.unhook();

                const messageObject: Message = JSON.parse(message);

                expect(messageObject.context).toBe('Greeting');
                expect(messageObject.pid).toBe(process.pid);
                expect(messageObject.level).toBe('info');
                expect(messageObject.message).toBe('Hello!');
                expect(typeof messageObject.timestamp === 'string').toBeTruthy();
            });

            CoreLogger.log('Hello!', 'Greeting');

            await hookStdPromise;
        });

    });

});
