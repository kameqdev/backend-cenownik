import { IsEmail, IsNotEmpty } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    example: "user@example.com",
    description: "The unique email address of the user",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
