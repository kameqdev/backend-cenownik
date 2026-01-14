import { IsNotEmpty, IsNumber, IsUUID, IsUrl } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateOfferDto {
  @ApiProperty({
    example: "https://www.amazon.pl/dp/B08H93ZRK9",
    description: "The URL of the product to track",
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: 100,
    description: "The target price for notification",
  })
  @IsNumber()
  @IsNotEmpty()
  targetPrice: number;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "The ID of the user creating the offer",
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
