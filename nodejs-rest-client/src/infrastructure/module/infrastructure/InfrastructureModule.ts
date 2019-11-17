import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ErrorHandler } from '../../server/interceptor/ErrorHandler';

@Module({
    providers: [
        {
            provide : APP_FILTER,
            useClass: ErrorHandler,
        },
    ]
})
export class InfrastructureModule {}
