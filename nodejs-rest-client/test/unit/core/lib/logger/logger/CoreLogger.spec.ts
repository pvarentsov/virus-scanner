import * as hookStd from 'hook-std';
import { CoreLogger } from '../../../../../../src/core/lib/logger';

type Message = {
    context  : string;
    pid      : number;
    level    : string;
    message  : string;
    timestamp: string;
    trace?   : string;
};

describe('CoreLogger', () => {

    describe(`log`, () => {

        const baseLogTestDescription: string =
            'When message is "Hello!" and context is not set, ' +
            'expect log with "info" level, "Hello!" message and "Global" context';

        it(baseLogTestDescription, async () => {
            await masterTest('log', 'Hello!');
        });

        const logWithCustomContextTestDescription: string =
            'When message is "Hello!" and context is "Greeting", ' +
            'expect log with "info" level, "Hello!" message and "Greeting" context';

        it(logWithCustomContextTestDescription, async () => {
            await masterTest('log', 'Hello!', 'Greeting');
        });

    });

    describe(`error`, () => {

        const baseErrorTestDescription: string =
            'When message is "Internal Error!" and context is not set, ' +
            'expect log with "error" level, "Internal Error!" message and "Global" context';

        it(baseErrorTestDescription, async () => {
            await masterTest('error', 'Internal Error!');
        });

        const errorWithCustomContextAndStackTraceTestDescription: string =
            'When message is "Internal Error!", context is "InternalError" and trace is set, ' +
            'expect log with "error" level, "Internal Error!" message, "InternalError" context and stack trace';

        it(errorWithCustomContextAndStackTraceTestDescription, async () => {
            const error: Error = new Error('Internal Error!');
            await masterTest('error', 'Internal Error!', 'InternalError', error.stack);
        });

    });

    describe(`warn`, () => {

        const baseWarnTestDescription: string =
            'When message is "Warning!" and context is not set, ' +
            'expect log with "warn" level, "Warning!" message and "Global" context';

        it(baseWarnTestDescription, async () => {
            await masterTest('warn', 'Warning!');
        });

        const warnWithCustomContextTestDescription: string =
            'When message is "Warning!" and context is "Warning", ' +
            'expect log with "warn" level, "Warning!" message and "Warning" context';

        it(warnWithCustomContextTestDescription, async () => {
            await masterTest('warn', 'Warning!', 'Warning');
        });

    });

    describe(`debug`, () => {

        const baseDebugTestDescription: string =
            'When message is "Debug!" and context is not set, ' +
            'expect log with "debug" level, "Debug!" message and "Global" context';

        it(baseDebugTestDescription, async () => {
            await masterTest('debug', 'Debug!');
        });

        const debugWithCustomContextTestDescription: string =
            'When message is "Debug!" and context is "Debug", ' +
            'expect log with "debug" level, "Debug!" message and "Debug" context';

        it(debugWithCustomContextTestDescription, async () => {
            await masterTest('debug', 'Debug!', 'Debug');
        });

    });

    describe(`verbose`, () => {

        const baseVerboseTestDescription: string =
            'When message is "Verbose!" and context is not set, ' +
            'expect log with "verbose" level, "Verbose!" message and "Global" context';

        it(baseVerboseTestDescription, async () => {
            await masterTest('verbose', 'Verbose!');
        });

        const verboseWithCustomContextTestDescription: string =
            'When message is "Verbose!" and context is "Verbose", ' +
            'expect log with "verbose" level, "Verbose!" message and "Verbose" context';

        it(verboseWithCustomContextTestDescription, async () => {
            await masterTest('verbose', 'Verbose!', 'Verbose');
        });

    });

});

async function masterTest(
    method: keyof CoreLogger,
    message: string,
    context?: string,
    trace?: string

): Promise<void> {
    const expectedLevel: string = method !== 'log' ? method : 'info';
    const expectedContext: string = context || 'Global';
    const expectedMessage: string = message;
    const expectedPid: number = process.pid;
    const expectedTrace: string | undefined = trace;

    const hookStdPromise: hookStd.HookPromise = hookStd.stdout((receivedMessage: string) => {
        hookStdPromise.unhook();

        const messageObject: Message = JSON.parse(receivedMessage);
        const logDate: Date = new Date(Date.parse(messageObject.timestamp));

        expect(messageObject.context).toBe(expectedContext);
        expect(messageObject.pid).toBe(expectedPid);
        expect(messageObject.level).toBe(expectedLevel);
        expect(messageObject.message).toBe(expectedMessage);
        expect(messageObject.trace).toBe(expectedTrace);
        expect(logDate).toBeInstanceOf(Date);
    });

    const logger: CoreLogger = new CoreLogger();

    if (method === 'error') {
        logger[method](message, trace, context);
    } else {
        logger[method](message, context);
    }

    await hookStdPromise;
}
