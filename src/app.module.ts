import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MailModule } from "./mail/mail.module";
import { OffersModule } from "./offers/offers.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ScraperModule } from "./scraper/scraper.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    UsersModule,
    OffersModule,
    PrismaModule,
    ScraperModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
