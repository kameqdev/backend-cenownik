/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Decimal } from "@prisma/client/runtime/library";

import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";
import { ScraperService } from "../scraper/scraper.service";
import { OffersService } from "./offers.service";

describe("OffersService", () => {
  let service: OffersService;
  let prismaService: PrismaService;
  let scraperService: ScraperService;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        {
          provide: PrismaService,
          useValue: {
            offer: {
              findMany: jest.fn(),
              update: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
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

    service = module.get<OffersService>(OffersService);
    prismaService = module.get<PrismaService>(PrismaService);
    scraperService = module.get<ScraperService>(ScraperService);
    mailService = module.get<MailService>(MailService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("updateAllPrices", () => {
    it("should update prices for all offers", async () => {
      const offers = [
        {
          id: "1",
          url: "http://example.com/1",
          currentPrice: new Decimal(100),
          targetPrice: new Decimal(120),
          userId: "u1",
          lastCheckedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { email: "test@example.com" },
        },
        {
          id: "2",
          url: "http://example.com/2",
          currentPrice: new Decimal(200),
          targetPrice: new Decimal(180),
          userId: "u2",
          lastCheckedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { email: "test2@example.com" },
        },
      ];

      (prismaService.offer.findMany as jest.Mock).mockResolvedValue(offers);
      (scraperService.fetchPrice as jest.Mock)
        .mockResolvedValueOnce(150)
        .mockResolvedValueOnce(250);

      await service.updateAllPrices();

      expect(prismaService.offer.findMany).toHaveBeenCalledWith({
        include: { user: true },
      });
      expect(scraperService.fetchPrice).toHaveBeenCalledTimes(2);
      expect(prismaService.offer.update).toHaveBeenCalledTimes(2);
      expect(prismaService.offer.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          currentPrice: 150,
          lastCheckedAt: expect.any(Date),
        },
      });
      expect(prismaService.offer.update).toHaveBeenCalledWith({
        where: { id: "2" },
        data: {
          currentPrice: 250,
          lastCheckedAt: expect.any(Date),
        },
      });
    });

    it("should send email when price drops below target", async () => {
      const offers = [
        {
          id: "1",
          url: "http://example.com/1",
          currentPrice: new Decimal(150),
          targetPrice: new Decimal(120),
          userId: "u1",
          lastCheckedAt: new Date(),
          user: { email: "alert@example.com" },
        },
      ];

      (prismaService.offer.findMany as jest.Mock).mockResolvedValue(offers);
      (scraperService.fetchPrice as jest.Mock).mockResolvedValueOnce(110);

      await service.updateAllPrices();

      expect(mailService.sendPriceDropNotification).toHaveBeenCalledWith(
        "alert@example.com",
        "http://example.com/1",
        110,
        120,
      );
    });

    it("should handle scraper errors gracefully", async () => {
      const offers = [
        {
          id: "1",
          url: "url1",
          user: {},
          targetPrice: new Decimal(100),
          currentPrice: new Decimal(100),
        },
        {
          id: "2",
          url: "url2",
          user: {},
          targetPrice: new Decimal(100),
          currentPrice: new Decimal(100),
        },
      ];

      (prismaService.offer.findMany as jest.Mock).mockResolvedValue(offers);
      (scraperService.fetchPrice as jest.Mock)
        .mockRejectedValueOnce(new Error("Scraper validation error"))
        .mockResolvedValueOnce(250);

      await service.updateAllPrices();

      expect(scraperService.fetchPrice).toHaveBeenCalledTimes(2);
      expect(prismaService.offer.update).toHaveBeenCalledTimes(1);
    });
  });
});
