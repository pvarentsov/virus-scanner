import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorHandlerInterceptor } from '../../interceptor/ErrorHandlerInterceptor';
import { LoggerInterceptor } from '../../interceptor/LoggerInterceptor';

@Module({
    providers: [
        {
            provide : APP_FILTER,
            useClass: ErrorHandlerInterceptor,
        },
        {
            provide : APP_INTERCEPTOR,
            useClass: LoggerInterceptor,
        },
    ]
})
export class InfrastructureModule {}
