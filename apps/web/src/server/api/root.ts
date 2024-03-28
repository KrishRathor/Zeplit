import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { emailRouter } from "./routers/email";
import {  } from "@trpc/server/adapters/next";
import { kapsRouter } from "./routers/kaps";
import { connectedAppsRouter } from "./routers/connectedApps";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  email: emailRouter,
  kaps: kapsRouter,
  apps: connectedAppsRouter
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

