import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import {  getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../../env.mjs";
import { v4 as uuidv4 } from 'uuid';
import { TRPCError } from "@trpc/server";


export const documentRouter = createTRPCRouter({
  
  getDocumentUploadPresignedUrl: privateProcedure
  .input(z.object({ key: z.string(), userId: z.string() }))
  .mutation(async ({ ctx, input}) => {
    // Create a record of the photo
    console.log("GETTING SIGNED URL FOR UPLOAD")
    // try change name here
    const filenameArray = input.key.split(".");
    const fileExtension = filenameArray[1];
    if (!fileExtension) throw new TRPCError({code: "BAD_REQUEST"});
    const uuidName = uuidv4();
    const newFilename = input.userId + "/" + uuidName + "." + fileExtension;
    console.log("new filename ", newFilename);
    const key = newFilename;
    
    const { s3 } = ctx

    const putObjectCommand = new PutObjectCommand({
        Bucket: env.DOCUMENT_BUCKET_NAME,
        Key: key, 
    });

    const url = await getSignedUrl(s3, putObjectCommand);

    return {url: url, filename: newFilename};
    

    //return {url: 'urlstring'}

  }),

  createDocumentRecord: privateProcedure
  .input(z.object({filename: z.string().optional(), label:z.string(), documentGroupId: z.number()}))
  .mutation(async ({ ctx, input }) => {
    const document = await ctx.prisma.document.create({
      data: {
        filename: input.filename,
        label: input.label,
        documentGroupId: input.documentGroupId

      }
    });
    return document;

  }),
  updateDocumentRecord: privateProcedure
  .input(z.object({id: z.string(), label:z.string().optional(), jobId: z.string().optional(), propertyId: z.string().optional(), documentGroupId: z.number().optional(), contractorDocumentGroupId: z.number().optional(), filename: z.string().optional()}))
  .mutation(async ({ ctx, input }) => {
    const document = await ctx.prisma.document.update({
      where: {
        id: input.id
      },
      data: {
        label: input.label,
        documentGroupId: input.documentGroupId,
        filename: input.filename
      }
    });
    return document;

  }),
  

  getDocument: privateProcedure
  .input(z.object({ filename: z.string().optional() }))
  .query(async ({ ctx, input }) => {
    // Create a record of the photo
    console.log("GETTING SIGNED URL FOR Download")   
    if (!input.filename) throw new TRPCError({code: "BAD_REQUEST"});
    const { s3 } = ctx

    const key = input.filename;

    const params = {
      Bucket: env.DOCUMENT_BUCKET_NAME,
      Key: key, 
    }
    
    try{      
      const getObjectCommand = new GetObjectCommand(params); 

      const url = await getSignedUrl(s3, getObjectCommand); 
      
      console.log("url is ", url)

      return url;

    } catch (error) {
      throw new TRPCError({code: "BAD_REQUEST"});
    }
  }),


  

  createDocumentGroup: privateProcedure
  .input(z.object({ contractorId: z.string().optional(), label: z.string(), jobId: z.string().optional(), propertyId: z.string().optional(), productId: z.string().optional() }))
  .mutation(async ({ ctx, input }) => {
    const documentGroup = await ctx.prisma.documentGroup.create({
      data: {
        contractorId: input.contractorId,
        label: input.label,
        jobId: input.jobId,
        propertyId: input.propertyId,
        productId: input.productId
      }
    });
    return documentGroup;

  }),
  
  
});