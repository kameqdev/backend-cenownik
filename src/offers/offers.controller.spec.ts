import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { PrismaService } from "../prisma/prisma.service";
import { OffersController } from "./offers.controller";
import { OffersService } from "./offers.service";

describe("OffersController", () => {
  let controller: OffersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [OffersService, PrismaService],
    }).compile();

    controller = module.get<OffersController>(OffersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
