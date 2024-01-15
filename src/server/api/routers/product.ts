import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";


export const productRouter= createTRPCRouter({
  
  

  createProductItemForJob: privateProcedure
  .input(z.object({ label:z.string(),  installDate: z.date(), jobId:z.string(), roomId:z.string(), productId:z.string()}))
  .mutation(async ({ ctx, input }) => {
    const product = await ctx.prisma.productItem.create({
      data: {
        productId: input.productId,
        installDate: input.installDate,
        jobId: input.jobId,
        roomId: input.roomId
      }
    });
    return product;

  }),
  createProduct: privateProcedure
  .input(z.object({ manufacturer:z.string(), model:z.string(), label : z.string(), contractorId:z.string()}))
  .mutation(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.create({
      data: {
        manufacturer: input.manufacturer,
        model: input.model,
        label: input.label,
        contractorId: input.contractorId
      }
    });
    return product;

  }),
  getProductsForJob: privateProcedure
  .input(z.object({ jobId: z.string()}))
  .query(async ({ ctx, input }) => {
    const products = ctx.prisma.product.findMany({
      where: {
        jobId: input.jobId
      }
  })
  return products;
  }),
  createProductForRoom: privateProcedure
  .input(z.object({ label:z.string(), roomId:z.string()}))
  .mutation(async ({ ctx, input }) => {
    const product = await ctx.prisma.productItem.create({
      data: {
        label: input.label,
        roomId: input.roomId
      }
    });
    return {product: product};

  }),
  getProduct: privateProcedure
  .input(z.object({ id: z.string()}))
  .query(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.findUnique({
      where: {
        id: input.id
      },
      
    });
    return product;
  }),
  
});