import { Global, Module } from '@nestjs/common';
import { CqrsModule as NestCqrsModule } from '@nestjs/cqrs';
import { Mediator } from './mediator';
import { IMediator } from './markers';

@Global()
@Module({
  imports: [NestCqrsModule],
  providers: [
    Mediator,
    {
      provide: IMediator,
      useExisting: Mediator,
    },
  ],
  exports: [NestCqrsModule, IMediator, Mediator],
})
export class CqrsModule {}
