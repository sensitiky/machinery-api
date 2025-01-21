import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/config/database.module';
import { UserService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
