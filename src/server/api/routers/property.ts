
import { z } from "zod";

import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";

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
  getPropertiesForHomeownerUser: privateProcedure
  .input(z.object({ user: z.string() }))
  .query( async ({ ctx, input }) => {
    const properties = await ctx.prisma.property.findMany({
      where: {
        homeownerUserId: input.user,
        
      },
      include: {
        jobs: true
      }
    });
    
    return properties;
  }),
  getPropertiesForTradeUserRawSQL : publicProcedure
  .input(z.object( {user: z.string() }))
  .query(({ ctx, input }) => {
    const props = ctx.prisma.$queryRaw`SELECT * from Property INNER JOIN Job ON Property.id=Job.propertyId WHERE tradeUserId=${input.user}`;
    return props
  }),
  getPropertyForTradeUser: privateProcedure
  .input(z.object({ id: z.string() }))
  .query( async ({ ctx, input }) => {
    const property =  ctx.prisma.property.findUniqueOrThrow({
      include: {
        levels: {
          include: {
            rooms: true
          }
        }
      }, where: {
        id: input.id
      }
    });
    return property
  }),
  createRoomForLevel: privateProcedure
  .input(z.object({label: z.string(), levelId: z.string()}))
  .mutation(async ({ ctx, input }) => {

    const room = await ctx.prisma.room.create({
      data: {
        label: input.label,
        levelId: input.levelId
      }
    })
    return room;
  }),
  createLevelForProperty: privateProcedure
  .input(z.object({label: z.string(), propertyId: z.string()}))
  .mutation(async ({ ctx, input }) => {

    const level = await ctx.prisma.level.create({
      data: {
        label: input.label,
        propertyId: input.propertyId
      }
    })
    return level;
  }),
  updateLevelLabel: privateProcedure
  .input(z.object({levelId: z.string(), newLabel: z.string()}))
  .mutation( async ({ ctx, input }) => {

    const newLevel = await ctx.prisma.level.update({
      where: {
        id: input.levelId,
      },
      data: {
        label: input.newLabel,
      },
    })
    return newLevel.label
  }),
  updateRoomLabel: privateProcedure
  .input(z.object({roomId: z.string(), newLabel: z.string()}))
  .mutation( async ({ ctx, input }) => {

    const newRoom = await ctx.prisma.room.update({
      where: {
        id: input.roomId,
      },
      data: {
        label: input.newLabel,
      },
    })
    return newRoom;
  }),
});
