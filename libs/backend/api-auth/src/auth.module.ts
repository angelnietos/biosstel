/**
 * @biosstel/api-auth - NestJS Module
 * CQRS: Login, RefreshToken, ForgotPassword commands + GetMe query.
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@biosstel/api-usuarios';
import { AuthController } from './infrastructure/api';
import { AuthManagementUseCase } from './application/use-cases';
import { LoginHandler, GetMeHandler, RefreshTokenHandler, ForgotPasswordHandler, LogoutHandler } from './application/cqrs';
import { AuthMediatorRegistration } from './application/AuthMediatorRegistration';
import { I_AUTH_REPOSITORY } from './domain/repositories';
import { PostgresAuthRepository, AUTH_POSTGRES_ENTITIES } from './infrastructure/persistence';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    TypeOrmModule.forFeature([...AUTH_POSTGRES_ENTITIES]),
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
    { provide: I_AUTH_REPOSITORY, useClass: PostgresAuthRepository },
    PostgresAuthRepository,
    LoginHandler,
    GetMeHandler,
    RefreshTokenHandler,
    ForgotPasswordHandler,
    LogoutHandler,
    AuthMediatorRegistration,
  ],
  exports: [AuthManagementUseCase, I_AUTH_REPOSITORY],
})
export class AuthModule {}
