import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { UpdateOfferDto } from "./dto/update-offer.dto";

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOfferDto: CreateOfferDto) {
    return this.prisma.offer.create({
      data: createOfferDto,
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
