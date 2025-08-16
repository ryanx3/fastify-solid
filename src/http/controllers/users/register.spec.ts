import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); // Para saber que o app ja iniciou
  });

  afterAll(async () => {
    await app.close(); // Aguardamos o app fechar
  });

  it("it should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    expect(response.statusCode).toBe(201);
  });
});
