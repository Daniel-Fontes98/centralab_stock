import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { supplierRouter } from "./routers/supplier";
import { itemMovementRouter } from "./routers/itemMovement";
import { itemTypeRouter } from "./routers/itemType";
import { itemMovementTypeRouter } from "./routers/itemMovementType";
import { departmentRouter } from "./routers/department";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  supplier: supplierRouter,
  itemMovement: itemMovementRouter,
  itemMovementType: itemMovementTypeRouter,
  itemType: itemTypeRouter,
  department: departmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
