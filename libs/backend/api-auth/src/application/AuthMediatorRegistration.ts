import { Injectable, type OnModuleInit } from '@nestjs/common';
import type { Mediator } from '@biosstel/api-shared';
import { LoginCommand } from './cqrs/commands/Login.command';
import { RefreshTokenCommand } from './cqrs/commands/RefreshToken.command';
import { ForgotPasswordCommand } from './cqrs/commands/ForgotPassword.command';
import { LogoutCommand } from './cqrs/commands/Logout.command';
import { LoginHandler, RefreshTokenHandler, ForgotPasswordHandler, LogoutHandler } from './cqrs/handlers/commands';
import { GetMeQuery, GetMeHandler } from './cqrs';


@Injectable()
export class AuthMediatorRegistration implements OnModuleInit {
  constructor(private readonly mediator: Mediator) {}

  onModuleInit(): void {
    this.mediator.registerCommandHandler(LoginCommand, LoginHandler);
    this.mediator.registerCommandHandler(RefreshTokenCommand, RefreshTokenHandler);
    this.mediator.registerCommandHandler(ForgotPasswordCommand, ForgotPasswordHandler);
    this.mediator.registerCommandHandler(LogoutCommand, LogoutHandler);
    this.mediator.registerQueryHandler(GetMeQuery, GetMeHandler);
  }
}
