import { router, protectedProcedure } from "../trpc";
import { Role } from "@smartedu/shared";
import { TRPCError } from "@trpc/server";

export const studentRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role !== Role.STUDENT) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    const studentId = ctx.session.user.id;

    const grades = await ctx.prisma.grade.findMany({
      where: { work: { studentId } }
    });
    
    const avgScore = grades.length > 0 
      ? grades.reduce((acc, g) => acc + g.score, 0) / grades.length
      : 0;

    return {
      avgScore: Number(avgScore.toFixed(1)),
      assignmentsCount: 0, // Placeholder
      testsCount: 0,
    };
  }),
});
