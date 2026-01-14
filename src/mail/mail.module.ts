import { MailerModule } from "@nestjs-modules/mailer";

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { MailService } from "./mail.service";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get("EMAIL_HOST"),
          port: Number(config.get("EMAIL_PORT")),
          secure: false,
          auth: {
            user: config.get("EMAIL_USER"),
            pass: config.get("EMAIL_PASS"),
          },
        },
        defaults: {
          from: `"Cenownik alert" <${String(config.get("EMAIL_FROM"))}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
