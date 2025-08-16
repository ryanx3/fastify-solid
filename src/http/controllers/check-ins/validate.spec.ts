import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Validate Check-In (e2e)", () => {
  beforeAll(async () => {
    await app.ready(); // Para saber que o app ja iniciou
  });

  afterAll(async () => {
    await app.close(); // Aguardamos o app fechar
  });

  it("it should be able to create a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const user = await prisma.user.findFirstOrThrow();
    const gym = await prisma.gym.create({
      data: {
        title: "Gym 01",
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    expect(response.statusCode).toEqual(204);
    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
