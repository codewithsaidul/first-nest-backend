import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // ✅ Reflector ইম্পোর্ট করুন
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from './response-message.decorator'; // ✅ ডেকোরেটরের কী ইম্পোর্ট করুন



export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}


@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> { // ✅ any ব্যবহার করা হলো কারণ রেসপন্সের গঠন ভিন্ন হতে পারে
    const responseMessage =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ??
      'Operation successful';

    return next.handle().pipe(
      map((data) => {
        // ✅ চেক করুন যে ডেটার সাথে মেটা অবজেক্ট আছে কিনা
        if (data && data.meta) {
          return {
            success: true,
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: responseMessage,
            meta: data.meta, // মেটা অবজেক্ট যুক্ত করুন
            data: data.data, // মূল ডেটা
          };
        }
        
        // যদি মেটা না থাকে, তবে আগের মতোই রেসপন্স দিন
        return {
          success: true,
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: responseMessage,
          data: data,
        };
      }),
    );
  }
}