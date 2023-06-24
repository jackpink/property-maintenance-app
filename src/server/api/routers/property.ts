
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const propertyRouter = createTRPCRouter({
  
  getAll: publicProcedure
  .input(z.object({ state: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.property.findMany({
      where: {
        state: input.state
      }
    });
  }),
 
  getPropertiesWithJobs: publicProcedure
  .input(z.object({ user: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.property.findMany({
      include: {
        jobs: true
      },
      where: {
        jobs: {
          some: {
            tradeUserId: input.user
          }
        }
      }
    })
  }),
  getPropertiesForTradeUser: publicProcedure
  .input(z.object({ user: z.string() }))
  .query( async ({ ctx, input }) => {
    const propertiesWithJobsByTradeuser = await ctx.prisma.property.findMany({
      select: {
        jobs: {
          where: {
            tradeUserId: input.user,
          },
          orderBy: {
            date: 'desc'
          }
        },
        apartment: true,
        streetNumber: true,
        street: true,
        suburb: true,
        postcode: true,
        state: true,
        country: true,
        id: true,
        createdAt: true
        
      }
    });
    const relevantProperties = propertiesWithJobsByTradeuser.filter((property) => {
      return property.jobs.length > 0;
    })
    return relevantProperties;
  }),
  getPropertiesForTradeUserRawSQL : publicProcedure
  .input(z.object( {user: z.string() }))
  .query(({ ctx, input }) => {
    const props = ctx.prisma.$queryRaw`SELECT * from Property INNER JOIN Job ON Property.id=Job.propertyId WHERE tradeUserId=${input.user}`;
    return props
  })
});
