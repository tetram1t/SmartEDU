import { router, publicProcedure } from "./trpc";
import { adminRouter } from "./routers/admin";
import { teacherRouter } from "./routers/teacher";
import { studentRouter } from "./routers/student";

export const appRouter = router({
  health: publicProcedure.query(() => "OK"),
  admin: adminRouter,
  teacher: teacherRouter,
  student: studentRouter,
});

export type AppRouter = typeof appRouter;
