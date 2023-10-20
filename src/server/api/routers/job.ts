
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { type RouterOutputs } from "~/utils/api";

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
  getRecentJobsForHomeownerUser: privateProcedure
  .input(z.object({ user: z.string() }))
  .query( async ({ ctx, input }) => {
    const propertiesForHomeownerUser = await ctx.prisma.property.findMany({
      where: {
        homeownerUserId: input.user
      },
    });
    

    const homeownerPropertyIds: string[] = [];

    for (const property of propertiesForHomeownerUser) {
      homeownerPropertyIds.push(property.id);
    }
    
    console.log("homewoner properties", homeownerPropertyIds);
    
    return ctx.prisma.job.findMany({
 
        where: {
            ...(homeownerPropertyIds ? {
              AND: [
                {id: {
                  in: homeownerPropertyIds
                }
              },
              
              ]
            }
            : {})
        },
        orderBy: {
            date: 'desc'
        },
        include: {
            Property: true
        },
        take: 5
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
  getRecentJobsForProperty: privateProcedure
  .input(z.object({ propertyId: z.string()}))
  .query(({ctx, input}) => {
    return ctx.prisma.job.findMany({
      where: {
        propertyId: input.propertyId
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        Property: true,
      },
      take: 5
    })
  }),
  createJobForPropertyByTrade: privateProcedure
  .input(z.object({title: z.string(), date: z.date(), propertyId: z.string()}))
  .mutation(async ({ ctx, input }) => {

    const job = await ctx.prisma.job.create({
      data: {
        title: input.title,
        propertyId: input.propertyId,
        date: input.date,
        tradeUserId: ctx.currentUser
      }
    })
    return {job: job};
  }),
  createJobForPropertyByHomeowner: privateProcedure
  .input(z.object({title: z.string(), date: z.date(), propertyId: z.string()}))
  .mutation(async ({ctx, input}) => {
    const job = await ctx.prisma.job.create({
      data: {
        title: input.title,
        propertyId: input.propertyId,
        date: input.date
      }
    })
    return {job: job};
  }),
  getJobForTradeUser: privateProcedure
  .input(z.object({ jobId: z.string() }))
  .query(async ({ ctx, input }) => {

    const job = await ctx.prisma.job.findUniqueOrThrow({
      where: {
        id: input.jobId
      },
      include: {
        photos: true,
        rooms: {
          include: {
            Level: true
          }
        },
        Property: {
          include : {
            levels: {
              include: {
                rooms: true
                }
              }
            }
          }
        }
      })
    return job;
  }),
  getJobForHomeowner: privateProcedure
  .input(z.object({ jobId: z.string() }))
  .query(async ({ ctx, input }) => {

    const job = await ctx.prisma.job.findUniqueOrThrow({
      where: {
        id: input.jobId
      },
      include: {
        photos: true,
        rooms: {
          include: {
            Level: true
          }
        },
        Property: {
          include : {
            levels: {
              include: {
                rooms: true
                }
              }
            }
          }
        }
      })
    return job;
  }),
  addRoomToJob: privateProcedure
  .input(z.object({ jobId: z.string(), roomId: z.string()}))
  .mutation(async ({ctx, input}) => {
    //check whether room is actually in property assigned to job
    const job = await ctx.prisma.job.findUniqueOrThrow({
      where: {
        id: input.jobId
      },
      include: {
        Property: {
          include: {
            levels: {
              include: {
                rooms: true
              }
            }
          }
        }
      }
    });
    type Levels = RouterOutputs["job"]["getJobForTradeUser"]["Property"]["levels"]
    const checkRoomIsInProperty = (levels: Levels, roomId: string) => {

      for (const level of levels) {
          const rooms = level.rooms;
        for (const room of rooms) {
          if (room.id === roomId) {
            console.log("TRUE")
            return true;
          }
        }
      }
      return false;
    }
    
    const roomIsInproperty = checkRoomIsInProperty(job.Property.levels, input.roomId);
    if (!roomIsInproperty) {
      console.log("ROOMS IS NOT IN PROPERTY")
      //throw error
      throw new TRPCError({
        code:"FORBIDDEN"
      })

    } else {
      console.log("ROOMS IS IN PROPERTY")
      const job = await ctx.prisma.job.update({
        where: {
          id: input.jobId,
        },
        data: {
          rooms: {
            connect: {
              id: input.roomId
            }
          }
        }
      });
      return job;
    }
  }),
  removeRoomFromJob: privateProcedure
  .input(z.object({jobId: z.string(), roomId: z.string()}))
  .mutation(async ({ctx, input}) => {
    // Does the room have photos that are associated with this job attached
    const photos = await ctx.prisma.photo.findMany({
      where: {
        jobId: input.jobId,
        roomId: input.roomId
      }
    })
    if (photos.length > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST"
      })
    }
    const job = ctx.prisma.job.update({
      where: {
        id: input.jobId,
      },
      data: {
        rooms: {
          disconnect: {
            id: input.roomId
          }
        }
      }
    })
    return job;
  }),
  getJobsForRoom: privateProcedure
  .input(z.object({roomId: z.string()}))
  .query(async ({ctx, input}) => {
    const room = await ctx.prisma.room.findFirstOrThrow({
      where: {
        id: input.roomId
      },
      include: {
        jobs: true
      }
    })
    return room.jobs;
  }),
  updateDateForJob: privateProcedure
  .input(z.object({jobId: z.string(), date: z.date()}))
  .mutation( async ({ ctx, input }) => {

    const newJob = await ctx.prisma.job.update({
      where: {
        id: input.jobId,
      },
      data: {
        date: input.date,
      },
    })
    return newJob;
  }),
  updateTradeContactForJob: privateProcedure
  .input(z.object({jobId: z.string(), tradeName: z.string(), tradeEmail: z.string().optional(), tradePhone: z.string().optional()}))
  .mutation( async({ ctx, input}) => {
    const json = {
      name: input.tradeName,
      email: input.tradeEmail,
      phone: input.tradePhone
    } as Prisma.JsonObject
    const newJob = await ctx.prisma.job.update({
      where: {
        id: input.jobId
      },
      data: {
        nonUserTradeInfo: json
      }
    })
  }),
  updateNotesForJob:privateProcedure
  .input(z.object({jobId: z.string(), notes: z.string()}))
  .mutation(async ({ ctx, input }) => {
    console.log(input.notes);
    const notes = await ctx.prisma.job.update({
      where: {
        id: input.jobId
      },
      data: {
        notes: input.notes
      }
    })
    console.log(notes)
  })
});