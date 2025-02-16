import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const logger = new ConsoleLogger();
  const port = 4000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    allowedHeaders: ['POST', 'PUT', 'PATCH', 'GET', 'UPDATE', 'DELETE'],
  });
  await app.listen(process.env.PORT ?? port);
  logger.log(`api running on port: ${port}`);
}
bootstrap();
