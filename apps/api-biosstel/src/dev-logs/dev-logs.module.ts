import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FrontendLogEntity } from './frontend-log.entity';
import { DevLogsService } from './dev-logs.service';
import { DevLogsController } from './dev-logs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FrontendLogEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'dev-secret-change-in-production'),
        signOptions: { expiresIn: config.get('JWT_ACCESS_EXPIRES_IN', '15m') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DevLogsController],
  providers: [DevLogsService],
  exports: [DevLogsService],
})
export class DevLogsModule {}
