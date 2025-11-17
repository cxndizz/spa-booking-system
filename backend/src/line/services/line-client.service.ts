import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  messagingApi,
  middleware,
  MiddlewareConfig,
} from '@line/bot-sdk';

@Injectable()
export class LineClientService implements OnModuleInit {
  private client: messagingApi.MessagingApiClient;
  private blobClient: messagingApi.MessagingApiBlobClient;
  private config: MiddlewareConfig;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const channelAccessToken = this.configService.get<string>(
      'LINE_CHANNEL_ACCESS_TOKEN',
    );
    const channelSecret = this.configService.get<string>('LINE_CHANNEL_SECRET');

    if (!channelAccessToken || !channelSecret) {
      console.warn(
        'LINE credentials not configured. Please set LINE_CHANNEL_ACCESS_TOKEN and LINE_CHANNEL_SECRET',
      );
      return;
    }

    // Initialize Messaging API client
    this.client = new messagingApi.MessagingApiClient({
      channelAccessToken,
    });

    // Initialize Blob client for file uploads (Rich Menu images)
    this.blobClient = new messagingApi.MessagingApiBlobClient({
      channelAccessToken,
    });

    // Configure middleware for webhook signature verification
    this.config = {
      channelSecret,
    };

    console.log('LINE Bot SDK initialized successfully');
  }

  getClient(): messagingApi.MessagingApiClient {
    if (!this.client) {
      throw new Error('LINE client not initialized');
    }
    return this.client;
  }

  getBlobClient(): messagingApi.MessagingApiBlobClient {
    if (!this.blobClient) {
      throw new Error('LINE blob client not initialized');
    }
    return this.blobClient;
  }

  getMiddlewareConfig(): MiddlewareConfig {
    if (!this.config) {
      throw new Error('LINE middleware config not initialized');
    }
    return this.config;
  }

  // Verify webhook signature
  getMiddleware() {
    return middleware(this.config);
  }
}
