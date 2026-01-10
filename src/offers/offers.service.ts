import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { ScraperService } from "../scraper/scraper.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { UpdateOfferDto } from "./dto/update-offer.dto";

@Injectable()
export class OffersService {
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
}
