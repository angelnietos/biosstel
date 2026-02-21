import { Global, Module } from '@nestjs/common';
import { Mediator } from './mediator';
import { IMediator } from './markers';

@Global()
@Module({
  providers: [
    Mediator,
    {
      provide: IMediator,
      useExisting: Mediator,
    },
  ],
  exports: [IMediator, Mediator],
})
export class CqrsModule {}
