import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../common/entities/user';
import { Seller } from '../common/entities/seller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Seller])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
