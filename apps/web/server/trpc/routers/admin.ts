import { router, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const adminRouter = router({
  getStats: adminProcedure.query(async ({ ctx }) => {
    const schoolId = ctx.session.user.schoolId;

    const [teachersCount, studentsCount, classesCount] = await Promise.all([
      ctx.prisma.user.count({ where: { schoolId, role: "TEACHER" } }),
      ctx.prisma.user.count({ where: { schoolId, role: "STUDENT" } }),
      ctx.prisma.class.count({ where: { schoolId } }),
    ]);

    return {
      teachersCount,
      studentsCount,
      classesCount,
    };
  }),

  getTeachers: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { schoolId: ctx.session.user.schoolId, role: "TEACHER" },
      orderBy: { lastName: "asc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
      }
    });
  }),
  
  getStudents: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { schoolId: ctx.session.user.schoolId, role: "STUDENT" },
      orderBy: { lastName: "asc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        classEnrollment: {
          include: { class: true }
        }
      }
    });
  }),
});
