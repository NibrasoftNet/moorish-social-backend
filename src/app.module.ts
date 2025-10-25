import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, HeaderResolver } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './mail/mail.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './config/config.type';
import { OtpModule } from './otp/otp.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { EntityHelperProfile } from './utils/serialization/entity-helper.profile';
import { OauthModule } from './oauth/oauth.module';
import googleConfig from './oauth/config/google.config';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail.config';
import fileConfig from './files/config/file.config';
import path from 'path';
import { HealthModule } from './health/health.module';
import { AwsS3Module } from './utils/aws-s3/aws-s3.module';
import { WinstonLoggerModule } from './logger/winston-logger.module';
import { GraphileWorkerModule } from 'nestjs-graphile-worker';
import { NotificationModule } from './notification/notification.module';
import { NotificationTask } from './utils/graphile-worker/notification-task';
import { NotificationCronTask } from './utils/graphile-worker/notification-cronjob';
import { SharedModule } from './shared-module/shared.module';
import { UsersTenantModule } from './users-tenant/users-tenant.module';
import { FirebaseModule } from './utils/firabase-fcm/firebase.module';
import { ChatModule } from './chat/chat.module';
import { ClsModule } from 'nestjs-cls';
import { TenantMiddleware } from './utils/repository/tenant-aware/tenant.middleware';
import { CompanySubscriptionTokenModule } from './company-subscription-token/company-subscription-token.module';
import { CompanyModule } from './company/company.module';
import { TokenCategoryModule } from './token-category/token-category.module';
import { CompanySubscriptionTokenController } from './company-subscription-token/company-subscription-token.controller';
import { CompanyPostModule } from './company-post/company-post.module';
import { PostCategoryModule } from './post-category/post-category.module';
import { CompanyCategoryModule } from './company-category/company-category.module';
import { CompanyOfferModule } from './company-offer/company-offer.module';
import { UserRequestOfferModule } from './user-request-offer/user-request-offer.module';
import { UserTenderModule } from './user-tender/user-tender.module';
import { TenderCategoryModule } from './tender-category/tender-category.module';
import { CompanyParticipationUserTenderModule } from './company-participation-user-tender/company-participation-user-tender.module';
import { CompanyTenderModule } from './company-tender/company-tender.module';
import { CompanyParticipationCompanyTenderModule } from './company-participation-company-tender/company-participation-company-tender.module';
import { UserTestimonialModule } from './user-testimonial/user-testimonial.module';
import { SessionModule } from './session/session.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CompanyPrivateController } from './company/private/company-private.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        googleConfig,
      ],
      envFilePath: ['.env'],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      // eslint-disable-next-line
      dataSourceFactory: async (options: DataSourceOptions) => {
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    GraphileWorkerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connectionString: config.get('PG_CONNECTION'),
        //crontab: `0 4 * * * notification-cron`,
      }),
    }),
    AuthModule,
    AwsS3Module,
    ChatModule,
    CompanyModule,
    CompanyCategoryModule,
    CompanyPostModule,
    CompanyOfferModule,
    CompanySubscriptionTokenModule,
    CompanyParticipationUserTenderModule,
    CompanyTenderModule,
    CompanyParticipationCompanyTenderModule,
    FilesModule,
    FirebaseModule,
    HealthModule,
    MailModule,
    NotificationModule,
    OauthModule,
    OtpModule,
    PostCategoryModule,
    SessionModule,
    SharedModule,
    TokenCategoryModule,
    TenderCategoryModule,
    UsersModule,
    UsersTenantModule,
    UserRequestOfferModule,
    UserTenderModule,
    UserTestimonialModule,
    WinstonLoggerModule,
  ],

  providers: [EntityHelperProfile, NotificationTask, NotificationCronTask],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes(CompanyPrivateController, CompanySubscriptionTokenController);
  }
}
