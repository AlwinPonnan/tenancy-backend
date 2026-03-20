import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Status } from '../enums/status.enum';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (response?.data !== undefined) {
            return {
            status: Status.SUCCESS,
            message: response.message,
            data: response.data,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          status: Status.SUCCESS,
          data: response,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
