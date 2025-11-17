import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // CORS
  const frontendUrls = configService.get<string>('FRONTEND_URL', 'http://localhost:3001').split(',');
  app.enableCors({
    origin: frontendUrls,
    credentials: true,
  });
  
  // API prefix
  app.setGlobalPrefix('api/v1');
  
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  
  console.log(`🚀 Spa Booking API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/v1`);
}

bootstrap();
