import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { USER_REPOSITORY } from '@biosstel/api-usuarios';
import type { IUserRepository } from '@biosstel/api-usuarios';
import { ForgotPasswordCommand } from '../../commands/ForgotPassword.command';

@CommandHandler(ForgotPasswordCommand)
@Injectable()
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<{ message: string }> {
    const email = typeof command.email === 'string' ? command.email.trim() : '';
    if (email) {
      try {
        const user = await this.userRepository.findByEmail?.(email);
        if (user && process.env.NODE_ENV !== 'test') {
          console.info('[ForgotPassword] Request for existing email (mock: no email sent)');
        }
      } catch {
        // Ignore: same response either way
      }
    }
    return { message: 'Si el email existe, recibirás un enlace para restablecer la contraseña.' };
  }
}
