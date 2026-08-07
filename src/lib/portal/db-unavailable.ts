import { Prisma } from "@prisma/client";

export function isDatabaseUnavailable(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientInitializationError
  ) {
    return true;
  }

  if (error instanceof Error) {
    return /can't reach database|P1001|P1017|ECONNREFUSED|connection/i.test(
      error.message,
    );
  }

  return false;
}
