import { ServerApplication } from './infrastructure/server/ServerApplication';
import { Config } from './core/configuration';
import { CoreLogger } from './core/lib/logger';
import { fork, isMaster, on, Worker } from 'cluster';
import { cpus } from 'os';

(async (): Promise<void> => {
    if (!Config.API_CLUSTER_ENABLE) {
        await runApplication();

    } else {
        await spawnApplicationWorkers();
        await runApplicationWorkers();
    }
})();

async function runApplication(): Promise<void> {
    const serverApplication: ServerApplication = ServerApplication.create();
    await serverApplication.bootstrap();
}

async function spawnApplicationWorkers(): Promise<void> {
    if (isMaster) {
        const cpuCount: number = cpus().length;

        for (let workerIndex: number = 0; workerIndex < cpuCount; workerIndex++) {
            fork();
        }

        on('exit', (worker: Worker, code: number, signal: string): void => {
            const codeMessagePart: string = `code: ${code || 'unknown'}`;
            const signalMessagePart: string = `signal: ${signal || 'unknown'}`;

            const errorMassage: string =
                `Worker on PID: ${worker.process.pid} ` +
                `is down with ${codeMessagePart}; ${signalMessagePart}`;

            CoreLogger.error(errorMassage);

            fork();
        });
    }
}

async function runApplicationWorkers(): Promise<void> {
    if (!isMaster) {
        await runApplication();
    }
}
