import { randomUUID } from 'node:crypto';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@biosstel/api-usuarios';
import { DashboardModule } from '@biosstel/api-objetivos';
import { FichajesModule } from '@biosstel/api-fichajes';
import { AuthModule } from '@biosstel/api-auth';
import { AlertasModule } from '@biosstel/api-alertas';
import { OperacionesModule } from '@biosstel/api-operaciones';
import { EmpresaModule } from '@biosstel/api-empresa';
import { ProductosModule } from '@biosstel/api-productos';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { MetricsModule, EventsModule, CqrsModule, ConfigServerModule } from '@biosstel/api-shared';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { DevLogsModule } from './dev-logs/dev-logs.module';
import { EnrichUsersListInterceptor } from './interceptors/enrich-users-list.interceptor';
import { ConfigController } from './config/config.controller';
import { AppGraphQLModule } from './graphql/graphql.module';

@Module({
  controllers: [HealthController, MetricsController, ConfigController],
  imports: [
    TerminusModule,
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),

    // Structured logging (JSON in production, pretty in dev)
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.get(
            'LOG_LEVEL',
            config.get('NODE_ENV') === 'production' ? 'info' : 'debug'
          ),
          transport:
            config.get('NODE_ENV') === 'production'
              ? undefined
              : { target: 'pino-pretty', options: { translateTime: 'SYS:standard' } },
          customProps: () => ({ requestId: randomUUID() }),
          serializers: {
            req: (req: { method?: string; url?: string } | undefined) =>
              req ? { method: req.method, url: req.url } : { method: '?', url: '?' },
            res: (res: { statusCode?: number }) => ({
              statusCode: res.statusCode,
            }),
          },
        },
      }),
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5434),
        username: configService.get('DB_USER', 'biosstel'),
        password: configService.get('DB_PASSWORD', 'biosstel123'),
        database: configService.get('DB_NAME', 'biosstel'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Monitoring (Prometheus /api/metrics)
    MetricsModule,

    // Config Server: configuración por feature (adapters, URLs) - GET /api/config
    ConfigServerModule,

    // Event-driven + CQRS (global)
    EventsModule,
    CqrsModule,

    // Feature Modules
    UsersModule,
    DashboardModule,
    FichajesModule.register(),
    AuthModule,
    AlertasModule,
    OperacionesModule,
    EmpresaModule,
    ProductosModule,
    DevLogsModule,
    // GraphQL (solo si graphql.enabled en settings.json y graphql.features incluye 'users')
    AppGraphQLModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: EnrichUsersListInterceptor },
  ],
})
export class AppModule {}
