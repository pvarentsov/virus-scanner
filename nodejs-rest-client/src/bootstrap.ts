import './env';
import { ServerApplication } from './infrastructure/server/ServerApplication';

(async (): Promise<void> => {
    const serverApplication: ServerApplication = ServerApplication.create();
    await serverApplication.bootstrap();
})();
