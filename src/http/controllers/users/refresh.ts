import type { FastifyReply, FastifyRequest } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true });

  const { role } = request.user;

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  );

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: "7d",
      },
    },
  );
  return reply
    .setCookie("refresh_token", refreshToken, {
      path: "/", // Caminho onde o cookie será enviado — "/" significa que estará disponível em toda a aplicação
      secure: true, // Envia o cookie apenas em conexões HTTPS (melhora a segurança)
      sameSite: true, // Restringe o envio do cookie a requisições do mesmo site (protege contra CSRF)
      httpOnly: true, // Impede acesso ao cookie via JavaScript no navegador (protege contra XSS)
    })
    .status(200)
    .send({ token });
}
