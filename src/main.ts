import {
  ClassSerializerInterceptor,
  ImATeapotException,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import validationOptions from './utils/validation-options';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { WinstonLoggerService } from './logger/winston-logger.service';
import { HttpExceptionFilter } from './utils/exceptions/http-exception.filter';
import { WorkerService } from 'nestjs-graphile-worker';
import { RolesSerializerInterceptor } from './utils/interceptors/role.serializer.interceptor';
import { I18nService } from 'nestjs-i18n';
import { ParameterObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import * as fs from 'fs';

const logger = new Logger('Weavers-social');
const whitelist = [
  'http://localhost:3000',
  'http://localhost:5001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5001',
  'http://147.79.117.125:5000',
  'http://147.79.117.125:5001',
  'https://api-weavers.nibrasoft.com',
  'https://dashboard-weavers.nibrasoft.com',
];

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create(AppModule, {
    cors: true,
    abortOnError: true,
  });
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true, // fallbackOnErrors must be true
  });
  const configService = app.get(ConfigService<AllConfigType>);
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    origin: function (origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (
        whitelist.includes(origin) || // Checks your whitelist
        !!origin.match(/weavers\.com$/) // Overall check for your domain
      ) {
        logger.log('allowed cors for:', origin);
        callback(null, true);
      } else {
        logger.error('blocked cors for:', origin);
        callback(new ImATeapotException('Not allowed by CORS'), false);
      }
    },
  });

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalFilters(
    new HttpExceptionFilter(
      app.get(WinstonLoggerService),
      app.get(I18nService),
    ),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new RolesSerializerInterceptor(app.get(Reflector)),
    new ResponseInterceptor(),
  );

  const options = new DocumentBuilder()
    .setTitle('Moorish social API')
    .setDescription('Swagger docs')
    .setVersion('1.0')
    .addGlobalParameters({
      name: configService.getOrThrow('app.headerLanguage', { infer: true }),
      required: true,
      in: 'header',
      example: 'fr',
    } as ParameterObject)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  /*  app.use(
    '/weavers-docs',
    apiReference({
      theme: 'moon',
      spec: {
        content: document,
      },
      favicon: 'https://avatars.githubusercontent.com/u/301879?s=48&v=4',
    }),
  );*/

  SwaggerModule.setup('moorish-docs', app, document);
  app.use('/moorish-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });
  fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
  await app.get(WorkerService).run();
  await app.listen(
    configService.getOrThrow('app.port', { infer: true }),
    () => {
      logger.log(
        `${configService.getOrThrow('app.name', {
          infer: true,
        })} Server is listening to port ${configService.getOrThrow('app.port', {
          infer: true,
        })}...`,
      );
    },
  );
}

void bootstrap().catch((e) => {
  logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap');
  throw e;
});
