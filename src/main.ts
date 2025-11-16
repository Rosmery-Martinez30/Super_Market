// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    // Ajusta el origen a tu frontend o usa '*' temporalmente
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  };

  app.enableCors(corsOptions);

  // Habilite gg validación global con class-validator / class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimine propiedades no definidas en DTOs
      forbidNonWhitelisted: false, // true lanza error si llegan campos extra
      transform: true, // transforma payloads a los tipos definidos en DTOs
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
