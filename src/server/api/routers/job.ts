
import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { type RouterOutputs } from "~/utils/api";
import { getJobHistory, updateJobHistory } from "../mongoDB/jobHistory";


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
    
    const jobs = [];
    const homeownerPropertyIds: string[] = [];

    for (const property of propertiesForHomeownerUser) {
      homeownerPropertyIds.push(property.id);
      const jobsForProperty = await ctx.prisma.job.findMany({
        where: {
          propertyId: property.id
        }, include: {
          Property: true
        },  
      })
      jobs.push(...jobsForProperty);

    }

    
    jobs.sort((a, b) => {
      return b.date.getTime() - a.date.getTime();
    });
    console.log("homewoner properties", jobs);
    
    return jobs;
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
  getJob: privateProcedure
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
      // check user permissions

    const isTradeUser =  (job.tradeUserId === ctx.currentUser)
    const isHomeownerUser = (job.Property.homeownerUserId === ctx.currentUser)
    if (!isTradeUser && !isHomeownerUser) {
      throw new TRPCError({
        code: "FORBIDDEN"
      })
    }
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
  getJobsForRooms: privateProcedure
  .input(z.object({roomIds: z.array(z.string())}))
  .query(async ({ctx, input}) => {
    const jobs = await ctx.prisma.job.findMany({
      where: {
        rooms: {
          some: {
            id: {
              in: input.roomIds
            }
          }
        }
      }
    })
    return jobs;
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
  updateNotesForJob:privateProcedure
  .input(z.object({jobId: z.string(), notes: z.string()}))
  .mutation(async ({ ctx, input }) => {
    // first check that the user is a trade user and that the job is assigned to them

    const job = await ctx.prisma.job.findUniqueOrThrow({
      where: {
        id: input.jobId
      },
      include: {
        Property: true
      }
    })
    const isTradeUser =  (job.tradeUserId === ctx.currentUser)
    const isHomeownerUser = (job.Property.homeownerUserId === ctx.currentUser)
    if (!isTradeUser && !isHomeownerUser) {
      throw new TRPCError({
        code: "FORBIDDEN"
      })
    }
    // Update history of notes on MongoDB
    const update = {$push: { homeownerNotes: {notes: input.notes, date: new Date() } }};
    await updateJobHistory(update, input.jobId);
      
    

    // if they are a trade user, update the trade notes, if they are a homeowner user, update the homeowner notes

    let notes;
    if (isHomeownerUser) {
      console.log(input.notes);
      notes = await ctx.prisma.job.update({
        where: {
          id: input.jobId
        },
        data: {
          notes: input.notes
        }
    })} else {
      notes = await ctx.prisma.job.update({
        where: {
          id: input.jobId
        },
        data: {
          tradeNotes: input.notes
        }
      })
    }
    console.log(notes);
    return notes;
  }),
  getHistoryForJob: privateProcedure
  .input(z.object({jobId: z.string()}))
  .query(async ({ctx, input}) => {
    const job = await ctx.prisma.job.findUniqueOrThrow({
      where: {
        id: input.jobId
      },
      include: {
        Property: true
      }
    })
    const isTradeUser =  (job.tradeUserId === ctx.currentUser)
    const isHomeownerUser = (job.Property.homeownerUserId === ctx.currentUser)
    if (!isTradeUser && !isHomeownerUser) {
      throw new TRPCError({
        code: "FORBIDDEN"
      })
    }
    const history = getJobHistory(input.jobId);
    return history;
  }),
  getFilteredJobsforProperty: privateProcedure
  .input(z.object({ propertyId: z.string(), title: z.string().optional(), rooms: z.array(z.string()).optional()}))
  .query(async ({ ctx, input }) => {
    if (input.rooms && input.title) {
      const jobs = await ctx.prisma.job.findMany({
        where: {
          propertyId: input.propertyId,
          title: {
            contains: input.title
          },
          rooms: {
            some: {
              id: {
                in: input.rooms
              }
            }
          }
        },
        include: {
          Property: true,
          TradeUser: true
        }
      })
      return jobs;
    }
    else if (input.title) {
      const jobs = await ctx.prisma.job.findMany({
        where: {
          propertyId: input.propertyId,
          title: {
            contains: input.title
          }
        },
        include: {
          Property: true,
          TradeUser: true
        }
      })
      return jobs;
    } else if (input.rooms) {
      const jobs = await ctx.prisma.job.findMany({
        where: {
          propertyId: input.propertyId,
          rooms: {
            some: {
              id: {
                in: input.rooms
              }
            }
          }
        },
        include: {
          Property: true,
          TradeUser: true
        }
      })
      return jobs;
    } else {
      
      return [];
    }
  }),
  updateJob: privateProcedure
  .input(z.object({jobId: z.string(), title: z.string().optional(), date: z.date().optional(), nonTradeUserName: z.string().optional(), nonTradeUserEmail: z.string().optional(), nonTradeUserPhone: z.string().optional()}))
  .mutation(async ({ctx, input}) => {
    if (input.title) {
      const job = await ctx.prisma.job.update({
        where: {
          id: input.jobId
        },
        data: {
          title: input.title
        }
      })
      return job;
    } else if (input.date) {
      const job = await ctx.prisma.job.update({
        where: {
          id: input.jobId
        },
        data: {
          date: input.date
        }
      })
      return job;
    } else if (input.nonTradeUserName) {
      const job = await ctx.prisma.job.update({
        where: {
          id: input.jobId
        },
        data: {
          nonUserTradeName: input.nonTradeUserName,
        }
      })
      return job;
    } else if (input.nonTradeUserEmail) {
      const job = await ctx.prisma.job.update({
        where: {
          id: input.jobId
        },
        data: {
          nonUserTradeEmail: input.nonTradeUserEmail
        }
      })
      return job;
    } else if (input.nonTradeUserPhone) {
      const job = await ctx.prisma.job.update({
        where: {
          id: input.jobId
        },
        data: {
          nonUserTradePhone: input.nonTradeUserPhone
        }
      })
      return job;
    }
  }),
        
});