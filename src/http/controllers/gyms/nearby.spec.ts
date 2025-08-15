import { expect, describe, it, beforeAll, afterAll } from "vitest";
import { app } from "@/app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Fetch Nearby Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to fetch nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 01",
        description: "Some description.",
        phone: "000000000",
        latitude: -38.5246646,
        longitude: -8.8827046,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 02",
        description: "Test description.",
        phone: "000000000",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Gym 02",
      }),
    ]);
  });
});
