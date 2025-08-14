import type { FastifyInstance } from "fastify";
import { authenticate } from "./authenticate";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { register } from "./register";
import { profile } from "./profile";

export function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  /** Authenticated */
  app.get("/me", { onRequest: verifyJWT }, profile);
}
