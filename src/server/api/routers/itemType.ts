import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const itemTypeRouter = createTRPCRouter({
  createMany: publicProcedure
    .input(
      z.array(
        z.object({
          name: z.string(),
          boxQuantity: z.number(),
          alertMin: z.number(),
          supplierId: z.number(),
          unitPrice: z.number().default(0),
          totalQuantity: z.number(),
        }),
      ),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.itemType.createMany({
        data: input,
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        boxQuantity: z.number(),
        alertMin: z.number(),
        unitPrice: z.number(),
        supplierId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.itemType.create({
        data: input,
      });
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.itemType.findMany({
      include: {
        supplier: true,
      },
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.itemType.findMany({
        where: {
          id: input.id,
        },
        include: {
          supplier: true,
        },
      });
    }),
  getBySupplierId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.itemType.findMany({
        where: {
          supplierId: input.id,
        },
        include: {
          supplier: true,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        boxQuantity: z.number(),
        alertMin: z.number(),
        unitPrice: z.number(),
        supplierId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.itemType.update({
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
      return await ctx.db.itemType.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
