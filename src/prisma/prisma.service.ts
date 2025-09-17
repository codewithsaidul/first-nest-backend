import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // অ্যাপ্লিকেশন শুরু হওয়ার সাথে সাথে এই মেথডটি কল হবে
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('*** DB connection successful!!');
    } catch (error) {
      console.error('*** DB connection failed!', error);
      // এখানে process.exit না করে NestJS কে error throw করতে দিন
      throw error;
    }
  }

  // অ্যাপ্লিকেশন বন্ধ হওয়ার ঠিক আগে এই মেথডটি কল হবে
  async onModuleDestroy() {
    console.warn('🔄 Disconnecting from database...');
    await this.$disconnect();
    console.log('*** DB connection closed.');
  }
}