/**
 * Records http_requests_total and http_request_duration_seconds for Grafana.
 */
import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import type { Counter, Histogram } from 'prom-client';
import type { Request } from 'express';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly requestCounter: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly requestDuration: Histogram<string>
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse();
    const method = req.method || 'GET';
    const start = Date.now();

    res.once('finish', () => {
      const statusCode = res.statusCode || 200;
      this.record(method, statusCode, start);
    });

    return next.handle();
  }

  private record(method: string, statusCode: number, startTime: number): void {
    const status_code = String(statusCode);
    this.requestCounter.inc({ method, status_code });
    const duration = (Date.now() - startTime) / 1000;
    this.requestDuration.observe({ method }, duration);
  }
}
