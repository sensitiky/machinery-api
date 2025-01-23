import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './config/database.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ItemModule } from './items/item.module';

@Module({
  imports: [UsersModule, DatabaseModule, AuthenticationModule, ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
