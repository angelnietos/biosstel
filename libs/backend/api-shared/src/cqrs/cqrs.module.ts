import { Global, Module, forwardRef } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Mediator } from './mediator';
import { IMediator } from './markers';

@Global()
@Module({
  providers: [
    {
      provide: ModuleRef,
      useExisting: forwardRef(() => ModuleRef),
    },
    Mediator,
    {
      provide: IMediator,
      useExisting: Mediator,
    },
  ],
  exports: [IMediator, Mediator],
})
export class CqrsModule {}
