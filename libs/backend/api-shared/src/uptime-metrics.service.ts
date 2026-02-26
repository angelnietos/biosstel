import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import type { Gauge } from 'prom-client';

@Injectable()
export class UptimeMetricsService implements OnModuleInit, OnModuleDestroy {
  private interval?: ReturnType<typeof setInterval>;

  constructor(
    @InjectMetric('process_uptime_seconds')
    private readonly uptimeGauge: Gauge<string>
  ) {}

  onModuleInit(): void {
    const update = () => this.uptimeGauge.set(process.uptime());
    update();
    this.interval = setInterval(update, 5000);
  }

  onModuleDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }
}
