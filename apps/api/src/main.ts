import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createRouteHandler } from 'uploadthing/express';
import { uploadRouter } from './uploadthing/upload-router';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  app.setGlobalPrefix('api') // /api/..
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    }),
  )
  app.use(
    '/api/uploadthing',
    createRouteHandler({
      router: uploadRouter,
      config: {
        token: process.env.UPLOADTHING_TOKEN!,
      },
    }),
  );
  const PORT = process.env.PORT ?? 3000
  await app.listen(PORT);

  console.log('Server running on post: ', PORT);

}
void bootstrap();
