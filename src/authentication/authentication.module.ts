import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/config/database.module';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [],
})
export class AuthenticationModule {}
