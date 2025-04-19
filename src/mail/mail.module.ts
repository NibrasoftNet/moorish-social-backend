import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        transport: {
          host: configService.getOrThrow('mail.host', { infer: true }),
          port: configService.getOrThrow('mail.port', { infer: true }),
          //service: configService.getOrThrow('mail.service', { infer: true }),
          ignoreTLS: configService.getOrThrow('mail.ignoreTLS', {
            infer: true,
          }),
          secure: configService.getOrThrow('mail.secure', { infer: true }),
          requireTLS: configService.getOrThrow('mail.requireTLS', {
            infer: true,
          }),
          auth: {
            user: configService.getOrThrow('mail.user', { infer: true }),
            pass: configService.getOrThrow('mail.password', { infer: true }),
          },
        },
        defaults: {
          from: '"no-reply" <helpdesk@no-reploy.com>',
        },
        template: {
          dir: __dirname + '/mail/templates',
          // adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
