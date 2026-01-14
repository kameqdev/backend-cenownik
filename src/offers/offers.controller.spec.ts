import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";
import { ScraperService } from "../scraper/scraper.service";
import { OffersController } from "./offers.controller";
import { OffersService } from "./offers.service";

describe("OffersController", () => {
  let controller: OffersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [
        OffersService,
        PrismaService,
        {
          provide: ScraperService,
          useValue: {
            fetchPrice: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendPriceDropNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OffersController>(OffersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
