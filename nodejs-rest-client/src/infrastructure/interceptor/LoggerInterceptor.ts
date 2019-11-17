import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ServerResponse } from '../response';
import { Request } from 'express';
import { tap } from 'rxjs/operators';
import { CoreLogger } from '../../core/logger/CoreLogger';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {

    public intercept(context: ExecutionContext, next: CallHandler): Observable<ServerResponse> {
        const request: Request = context.switchToHttp().getRequest();

        const requestStartDate: number = Date.now();

        return next
            .handle()
            .pipe(
                tap(() => {
                    const requestFinishDate: number = Date.now();
                    const message: string = `Method: ${request.method}; Path: ${request.path}; SpentTime: ${requestFinishDate - requestStartDate}ms`;

                    CoreLogger.log(message, LoggerInterceptor.name);
                })
            );
    }
}
