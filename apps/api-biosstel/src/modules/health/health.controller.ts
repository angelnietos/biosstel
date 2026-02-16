import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API health' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'biosstel-api',
      version: '1.0.0',
    };
  }

  @Get('db')
  @ApiOperation({ summary: 'Check database connection' })
  checkDb() {
    // Database health check will be implemented with TypeORM
    return {
      status: 'ok',
      database: 'connected',
    };
  }
}