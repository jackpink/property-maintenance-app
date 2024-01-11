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
  createContractor: privateProcedure
  .input(z.object({ contractorId: z.string(), companyName: z.string() }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.contractor.create({
        data: {
            id: input.contractorId,
            companyName: input.companyName
        }
    });
  }),
  getContractor: privateProcedure
  .input(z.object({ contractorId: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.contractor.findUnique({
        where: {
            id: input.contractorId
        }
    });
  }),
  updateContractor: privateProcedure
  .input(z.object({ contractorId: z.string(), companyName: z.string().optional(), aboutStatement: z.string().optional() }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.contractor.update({
        where: {
            id: input.contractorId
        },
        data: {
            companyName: input.companyName,
            aboutStatement: input.aboutStatement
        }
    });
  }),
  

})