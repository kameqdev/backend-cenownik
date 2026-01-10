import { IsDateString, IsNumber, IsOptional } from "class-validator";

import { PartialType } from "@nestjs/mapped-types";

import { CreateOfferDto } from "./create-offer.dto";

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  @IsOptional()
  @IsNumber()
  currentPrice?: number;

  @IsOptional()
  @IsDateString()
  lastCheckedAt?: Date;
}
