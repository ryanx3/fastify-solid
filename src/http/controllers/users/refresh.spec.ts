import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Refresh token (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); // Para saber que o app ja iniciou
  });

  afterAll(async () => {
    await app.close(); // Aguardamos o app fechar
  });

  it("it should be able to refresh a token", async () => {
    await request(app.server).post("/users").send({
      name: "John doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "johndoe@example.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie");

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies!)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ token: expect.any(String) });
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refresh_token"),
    ]);
  });
});
