import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import {  getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../../env.mjs";
import { v4 as uuidv4 } from 'uuid';
import { TRPCError } from "@trpc/server";


export const documentRouter = createTRPCRouter({
  
  getDocumentUploadPresignedUrl: privateProcedure
  .input(z.object({ key: z.string(), property: z.string() }))
  .mutation(async ({ ctx, input}) => {
    // Create a record of the photo
    console.log("GETTING SIGNED URL FOR UPLOAD")
    // try change name here
    const filenameArray = input.key.split(".");
    const fileExtension = filenameArray[1];
    if (!fileExtension) throw new TRPCError({code: "BAD_REQUEST"});
    const uuidName = uuidv4();
    const newFilename = input.property + "/" + uuidName + "." + fileExtension;
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
  .input(z.object({filename: z.string(), label:z.string(), jobId: z.string().optional(), propertyId: z.string().optional()}))
  .mutation(async ({ ctx, input }) => {
    const document = await ctx.prisma.document.create({
      data: {
        filename: input.filename,
        label: input.label,
        jobId: input.jobId ? input.jobId : null,
        propertyId: input.propertyId ? input.propertyId : null

      }
    });
    return document;

  }),
  createDocumentRecordForGroup: privateProcedure
  .input(z.object({filename: z.string(), label:z.string(), documentGroupId: z.number(), jobId: z.string().optional(), propertyId: z.string().optional()}))  
  .mutation(async ({ ctx, input }) => {
    const document = await ctx.prisma.document.create({
      data: {
        filename: input.filename,
        label: input.label,
        jobId: input.jobId ? input.jobId : null,
        propertyId: input.propertyId ? input.propertyId : null,
        documentGroupId: input.documentGroupId

      }
    });
    return document;

  }),

  getDocument: privateProcedure
  .input(z.object({ filename: z.string() }))
  .query(async ({ ctx, input }) => {
    // Create a record of the photo
    console.log("GETTING SIGNED URL FOR Download")   
  
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

  getDocumentsForJobWithNoGroup: privateProcedure
  .input(z.object({ jobId: z.string()}))
  .query(async ({ ctx, input }) => {
    const documents = ctx.prisma.document.findMany({
      where: {
        jobId: input.jobId,
        documentGroupId: null
      }
  })
  return documents;
  }),
  getDocumentsForPropertyWithNoGroup: privateProcedure
  .input(z.object({ propertyId: z.string()}))
  .query(async ({ ctx, input }) => {
    const documents = ctx.prisma.document.findMany({
      where: {
        propertyId: input.propertyId,
        documentGroupId: null
      }
  })
  return documents;
  }),

  getDocumentGroupsForProperty: privateProcedure
  .query(async ({ ctx }) => {
  const documentGroups = ctx.prisma.documentGroup.findMany(
      {
        where: {
          parent: "PROPERTY"
      }
    }
    )
    return documentGroups;
  }),
  getDocumentsForGroupForProperty: privateProcedure
  .input(z.object({ documentGroupId: z.number(), propertyId: z.string() }))
  .query(async ({ ctx, input }) => {
    const documents = ctx.prisma.document.findMany({
      where: {
        documentGroupId: input.documentGroupId,
        propertyId: input.propertyId
      }
  })
  return documents;
  }
  ),
  getDocumentsForGroupForJob: privateProcedure
  .input(z.object({ documentGroupId: z.number(), jobId: z.string() }))
  .query(async ({ ctx, input }) => {
    const documents = ctx.prisma.document.findMany({
      where: {
        documentGroupId: input.documentGroupId,
        jobId: input.jobId
      }
  })
  return documents;
  }
  ),
  getDocumentGroupsForJob: privateProcedure
  .query(async ({ ctx }) => {
  const documentGroups = ctx.prisma.documentGroup.findMany(
      {
        where: {
          parent: "JOB"
      }
    }
    )
    return documentGroups;
  }),
  
});