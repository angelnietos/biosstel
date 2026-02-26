/**
 * Input Port: lo que el módulo auth ofrece al mundo externo.
 * El Controller/Mediator invoca; el Use Case (o Handler) implementa.
 */
import type { LoginResult } from '../../cqrs/commands/Login.command';

export interface IAuthManagement {
  login(input: { email: string; password: string }): Promise<LoginResult>;
}
