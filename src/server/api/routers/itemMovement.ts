import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";

function numberToMonth(n: number): string {
  switch (n) {
    case 1:
      return "Jan";
    case 2:
      return "Fev";
    case 3:
      return "Mar";
    case 4:
      return "Abr";
    case 5:
      return "Mai";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Ago";
    case 9:
      return "Set";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dez";
    default:
      return "";
  }
}

export const itemMovementRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        quantity: z.number(),
        isBoxes: z.boolean(),
        expireDate: z.date().optional(),
        itemMovementTypeId: z.number(),
        itemTypeId: z.number(),
        departmentId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const itemType = await ctx.db.itemType.findFirst({
        where: { id: input.itemTypeId },
      });
      if (!itemType) {
        console.error("Invalid ItemTypeId");
        throw new Error("Erro ao procurar item selecionado");
      }

      const itemMovementType = await ctx.db.itemMovementType.findFirst({
        where: { id: input.itemMovementTypeId },
      });
      if (!itemMovementType) {
        console.error("Invalid ItemMovementTypeId");
        throw new Error("Erro na ação selecionada");
      }

      const quantityToMove = input.isBoxes
        ? itemType.boxQuantity * input.quantity
        : input.quantity;

      if (itemMovementType.name === "Adicionar") {
        const itemMovement = await ctx.db.itemMovement.create({
          data: input,
        });
        await ctx.db.itemType.update({
          data: {
            totalQuantity: {
              increment: quantityToMove,
            },
          },
          where: {
            id: input.itemTypeId,
          },
        });

        return itemMovement;
      }

      if (itemMovementType.name === "Remover") {
        if (quantityToMove > itemType.totalQuantity)
          throw new Error("Quantidade em stock insuficiente");
        const itemMovement = await ctx.db.itemMovement.create({
          data: input,
        });

        await ctx.db.itemType.update({
          data: {
            totalQuantity: {
              decrement: quantityToMove,
            },
          },
          where: {
            id: input.itemTypeId,
          },
        });
        return itemMovement;
      }
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.itemMovement.findMany({
      include: {
        itemMovementType: true,
        itemType: true,
      },
    });
  }),
  getByItemTypeId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.itemMovement.findMany({
        where: {
          itemTypeId: input.id
        },
        include: {
          itemMovementType: true,
          itemType: true,
        },
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.itemMovement.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getLast5Purchases: publicProcedure.query(async ({ ctx }) => {
    const itemMovements = await ctx.db.itemMovement.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        quantity: true,
        isBoxes: true,
        itemType: {
          select: {
            name: true,
            unitPrice: true,
            boxQuantity: true,
            supplier: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      where: {
        itemMovementTypeId: 2,
      },
    });
    return itemMovements.map((movement) => {
      return {
        id: movement.id,
        name: movement.itemType.name,
        totalQuantity: movement.isBoxes
          ? movement.itemType.unitPrice *
            movement.quantity *
            movement.itemType.boxQuantity
          : movement.itemType.unitPrice * movement.quantity,
        supplier: movement.itemType.supplier.name,
      };
    });
  }),
  getTotalBoughtBetweenDates: publicProcedure
    .input(
      z.object({
        beginDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.$queryRaw<
        {
          totalQuantity: number;
        }[]
      >(Prisma.sql`
        SELECT SUM(
          CASE 
            WHEN "ItemMovement"."isBoxes" = False THEN
              CAST("ItemMovement".quantity AS FLOAT) * "ItemType"."unitPrice"
            WHEN "ItemMovement"."isBoxes" = True THEN
              CAST("ItemMovement".quantity AS FLOAT) * "ItemType"."boxQuantity" * "ItemType"."unitPrice"
            ELSE 0
            END) AS "totalQuantity"
        FROM "ItemMovement"
        JOIN "ItemType" ON "ItemMovement"."itemTypeId" = "ItemType".id
        WHERE "ItemMovement"."createdAt" >= ${input.beginDate} 
          AND "ItemMovement"."createdAt" <= ${input.endDate} 
          AND "itemMovementTypeId" = 2
      `);
      return result.reduce((prev, curr) => prev + curr.totalQuantity, 0);
    }),
  getTotalUsedBetweenDates: publicProcedure
    .input(
      z.object({
        beginDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.$queryRaw<
        {
          totalQuantity: number;
        }[]
      >(Prisma.sql`
      SELECT SUM(
        CASE 
          WHEN "ItemMovement"."isBoxes" = False THEN
            CAST("ItemMovement".quantity AS FLOAT) * "ItemType"."unitPrice"
          WHEN "ItemMovement"."isBoxes" = True THEN
            CAST("ItemMovement".quantity AS FLOAT) * "ItemType"."boxQuantity" * "ItemType"."unitPrice"
          ELSE 0
          END) AS "totalQuantity"
      FROM "ItemMovement"
      JOIN "ItemType" ON "ItemMovement"."itemTypeId" = "ItemType".id
      WHERE "ItemMovement"."createdAt" >= ${input.beginDate} 
        AND "ItemMovement"."createdAt" <= ${input.endDate} 
        AND "itemMovementTypeId" = 1
    `);

      return result.reduce((prev, curr) => curr.totalQuantity + prev, 0);
    }),
  getNumberOfPurchasesThisMonth: publicProcedure.query(async ({ ctx }) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so adding 1
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const nextMonthFirstDay = new Date(currentYear, currentMonth, 1);
    const result = await ctx.db.itemMovement.count({
      where: {
        AND: [
          {
            createdAt: {
              gte: firstDayOfMonth,
              lt: nextMonthFirstDay,
            },
          },
          {
            itemMovementTypeId: 2,
          },
        ],
      },
    });
    return result;
  }),
  getQuantityOfPurchasesBetweenDates: publicProcedure
    .input(
      z.object({
        beginDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.$queryRaw<
        {
          totalQuantity: number;
        }[]
      >(Prisma.sql`
      SELECT SUM(CASE
        WHEN "ItemMovement"."isBoxes" = True THEN
          CAST("ItemMovement".quantity AS FLOAT) * "ItemType"."boxQuantity"
        WHEN "ItemMovement"."isBoxes" = False THEN
          CAST("ItemMovement".quantity AS FLOAT) 
        ELSE 0
        END) AS "totalQuantity"
      FROM "ItemMovement"
      JOIN "ItemType" ON "ItemMovement"."itemTypeId" = "ItemType".id
      WHERE "ItemMovement"."createdAt" >= ${input.beginDate} 
      AND "ItemMovement"."createdAt" <= ${input.endDate} 
      AND "itemMovementTypeId" = 2
    `);

      return result.reduce((prev, curr) => curr.totalQuantity + prev, 0);
    }),
  getQuantityOfItemsUsedBetweenDates: publicProcedure
    .input(
      z.object({
        beginDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.$queryRaw<
        {
          totalQuantity: number;
        }[]
      >(Prisma.sql`
      SELECT SUM(CASE
        WHEN "ItemMovement"."isBoxes" = True THEN
          CAST("ItemMovement".quantity AS FLOAT) * "ItemType"."boxQuantity"
        WHEN "ItemMovement"."isBoxes" = False THEN
          CAST("ItemMovement".quantity AS FLOAT) 
        ELSE 0
        END) AS "totalQuantity"
      FROM "ItemMovement"
      JOIN "ItemType" ON "ItemMovement"."itemTypeId" = "ItemType".id
      WHERE "ItemMovement"."createdAt" >= ${input.beginDate} 
      AND "ItemMovement"."createdAt" <= ${input.endDate} 
      AND "itemMovementTypeId" = 1
    `);

      return result.reduce((prev, curr) => curr.totalQuantity + prev, 0);
    }),
  getMoneyFlowByMonth: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.$queryRaw<
      { month: number; gastos: number; compras: number }[]
    >(Prisma.sql`
      WITH "MonthlySum" AS (
        SELECT 
          EXTRACT(MONTH FROM "ItemMovement"."createdAt") AS month,
          SUM(CASE 
            WHEN "ItemMovement"."itemMovementTypeId" = 1 AND "ItemMovement"."isBoxes" = False THEN
              "ItemMovement".quantity * "ItemType"."unitPrice"
            WHEN "ItemMovement"."itemMovementTypeId" = 1 AND "ItemMovement"."isBoxes" = True THEN
              "ItemMovement".quantity * "ItemType"."unitPrice" * "ItemType"."boxQuantity"
            ELSE 
            0 
          END) AS gastos,
          SUM(CASE 
            WHEN "ItemMovement"."itemMovementTypeId" = 2 AND "ItemMovement"."isBoxes" = False THEN
              "ItemMovement".quantity * "ItemType"."unitPrice"
            WHEN "ItemMovement"."itemMovementTypeId" = 2 AND "ItemMovement"."isBoxes" = True THEN
              "ItemMovement".quantity * "ItemType"."unitPrice" * "ItemType"."boxQuantity"
              ELSE 
              0 
            END) AS compras
        FROM 
          "ItemMovement"
        JOIN 
          "ItemType" ON "ItemMovement"."itemTypeId" = "ItemType"."id"
        WHERE 
          "ItemMovement"."itemMovementTypeId" IN (1, 2)
        GROUP BY 
          EXTRACT(MONTH FROM "ItemMovement"."createdAt")
      )
      SELECT 
        "MonthlySum".month,
        COALESCE(gastos, 0) AS gastos,
        COALESCE(compras, 0) AS compras
      FROM 
        generate_series(1, 12) AS m(month)
      LEFT JOIN 
        "MonthlySum" ON "MonthlySum".month = m.month;
      `);

    return result
      .map((record, idx) => {
        if (!record.month) return { ...record, month: idx + 1 };
        result[Number(record.month) - 1]!.month = idx + 1;
        return { ...record, month: Number(record.month) };
      })
      .sort((a, b) => {
        return a.month - b.month;
      })
      .map((record) => {
        return { ...record, month: numberToMonth(record.month) };
      });
  }),
});
