import { Injectable, Inject } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import { USER_REPOSITORY } from '@biosstel/api-usuarios';
import type { IUserRepository } from '@biosstel/api-usuarios';
import type { ForgotPasswordCommand } from '../../commands/ForgotPassword.command';

@Injectable()
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand, { message: string }> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async handle(command: ForgotPasswordCommand): Promise<{ message: string }> {
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
