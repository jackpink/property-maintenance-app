import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  
  createHomeowner: privateProcedure
  .input(z.object({ user: z.string() }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.homeownerUser.create({
        data: {
            id: input.user
        }
    });
  }),
  checkHomeownerExists: privateProcedure
  .input(z.object({ user: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.homeownerUser.findUnique({
        where: {
            id: input.user
        }
    });
  }),
  checkContractorExists: privateProcedure
  .input(z.object({ contractorId: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.contractor.findUnique({
        where: {
            id: input.contractorId
        }
    });
  }),
  

})