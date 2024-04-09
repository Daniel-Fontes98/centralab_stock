import { createTRPCRouter, publicProcedure } from "../trpc";

export const departmentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.department.findMany({});
  }),
});
