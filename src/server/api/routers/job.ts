
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const jobRouter = createTRPCRouter({
  
  getRecentJobsForTradeUser: publicProcedure
  .input(z.object({ user: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.job.findMany({
        take:5,
        where: {
            tradeUserId: input.user
        },
        orderBy: {
            date: 'desc'
        },
        include: {
            photos: true,
            documents: true,
            Property: true
        }
    });
  }),
});