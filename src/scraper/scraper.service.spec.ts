import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { ScraperService } from "./scraper.service";

describe("ScraperService", () => {
  let service: ScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should fetch price from Amazon PL", async () => {
    const url = "https://www.amazon.pl/gp/product/B08G8S7B37";
    const price = await service.fetchPrice(url);
    // eslint-disable-next-line no-console
    console.log(`Fetched price for ${url}: ${String(price)}`);

    expect(price).not.toBeNull();
    expect(typeof price).toBe("number");
    expect(price).toBeGreaterThan(0);
  }, 30_000);

  it("should fetch price from Amazon EN", async () => {
    const url = "https://www.amazon.com/dp/B007IBRE4E";
    const price = await service.fetchPrice(url);
    // eslint-disable-next-line no-console
    console.log(`Fetched price for ${url}: ${String(price)}`);

    expect(price).not.toBeNull();
    expect(typeof price).toBe("number");
    expect(price).toBeGreaterThan(0);
  }, 30_000);
});
