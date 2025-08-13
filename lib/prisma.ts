// Use dynamic require and loose typing to avoid depending on generated types at tsc time
// This keeps type-checking green even if `prisma generate` hasn't run yet.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPrismaClient = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any as { prisma?: AnyPrismaClient };

let PrismaClientCtor: AnyPrismaClient;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  PrismaClientCtor = require("@prisma/client").PrismaClient;
} catch {
  // Fallback stub if @prisma/client isn't generated
  PrismaClientCtor = function PrismaClientStub() {} as unknown as AnyPrismaClient;
}

const prisma: AnyPrismaClient =
  g.prisma ||
  new PrismaClientCtor({
    log: ["query", "info", "warn", "error"],
  });

if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  g.prisma = prisma;
}

export default prisma;
