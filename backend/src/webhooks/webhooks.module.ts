import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { LineModule } from '../line/line.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [LineModule, PrismaModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
  exports: [WebhooksService],
})
export class WebhooksModule {}