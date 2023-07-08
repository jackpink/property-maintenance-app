
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
  }),
  createJobForPropertyByTrade: privateProcedure
  .input(z.object({title: z.string(), date: z.date(), propertyId: z.string()}))
  .mutation(async ({ ctx, input }) => {

    const job = await ctx.prisma.job.create({
      data: {
        title: input.title,
        propertyId: '',
        date: input.date,
        tradeUserId: ctx.currentUser
      }
    })
    return {job: job};
  }),
});