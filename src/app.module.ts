import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './app/modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseInterceptor } from './app/common/response/response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ],
})
export class AppModule {}
