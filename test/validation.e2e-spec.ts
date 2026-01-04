import type { Server } from "node:http";
import * as request from "supertest";

import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { AppModule } from "./../src/app.module";

interface ValidationErrorResponse {
  message: string[];
  error: string;
  statusCode: number;
}

describe("Validation (e2e)", () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    httpServer = app.getHttpServer() as Server;
  });

  it("/users (POST) - should fail with invalid email", () => {
    return request
      .default(httpServer)
      .post("/users")
      .send({ email: "invalid-email" })
      .expect(400)
      .expect((response: request.Response) => {
        const body = response.body as ValidationErrorResponse;
        expect(body.message).toContain("email must be an email");
      });
  });

  it("/offers (POST) - should fail with invalid data", () => {
    return request
      .default(httpServer)
      .post("/offers")
      .send({
        url: "not-a-url",
        targetPrice: "not-a-number",
        userId: "not-a-uuid",
      })
      .expect(400)
      .expect((response: request.Response) => {
        const body = response.body as ValidationErrorResponse;
        expect(body.message).toEqual(
          expect.arrayContaining([
            "url must be a URL address",
            "targetPrice must be a number conforming to the specified constraints",
            "userId must be a UUID",
          ]),
        );
      });
  });
});
