/**
 * @biosstel/api-auth - NestJS Module
 * CQRS: Login via LoginCommand + UserLoggedIn event.
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@biosstel/api-usuarios';
import { AuthController } from './infrastructure/api/auth.controller';
import { AuthManagementUseCase } from './application/use-cases';
import { AuthService } from './auth.service';
import { LoginHandler } from './application/handlers/Login.handler';
import { AuthMediatorRegistration } from './application/AuthMediatorRegistration';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const accessExpires = config.get<string>('JWT_ACCESS_EXPIRES_IN') || config.get<string>('JWT_EXPIRES_IN') || '15m';
        return {
          secret: config.get<string>('JWT_SECRET') || 'dev-secret-change-in-production',
          signOptions: { expiresIn: accessExpires as `${number}${'s' | 'm' | 'h' | 'd'}` },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthManagementUseCase,
    AuthService,
    LoginHandler,
    AuthMediatorRegistration,
  ],
  exports: [AuthManagementUseCase, AuthService],
})
export class AuthModule {}
