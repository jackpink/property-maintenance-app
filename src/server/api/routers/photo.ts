import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../../env.mjs";
import { v4 as uuidv4 } from 'uuid';

export const photoRouter = createTRPCRouter({
  
  getPhotoUploadPresignedUrl: privateProcedure
  .input(z.object({ key: z.string() }))
  .mutation(async ({ ctx, input}) => {
    // Create a record of the photo
    console.log("GETTING SIGNED URL FOR UPLOAD")
    // try change name here
    const filenameArray = input.key.split(".");
    const fileExtension = filenameArray[1];
    const uuidName = uuidv4();
    const newFilename = uuidName + "." + fileExtension;
    console.log("new filename ", newFilename);
    const key = ctx.currentUser + "/original/" + newFilename;
    
    const { s3 } = ctx

    const putObjectCommand = new PutObjectCommand({
        Bucket: env.PHOTO_BUCKET_NAME,
        Key: key, 
    });

    const url = await getSignedUrl(s3, putObjectCommand);

    return {url: url, filename: newFilename};
    

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
  .input(z.object({ name: z.string(), type: z.enum(["sm","original"] as const)}))
  .query(async ({ ctx, input }) => {
    // Create a record of the photo
    console.log("GETTING SIGNED URL FOR Download")   

    const { s3 } = ctx

    const key = ctx.currentUser + "/" + input.type + "/" + input.name;

    const params = {
      Bucket: env.PHOTO_BUCKET_NAME,
      Key: key, 
    }
    const metadata = await s3.headObject(params);
    console.log("meta", metadata);
    try{
      await s3.headObject(params);
    } catch (error) {
      if (error === 'NotFound'){
        console.log("error on file, NEED TO RESIZE", error);
      }
      console.log("error on file, NEED TO RESIZE", error);
    }

    const getObjectCommand = new GetObjectCommand(params); 

    
    const url = await getSignedUrl(s3, getObjectCommand); 
    
    console.log("url is ", url)

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