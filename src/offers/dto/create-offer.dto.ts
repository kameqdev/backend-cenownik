import { IsNotEmpty, IsNumber, IsUUID, IsUrl } from "class-validator";

export class CreateOfferDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsNotEmpty()
  targetPrice: number;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
