import { PrismaClient } from "@prisma/client";

// Singleton do PrismaClient: reaproveita a instancia no hot-reload pra nao estourar
// o limite de conexoes do banco.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
