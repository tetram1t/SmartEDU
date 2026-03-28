import { router, teacherProcedure } from "../trpc";

export const teacherRouter = router({
  getStats: teacherProcedure.query(async ({ ctx }) => {
    const teacherId = ctx.session.user.id;

    const [classesCount, lessonsCount] = await Promise.all([
      ctx.prisma.teacherSubject.count({ where: { teacherId } }),
      ctx.prisma.lessonPlan.count({ where: { teacherId } }),
    ]);

    return {
      classesCount,
      lessonsCount,
      worksToReview: 0, // Placeholder
    };
  }),
  
  getMyClasses: teacherProcedure.query(async ({ ctx }) => {
    const teacherId = ctx.session.user.id;
    
    const relations = await ctx.prisma.teacherSubject.findMany({
      where: { teacherId },
      include: {
        class: true,
        subject: true
      }
    });

    return relations.map(r => ({
      class: r.class,
      subject: r.subject
    }));
  })
});
