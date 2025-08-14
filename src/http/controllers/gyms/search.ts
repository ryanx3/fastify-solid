import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsBodySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchGymsBodySchema.parse(request.body);

  const searchGymsUseCase = makeSearchGymsUseCase();
  const { gyms } = await searchGymsUseCase.execute({ query, page });

  return reply.status(200).send({ gyms });
}
