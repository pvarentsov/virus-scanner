import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { RootModule } from '../module/RootModule';

export class ServerApplication {

    private readonly port: 3000;

    private readonly hostname: 'localhost';

    public static create(): ServerApplication {
        return new ServerApplication();
    }

    public async bootstrap(): Promise<void> {
        const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(RootModule);
        await app.listen(this.port, this.hostname);
    }

}
