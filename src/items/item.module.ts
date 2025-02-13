import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsService } from './item.service';
import { ItemsController } from './item.controller';
import { Item } from '../common/entities/item';
import { Seller } from '../common/entities/seller';
import { CloudinaryService } from './cloudinary.service';
import { User } from '../common/entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Seller, User])],
  providers: [ItemsService, CloudinaryService],
  controllers: [ItemsController],
  exports: [ItemsService],
})
export class ItemsModule {}
