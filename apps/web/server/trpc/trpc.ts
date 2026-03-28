import { initTRPC, TRPCError } from "@trpc/server";
import { type Context } from "./context";
import superjson from "superjson";
import { Role } from "@smartedu/shared";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== Role.TEACHER && ctx.session.user.role !== Role.ADMIN) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== Role.ADMIN) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});
