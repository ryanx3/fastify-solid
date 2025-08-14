import type { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT); // Com isso, todas as rotas terão que verificar o jwt, ou seja, estar logado
}
