import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../../env.mjs";

export const photoRouter = createTRPCRouter({
  
  getPhotoUploadPresignedUrl: privateProcedure
  .input(z.object({ key: z.string() }))
  .mutation(async ({ ctx, input}) => {
    // Create a record of the photo
    console.log("GETTING SIGNED URL FOR UPLOAD")
    // 
    const key = ctx.currentUser + "/original/" + input.key;
    
    const { s3 } = ctx

    const putObjectCommand = new PutObjectCommand({
        Bucket: env.PHOTO_BUCKET_NAME,
        Key: key, 
    });

    const url = await getSignedUrl(s3, putObjectCommand);

    return {url: url};
    

    //return {url: 'urlstring'}

  }),

  createPhotoRecord: privateProcedure
  .input(z.object({filename: z.string(), jobId: z.string()}))
  .mutation(async ({ ctx, input }) => {
    const photo = await ctx.prisma.photo.create({
      data: {
        filename: input.filename,
        directory: ctx.currentUser,
        jobId: input.jobId
      }
    });

  }),

  getPhoto: privateProcedure
  .input(z.object({ name: z.string(), type: z.enum(["original"] as const)}))
  .query(async ({ ctx, input }) => {
    // Create a record of the photo
    console.log("GETTING SIGNED URL FOR Download")
    // 
    const key = ctx.currentUser + "/" + input.type + "/" + input.name;
    
    const { s3 } = ctx

    const getObjectCommand = new GetObjectCommand({
        Bucket: env.PHOTO_BUCKET_NAME,
        Key: key, 
    });

    const url = await getSignedUrl(s3, getObjectCommand);

    return url;
  }),

  getUnassignedPhotosForJob: privateProcedure
  .input(z.object({ jobId: z.string()}))
  .query(async ({ ctx, input }) => {
    const photos = ctx.prisma.photo.findMany({
      where: {
        jobId: input.jobId
      }
  })
  return photos;
  })
  
});