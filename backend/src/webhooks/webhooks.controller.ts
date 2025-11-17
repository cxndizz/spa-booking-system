import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('line')
  @HttpCode(HttpStatus.OK)
  async handleLineWebhook(@Body() webhookData: any) {
    // Verify LINE webhook signature here if needed
    // TODO: Add LINE signature verification
    
    await this.webhooksService.handleLineWebhook(webhookData);
    return { status: 'ok' };
  }

  @Post('omise')
  @HttpCode(HttpStatus.OK)
  async handleOmiseWebhook(@Body() webhookData: any) {
    // Verify Omise webhook signature here if needed
    // TODO: Add Omise signature verification
    
    await this.webhooksService.handleOmiseWebhook(webhookData);
    return { status: 'ok' };
  }
}