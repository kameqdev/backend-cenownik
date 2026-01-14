import { MailerService } from "@nestjs-modules/mailer";

import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendPriceDropNotification(
    email: string,
    offerUrl: string,
    currentPrice: number,
    targetPrice: number,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Price Drop Alert",
        html: `
        <h1>Good news!</h1>
        <p> The price for the product you are watching has dropped below your target price</p>
        <p><strong>Product URL:</strong> <a href="${offerUrl}">${offerUrl}</a></p>
        <p><strong>Current Price:</strong> ${String(currentPrice)}</p>
        <p><strong>Target Price:</strong> ${String(targetPrice)}</p>
        `,
      });
      this.logger.log(`Price drop notification sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send price drop notification to ${email}`,
        error,
      );
    }
  }
}
