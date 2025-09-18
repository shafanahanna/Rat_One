import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get DataSource from app
  const dataSource = app.get(DataSource);
  
  // Check database connection
  if (dataSource.isInitialized) {
    console.log('✅ Database connection established successfully');
  } else {
    console.error('❌ Failed to establish database connection');
  }
  
  // Enable CORS for frontend with enhanced configuration
  app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'admintoken', 'Admintoken', 'admin-token', 'Admin-Token'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // API prefix - commented out to avoid double prefixing with controller paths
  // app.setGlobalPrefix('api');
  
  await app.listen(4000);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
