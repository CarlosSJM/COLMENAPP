import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers (XSS, HSTS, clickjacking, content-type sniffing)
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Swagger docs protected with basic auth
  app.use(
    ['/api/docs', '/api/docs-json', '/api/docs-yaml'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER || 'colmenapp']:
          process.env.SWAGGER_PASSWORD || '1234colmenapp',
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('COLMENAPP API')
    .setDescription('API REST para gestión apícola profesional')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .addTag('Auth', 'Autenticación y registro')
    .addTag('Apiaries', 'Gestión de apiarios')
    .addTag('Hives', 'Gestión de colmenas')
    .addTag('Inspections', 'Registro de inspecciones')
    .addTag('Production', 'Registro de producción')
    .addTag('Tasks', 'Gestión de tareas')
    .addTag('Dashboard', 'Estadísticas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
