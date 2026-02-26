import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Mediator } from '@biosstel/api-shared';
import { ListOperacionesQuery } from './queries/operaciones/ListOperaciones.query';
import { ListOperacionesHandler } from './handlers/operaciones/ListOperaciones.handler';

@Injectable()
export class OperacionesMediatorRegistration implements OnModuleInit {
  constructor(private readonly mediator: Mediator) {}

  onModuleInit(): void {
    this.mediator.registerQueryHandler(ListOperacionesQuery, ListOperacionesHandler);
  }
}
