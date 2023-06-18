
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const propertyRouter = createTRPCRouter({
  
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.property.findMany();
  }),
  getPropertiesForUser: publicProcedure
    .input(z.object({ user: z.string() }))
    .query(({ input, ctx }) => {
        // getproperties associated with user, in future only include relevant jobs (this could be a graphql solution)
        const properties = ctx.prisma.property.findMany({
            where: {
              jobs: {
                some: {
                  tradeUserId: input.user
                }
              }
            },
            include: {
              jobs: true
            }
            })
        
      return {
        properties: properties,
      };
    }),
});
