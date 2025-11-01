import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

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

