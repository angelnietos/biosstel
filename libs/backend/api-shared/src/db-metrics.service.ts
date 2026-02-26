import { Injectable, type OnModuleInit, type OnModuleDestroy } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import type { Gauge } from 'prom-client';

@Injectable()
export class DbMetricsService implements OnModuleInit, OnModuleDestroy {
  private interval?: ReturnType<typeof setInterval>;

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectMetric('db_connections_active')
    private readonly connectionsGauge: Gauge<string>
  ) {}

  onModuleInit(): void {
    const update = async () => {
      try {
        const rows = await this.dataSource.query<{ count: string | number }[]>(
          `SELECT count(*)::text as count FROM pg_stat_activity WHERE datname = current_database()`
        );
        const raw = rows[0]?.count ?? 0;
        const count = typeof raw === 'number' ? raw : Number.parseInt(String(raw), 10) || 0;
        this.connectionsGauge.set(count);
      } catch {
        this.connectionsGauge.set(0);
      }
    };
    update();
    this.interval = setInterval(update, 15000);
  }

  onModuleDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }
}
