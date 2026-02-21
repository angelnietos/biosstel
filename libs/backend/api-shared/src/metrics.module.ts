/**
 * @biosstel/api-shared - Prometheus metrics for the API
 */
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
  makeGaugeProvider,
} from '@willsoto/nestjs-prometheus';
import { HttpMetricsInterceptor } from './http-metrics.interceptor';
import { UptimeMetricsService } from './uptime-metrics.service';
import { DbMetricsService } from './db-metrics.service';

@Module({
  imports: [
    PrometheusModule.register({
      path: 'metrics',
      defaultMetrics: { enabled: true },
    }),
  ],
  providers: [
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'status_code'],
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    }),
    makeGaugeProvider({
      name: 'process_uptime_seconds',
      help: 'Process uptime in seconds',
    }),
    makeGaugeProvider({
      name: 'db_connections_active',
      help: 'Active PostgreSQL connections for current database',
    }),
    HttpMetricsInterceptor,
    UptimeMetricsService,
    DbMetricsService,
    { provide: APP_INTERCEPTOR, useClass: HttpMetricsInterceptor },
  ],
  exports: [PrometheusModule],
})
export class MetricsModule {}
