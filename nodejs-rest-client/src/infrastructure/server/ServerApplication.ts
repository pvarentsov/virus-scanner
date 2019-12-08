import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { RootModule } from '../module/RootModule';
import { Config } from '../../core/configuration';
import { CoreLogger } from '../../core/lib/logger';
import { DocumentBuilder, SwaggerBaseConfig, SwaggerDocument, SwaggerModule } from '@nestjs/swagger';

export class ServerApplication {

    private readonly port: number = Config.API_PORT;

    private readonly host: string = Config.API_HOST;

    public static create(): ServerApplication {
        return new ServerApplication();
    }

    public async bootstrap(): Promise<void> {
        const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(
            RootModule,
            { logger: Config.API_CLUSTER_ENABLE ? false : new CoreLogger() }
        );

        this.buildAPIDocumentation(app);
        this.log();

        await app.listen(this.port, this.host);
    }

    public buildAPIDocumentation(app: NestExpressApplication): void {
        const apiHost: string = Config.API_DOCUMENTATION_HOST;
        const apiBasePath: string = Config.API_BASE_PATH;

        const title: string = 'Virus Scanner';
        const description: string = 'Virus Scanner API description';

        const options: SwaggerBaseConfig = new DocumentBuilder()
            .setTitle(title)
            .setDescription(description)
            .setHost(apiHost)
            .build();

        const document: SwaggerDocument = SwaggerModule.createDocument(app, options);

        SwaggerModule.setup(`${apiBasePath}/documentation`, app, document);
    }

    public log(): void {
        CoreLogger.log(`Server started on host: ${this.host}; port: ${this.port};`, ServerApplication.name);
    }

}
