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

  it("it should be able to get user profile", async () => {
    await request(app.server).post("/users").send({
      name: "John doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    const authResponse = await request(app.server).post("/sessions").send({
      email: "johndoe@example.com",
      password: "123456",
    });

    const { token } = authResponse.body;

    const profileResponse = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: "johndoe@example.com",
      }),
    );
  });
});
