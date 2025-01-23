import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user';
import { Item } from '@/src/common/entities/item';
import { Role } from '@/entities/role';

const entities = [User, Role, Item];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST', '0.0.0.0');
        const port = parseInt(configService.get<string>('DB_PORT', '5432'), 10);
        const database = configService.get<string>('DB_NAME', 'machinery');
        const username = configService.get<string>('DB_USERNAME', 'postgres');
        const password = configService.get<string>('DB_PASSWORD', '2010');

        return {
          type: 'postgres',
          host: host,
          port: port,
          database: database,
          username: username,
          password: password,
          entities: entities,
          logging: true,
          ssl: false,
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
