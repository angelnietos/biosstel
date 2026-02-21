import { Injectable, OnModuleInit } from '@nestjs/common';
import { Mediator } from '@biosstel/api-shared';
import { LoginCommand } from './commands/Login.command';
import { LoginHandler } from './handlers/Login.handler';

@Injectable()
export class AuthMediatorRegistration implements OnModuleInit {
  constructor(private readonly mediator: Mediator) {}

  onModuleInit(): void {
    this.mediator.registerCommandHandler(LoginCommand, LoginHandler);
  }
}
