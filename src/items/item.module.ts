import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsService } from './item.service';
import { ItemsController } from './item.controller';
import { Item } from '../common/entities/item';
import { Seller } from '../common/entities/seller';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Seller])],
  providers: [ItemsService],
  controllers: [ItemsController],
  exports: [ItemsService],
})
export class ItemsModule {}
