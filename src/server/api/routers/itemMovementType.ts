import { createTRPCRouter, publicProcedure } from "../trpc";

export const itemMovementTypeRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.itemMovementType.findMany({});
  }),
});
