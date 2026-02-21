/**
 * Development entry point with tsconfig-paths support
 * This allows importing from source files directly (live reload)
 */

// Import reflect-metadata FIRST (required for TypeORM decorators)
import 'reflect-metadata';
import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS: permitir front en localhost/127.0.0.1 (cualquier puerto en dev)
  const allowedOrigins = [
    process.env.CORS_ORIGIN || 'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((o) => origin === o)) return callback(null, true);
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

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

  // Enable Versioning (same as main.ts)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Swagger documentation (ver y probar endpoints)
  const config = new DocumentBuilder()
    .setTitle('Biosstel API')
    .setDescription('API REST del sistema Biosstel. Usa "Try it out" para ejecutar las peticiones.')
    .setVersion('1.0')
    .addServer('http://localhost:4000', 'Local')
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
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}/api`);
  console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
}
bootstrap();
