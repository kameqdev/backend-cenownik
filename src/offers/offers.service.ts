import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { PrismaService } from "../prisma/prisma.service";
import { ScraperService } from "../scraper/scraper.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { UpdateOfferDto } from "./dto/update-offer.dto";

@Injectable()
export class OffersService {
  private readonly logger = new Logger(OffersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scraperService: ScraperService,
  ) {}

  async create(createOfferDto: CreateOfferDto) {
    const currentPrice = await this.scraperService.fetchPrice(
      createOfferDto.url,
    );

    return this.prisma.offer.create({
      data: {
        url: createOfferDto.url,
        targetPrice: createOfferDto.targetPrice,
        userId: createOfferDto.userId,
        currentPrice: currentPrice ?? undefined,
        lastCheckedAt: currentPrice === null ? undefined : new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.offer.findMany();
  }

  async findOne(id: string) {
    return this.prisma.offer.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateOfferDto: UpdateOfferDto) {
    return this.prisma.offer.update({
      where: { id },
      data: updateOfferDto,
    });
  }

  async remove(id: string) {
    return this.prisma.offer.delete({
      where: { id },
    });
  }

  @Cron(CronExpression.EVERY_4_HOURS)
  async updateAllPrices() {
    this.logger.log("Starting scheduled price update...");
    const offers = await this.prisma.offer.findMany();

    for (const offer of offers) {
      try {
        const currentPrice = await this.scraperService.fetchPrice(offer.url);

        if (currentPrice === null) {
          continue;
        }

        const priceChanged = offer.currentPrice?.toNumber() !== currentPrice;

        await this.prisma.offer.update({
          where: { id: offer.id },
          data: {
            ...(priceChanged ? { currentPrice } : {}),
            lastCheckedAt: new Date(),
          },
        });
        if (priceChanged) {
          this.logger.log(
            `Updated price for offer ${offer.id}: ${String(currentPrice)}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to update price for offer ${offer.id}`,
          error,
        );
      }
    }
    this.logger.log("Finished scheduled price update.");
  }
}
