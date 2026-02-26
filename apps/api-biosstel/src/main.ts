import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));

  // CORS: lista explícita + puertos dinámicos en localhost/127.0.0.1 (dev con pnpm dev:dynamic)
  const corsOriginEnv = process.env.CORS_ORIGIN || '';
  const allowedOrigins = corsOriginEnv
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  if (allowedOrigins.length === 0) {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001');
  }
  const isLocalhostWithAnyPort = (origin: string) =>
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true); // Postman, curl, same-origin
      if (allowedOrigins.some((o) => o === origin)) return callback(null, true);
      if (isLocalhostWithAnyPort(origin)) return callback(null, true); // puertos dinámicos
      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Formato estándar de errores (statusCode, message, error, path)
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Permitir parámetros adicionales en query params
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Enable Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Swagger / OpenAPI documentation (ver y probar endpoints)
  const config = new DocumentBuilder()
    .setTitle('Biosstel API')
    .setDescription('API REST del sistema Biosstel. Usa "Try it out" para ejecutar las peticiones.')
    .setVersion('1.0')
    .addServer('http://localhost:4000/api/v1', 'Local (v1)')
    .addServer('http://localhost:4000', 'Local (sin versión)')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' },
      'access-token'
    )
    .addTag('health', 'Estado de la API y dependencias')
    .addTag('auth', 'Login, GET /me con JWT, recuperar contraseña')
    .addTag('users', 'Usuarios: listar, crear, actualizar, eliminar; documentos')
    .addTag('clients', 'Clientes: listar, crear')
    .addTag('objetivos', 'Dashboard: home y objetivos terminales')
    .addTag('empresa', 'Empresa, departamentos, centros de trabajo')
    .addTag('fichajes', 'Fichajes: entrada/salida, pausar/reanudar; tareas; calendarios; horarios; permisos')
    .addTag('alertas', 'Alertas')
    .addTag('operaciones', 'Operaciones')
    .addTag('productos', 'Productos: listado, CRUD, plantilla CSV')
    .addTag('inventory', 'Inventario')
    .addTag('reports', 'Informes y resúmenes')
    .addTag('monitoring', 'Métricas Prometheus')
    .addTag('config', 'Config Server: adapters por feature, URLs de microservicios')
    .addTag('dev-logs', 'Exportar log de flujo a BD (solo desarrollo)')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      docExpansion: 'list',
    },
    customSiteTitle: 'Biosstel API Docs',
  });

  const port = process.env.PORT || 4000;
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
  const logger = app.get(PinoLogger);
  logger.info(`API running on http://localhost:${port}/api`);
  logger.info(`API Docs: http://localhost:${port}/api/docs`);
}
bootstrap();
