import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation Pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:5000',
      'https://port-next-gdgoc-fe-mhfzsi18c2d778ef.sel3.cloudtype.app/',
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

