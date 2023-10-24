import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import {  getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../../env.mjs";
import { v4 as uuidv4 } from 'uuid';
import { TRPCError } from "@trpc/server";


export const productRouter= createTRPCRouter({
  
  

  createProductForJob: privateProcedure
  .input(z.object({ label:z.string(),  installDate: z.date(), jobId:z.string()}))
  .mutation(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.create({
      data: {
        label: input.label,
        installDate: input.installDate,
        jobId: input.jobId
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
  
});