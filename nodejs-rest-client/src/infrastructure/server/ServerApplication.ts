import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { RootModule } from '../module/RootModule';

export class ServerApplication {

    private readonly port: number = 3005;

    private readonly hostname: string = '0.0.0.0';

    public static create(): ServerApplication {
        return new ServerApplication();
    }

    public async bootstrap(): Promise<void> {
        const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(RootModule);
        await app.listen(this.port, this.hostname);

        console.log(`\nServer started on port: ${this.port}; PID: ${process.pid}`);
    }

}
