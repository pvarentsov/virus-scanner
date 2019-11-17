import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { RootModule } from '../module/RootModule';
import { Config } from '../../core/configuration';
import { CoreLogger } from '../../core/logger/CoreLogger';

export class ServerApplication {

    private readonly port: number = Config.API_PORT;

    private readonly host: string = Config.API_HOST;

    public static create(): ServerApplication {
        return new ServerApplication();
    }

    public async bootstrap(): Promise<void> {
        const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(
            RootModule,
            { logger: new CoreLogger() }
        );

        await app.listen(this.port, this.host);

        CoreLogger.log(`Server started on host: ${this.host}; port: ${this.port};`, ServerApplication.name);
    }

}
