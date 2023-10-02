import { createTRPCRouter } from "~/server/api/trpc";
import { propertyRouter } from "./routers/property";
import { jobRouter } from "./routers/job";
import { photoRouter } from "./routers/photo";
import { userRouter } from "./routers/user";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  property: propertyRouter,
  user: userRouter,
  job: jobRouter,
  photo: photoRouter

});

// export type definition of API
export type AppRouter = typeof appRouter;

