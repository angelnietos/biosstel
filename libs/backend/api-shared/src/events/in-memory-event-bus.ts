/**
 * In-memory event bus implementation.
 * Can be swapped for Kafka/RabbitMQ adapter for distributed event-driven.
 */

import type { IEventBus, EventHandler } from './event-bus.port';

export class InMemoryEventBus implements IEventBus {
  private readonly handlers = new Map<string, Set<EventHandler>>();

  publish<T>(eventName: string, payload: T): void {
    const set = this.handlers.get(eventName);
    if (!set?.size) return;
    for (const handler of set) {
      try {
        const result = handler(payload);
        if (result instanceof Promise) {
          result.catch((err) => {
            console.error(`[EventBus] Handler error for "${eventName}":`, err);
          });
        }
      } catch (err) {
        console.error(`[EventBus] Handler error for "${eventName}":`, err);
      }
    }
  }

  subscribe<T>(eventName: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler as EventHandler);
    return () => this.handlers.get(eventName)?.delete(handler as EventHandler);
  }
}
