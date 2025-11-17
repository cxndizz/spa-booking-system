import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🏨 Spa Booking API is running successfully!';
  }

  getHealthCheck() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Spa Booking API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
