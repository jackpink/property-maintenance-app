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
  })
})