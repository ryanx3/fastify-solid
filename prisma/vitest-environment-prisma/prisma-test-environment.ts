import { prisma } from "@/lib/prisma";
import { execSync } from "child_process";
import { randomUUID } from "crypto";
import "dotenv/config";
import type { Environment } from "vitest/environments";

// Essa função verifica se existe um DaatabaseURL nas variaveis
// Se existir criamos uma nova URL com ela e usamos o searchParas para criar um schema
// retornamos uma URL em string
function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL env variable");
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  transformMode: "ssr", // quer dizer que o cidog vai ser executado pelo servidor
  async setup() {
    // Em setup, criamos o banco de testes
    const schema = randomUUID(); // nome do schema vai ser random
    const databaseUrl = generateDatabaseUrl(schema); // criando databaseUrl

    process.env.DATABASE_URL = databaseUrl; // Setando a nova URL para a variavel de ambiente

    execSync("npx prisma migrate deploy"); // Executamos o prisma migrate deploy para criar todos os bancos dentro desse schema novo
    return {
      async teardown() {
        // em teardown, apagamos o banco de testes

        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );

        await prisma.$disconnect();
      },
    };
  },
};
