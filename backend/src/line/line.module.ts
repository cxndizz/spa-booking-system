import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LineClientService } from './services/line-client.service';
import { LineMessageService } from './services/line-message.service';
import { LineRichMenuService } from './services/line-rich-menu.service';
import { LineConversationService } from './services/line-conversation.service';
import { LineEventHandlerService } from './services/line-event-handler.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [
    LineClientService,
    LineMessageService,
    LineRichMenuService,
    LineConversationService,
    LineEventHandlerService,
  ],
  exports: [
    LineClientService,
    LineMessageService,
    LineRichMenuService,
    LineConversationService,
    LineEventHandlerService,
  ],
})
export class LineModule {}
