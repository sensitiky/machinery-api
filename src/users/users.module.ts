import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/config/database.module';
import { UserService } from './users.service';
import { UserController } from './users.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
