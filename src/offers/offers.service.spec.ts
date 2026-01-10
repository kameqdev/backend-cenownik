import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { PrismaService } from "../prisma/prisma.service";
import { ScraperService } from "../scraper/scraper.service";
import { OffersService } from "./offers.service";

describe("OffersService", () => {
  let service: OffersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        PrismaService,
        {
          provide: ScraperService,
          useValue: {
            fetchPrice: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
