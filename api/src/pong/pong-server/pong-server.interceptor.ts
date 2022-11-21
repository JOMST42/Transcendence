/*
https://docs.nestjs.com/interceptors#interceptors
*/

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  LoggerService,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PongServerInterceptor implements NestInterceptor {
  private logger: Logger = new Logger('PongInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // this.logger.debug('Before...');
    return next.handle();
    // return next.handle().pipe(tap(() => this.logger.debug(`After...`)));
  }
}
