import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@smartedu/db";

export async function createContext() {
  const session = await getServerSession(authOptions);

  return {
    session,
    prisma,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
