import { ServerApplication } from './server/ServerApplication';

(async (): Promise<void> => {
    const serverApplication: ServerApplication = ServerApplication.create();
    await serverApplication.bootstrap();
})();
