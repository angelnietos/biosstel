import type { ICommand, IQuery } from './markers';

export interface IMediatorPort {
  send<TResult>(command: ICommand): Promise<TResult>;
  execute<TResult>(query: IQuery): Promise<TResult>;
}
