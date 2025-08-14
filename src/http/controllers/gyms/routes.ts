import type { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search";
import { nearby } from "./nearby";
import { create } from "./create";

export function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT); // Com isso, todas as rotas terão que verificar o jwt, ou seja, estar logado

  app.get("/gyms/search", search);
  app.get("/gyms/nearby", nearby);

  app.post("/gyms", create);
}
