import { IsDateString, IsNumber, IsOptional } from "class-validator";

import { ApiProperty, PartialType } from "@nestjs/swagger";

import { CreateOfferDto } from "./create-offer.dto";

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  currentPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  lastCheckedAt?: Date;
}
