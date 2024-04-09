import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const supplierRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().optional(),
        location: z.string().optional(),
        phoneNumber: z.string().optional(),
        site: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.supplier.create({
        data: input,
      });
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.supplier.findMany({});
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.supplier.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        email: z.string().optional(),
        location: z.string().optional(),
        phoneNumber: z.string().optional(),
        site: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.supplier.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.supplier.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
