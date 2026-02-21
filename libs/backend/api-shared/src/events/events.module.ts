import { Global, Module } from '@nestjs/common';
import { IEventBus } from './event-bus.port';
import { InMemoryEventBus } from './in-memory-event-bus';

@Global()
@Module({
  providers: [
    {
      provide: IEventBus,
      useClass: InMemoryEventBus,
    },
  ],
  exports: [IEventBus],
})
export class EventsModule {}
