import * as cheerio from "cheerio";

import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async fetchPrice(url: string): Promise<number | null> {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Chrome" },
      });

      if (!response.ok) {
        this.logger.error(
          `Failed to fetch page: ${String(response.status)} ${response.statusText}`,
        );
        return null;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const selectors = [
        "#corePriceDisplay_desktop_feature_div .aok-offscreen",
        "#corePrice_feature_div .a-offscreen",
      ];

      for (const selector of selectors) {
        const element = $(selector).first();
        if (element.length > 0) {
          const text = element.text().trim();
          this.logger.debug(
            `Found price text: "${text}" using selector: "${selector}"`,
          );
          const price = this.parsePrice(text);
          if (price !== null) {
            return price;
          }
        }
      }

      this.logger.warn(`Could not find price for URL: ${url}`);
      return null;
    } catch (error) {
      this.logger.error("Error scraping price:", error);
      return null;
    }
  }

  private parsePrice(text: string): number | null {
    const cleaned = text.replace(",", ".").replaceAll(/[^\d.]/g, "");
    const price = Number.parseFloat(cleaned);
    return Number.isNaN(price) ? null : price;
  }
}
