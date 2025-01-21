import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/config/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AuthenticationModule {}
