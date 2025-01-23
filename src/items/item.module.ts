import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/config/database.module';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
