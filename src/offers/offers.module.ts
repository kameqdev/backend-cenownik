import { Module } from "@nestjs/common";

import { MailModule } from "../mail/mail.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ScraperModule } from "../scraper/scraper.module";
import { OffersController } from "./offers.controller";
import { OffersService } from "./offers.service";

@Module({
  imports: [PrismaModule, ScraperModule, MailModule],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
