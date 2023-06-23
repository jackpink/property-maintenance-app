import { createTRPCRouter } from "~/server/api/trpc";
import { propertyRouter } from "./routers/property";
import { exampleRouter } from "./routers/example";
import { jobRouter } from "./routers/job";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  property: propertyRouter,
  example: propertyRouter,
  job: jobRouter

});

// export type definition of API
export type AppRouter = typeof appRouter;

