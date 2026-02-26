import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator
  ) {}

  @Get('live')
  @ApiOperation({
    summary: 'Liveness',
    description: 'Comprueba que la API está viva (K8s liveness probe).',
  })
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({
    summary: 'Readiness',
    description: 'Comprueba que la API puede atender tráfico (DB accesible).',
  })
  ready() {
    return this.health.check([() => this.db.pingCheck('database', { timeout: 1500 })]);
  }

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Health check completo',
    description: 'DB, memoria y disco. Sin dependencia de GraphQL ni Config Server.',
  })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 1500 }),
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
      () =>
        this.disk.checkStorage('disk', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }
}
