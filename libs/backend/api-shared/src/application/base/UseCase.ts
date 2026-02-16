/**
 * @biosstel/api-shared - Application Layer: Base Use Case
 * 
 * Base class for all use cases in the application layer.
 * Provides a common interface for executing business logic.
 */

export interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}

export abstract class BaseUseCase<Input, Output> implements UseCase<Input, Output> {
  abstract execute(input: Input): Promise<Output>;
}
