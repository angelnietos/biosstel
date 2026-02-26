/**
 * Event Bus port - event-driven communication between features.
 * Implementations: InMemoryEventBus (default), later Kafka/RabbitMQ adapter.
 */

export type EventHandler<E = unknown> = (event: E) => void | Promise<void>;

export interface IEventBus {
  publish<T>(eventName: string, payload: T): void | Promise<void>;
  subscribe<T>(eventName: string, handler: EventHandler<T>): () => void;
}

export const IEventBus = Symbol('IEventBus');
