import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  let app: INestApplication;

  try {
    app = await NestFactory.create(AppModule);

    // ✅ ধাপ ১: NestJS-কে শাটডাউন সিগন্যালের জন্য প্রস্তুত করা
    // এটি NestJS-এর নিজের লাইফসাইকেল মেথডগুলোকে (যেমন onModuleDestroy) চালু করে
    app.enableShutdownHooks();

    // ---- আপনার Express কোডের মতো সব ধরনের Event হ্যান্ডেল করা ----

    // ২. সিগন্যাল হ্যান্ডলিং (Ctrl+C বা সার্ভার কিল সিগন্যালের জন্য)
    process.on('SIGINT', async () => {
      console.warn('🔄 Received SIGINT, shutting down gracefully...');
      await shutdown(app);
    });

    process.on('SIGTERM', async () => {
      console.warn('🔄 Received SIGTERM, shutting down gracefully...');
      await shutdown(app);
    });

    // ৩. কোডে ধরা পড়েনি এমন সব Exception হ্যান্ডলিং
    process.on('uncaughtException', async (error: Error) => {
      console.error('💥 Uncaught Exception:', error);
      await shutdown(app, 1);
    });

    // ৪. কোডে ধরা পড়েনি এমন Promise Rejection হ্যান্ডলিং
    process.on('unhandledRejection', async (reason: any, promise: Promise<any>) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      await shutdown(app, 1);
    });

    //-------------------------------------------------------------

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true, // ✅ এই অপশনটি 'true'/'false' স্ট্রিংকে বুলিয়ানে রূপান্তর করে
        },
        whitelist: true,
      }),
    );
    app.setGlobalPrefix('/api/v1');

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`🚀 Server is running on port ${port}`);
  } catch (error) {
    console.error(`❌ Error during server startup:`, error);
    process.exit(1);
  }
}

/**
 * অ্যাপ্লিকেশনটি সুন্দরভাবে বন্ধ করার জন্য একটি ফাংশন
 * @param app NestJS অ্যাপ্লিকেশন ইনস্ট্যান্স
 * @param exitCode প্রসেস থেকে বের হওয়ার কোড (0 = success, 1 = error)
 */
async function shutdown(app: INestApplication, exitCode: number = 0) {
  if (app) {
    await app.close();
    console.log('✅ Server shutdown complete.');
  }
  process.exit(exitCode);
}

(async () => {
  await bootstrap();
})();
