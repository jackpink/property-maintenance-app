
import { z } from "zod";

import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";

export const jobRouter = createTRPCRouter({
  
  getRecentJobsForTradeUser: privateProcedure
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
            Property: true
        }
    });
  }),
  getRecentJobsForPropertyByTradeUser: privateProcedure
  .input(z.object({ propertyId: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.job.findMany({
      where: {
        tradeUserId: ctx.currentUser,
        propertyId: input.propertyId,
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        Property: true,
      }
    })
  })
});