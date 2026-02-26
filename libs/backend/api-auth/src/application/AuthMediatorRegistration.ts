import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Mediator } from '@biosstel/api-shared';
import { LoginCommand } from './cqrs/commands/Login.command';
import { RefreshTokenCommand } from './cqrs/commands/RefreshToken.command';
import { ForgotPasswordCommand } from './cqrs/commands/ForgotPassword.command';
import { LoginHandler } from './cqrs/handlers/Login.handler';
import { RefreshTokenHandler } from './cqrs/handlers/RefreshToken.handler';
import { ForgotPasswordHandler } from './cqrs/handlers/ForgotPassword.handler';
import { GetMeQuery } from './cqrs/queries/GetMe.query';
import { GetMeHandler } from './cqrs/handlers/GetMe.handler';

@Injectable()
export class AuthMediatorRegistration implements OnModuleInit {
  constructor(private readonly mediator: Mediator) {}

  onModuleInit(): void {
    this.mediator.registerCommandHandler(LoginCommand, LoginHandler);
    this.mediator.registerCommandHandler(RefreshTokenCommand, RefreshTokenHandler);
    this.mediator.registerCommandHandler(ForgotPasswordCommand, ForgotPasswordHandler);
    this.mediator.registerQueryHandler(GetMeQuery, GetMeHandler);
  }
}
