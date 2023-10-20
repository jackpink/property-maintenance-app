import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import {  getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectAclCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../../env.mjs";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { aws4Interceptor } from "aws4-axios";
import { TRPCError } from "@trpc/server";


export const photoRouter = createTRPCRouter({
  
  getPhotoUploadPresignedUrl: privateProcedure
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
    const key = "original/" + newFilename;
    
    const { s3 } = ctx

    const putObjectCommand = new PutObjectCommand({
        Bucket: env.PHOTO_BUCKET_NAME,
        Key: key, 
    });

    const url = await getSignedUrl(s3, putObjectCommand);

    return {url: url, filename: newFilename};
    

    //return {url: 'urlstring'}

  }),

  createPhotoRecordForHomeowner: privateProcedure
  .input(z.object({filename: z.string(), jobId: z.string(), fileSize: z.number()}))
  .mutation(async ({ ctx, input }) => {
    /* Need to also update user storage based on file size  */
    const photo = await ctx.prisma.photo.create({
      data: {
        filename: input.filename,
        jobId: input.jobId
      }
    });
    const user =  await ctx.prisma.homeownerUser.update({
      where: {
        id: ctx.currentUser
      },
      data: {
        dataStorage: {
          increment: input.fileSize
        }
      }
    })
    return photo;

  }),

  createPhotoRecordForTrade: privateProcedure
  .input(z.object({filename: z.string(), jobId: z.string(), fileSize: z.number()}))
  .mutation(async ({ ctx, input }) => {
    /* Need to also update user storage based on file size  */
    const photo = await ctx.prisma.photo.create({
      data: {
        filename: input.filename,
        jobId: input.jobId
      }
    });
    const user =  await ctx.prisma.tradeUser.update({
      where: {
        id: ctx.currentUser
      },
      data: {
        dataStorage: {
          increment: input.fileSize
        }
      }
    })
    return photo;

  }),
  getPhoto: privateProcedure
  .input(z.object({ name: z.string(), type: z.enum(["sm","full"] as const)}))
  .query(async ({ ctx, input }) => {
    // Create a record of the photo
    console.log("GETTING SIGNED URL FOR Download")   
  
    const { s3 } = ctx

    const [ filename ] = input.name.split(".");
    if (!filename) throw new TRPCError({code: "BAD_REQUEST"});
    const convertedFilename = filename + ".jpg";

    const key = input.type + "/" + convertedFilename;

    const params = {
      Bucket: env.PHOTO_BUCKET_NAME,
      Key: key, 
    }
    
    const aclObjectCommand = new GetObjectAclCommand(params);
    //const headObjectCommand = new HeadObjectCommand(params);

    //const metaUrl = await s3.send(headBucketCommand);
    //console.log("meta", metaUrl);
    try{
      //const response = await fetch(metaUrl); // We may need to getSignedUrl to make this request
      //console.log("Meta data for Object is ", response);
      const metaUrl = await s3.send(aclObjectCommand);
      console.log("Photo Found, now getting signed url to return");
      const getObjectCommand = new GetObjectCommand(params); 

      const url = await getSignedUrl(s3, getObjectCommand); 
      
      console.log("url is ", url)

      return url;

    } catch (error) {
      console.log("Photo not found, must trigger a resize", params);
      //let url;
      // Make API call to function endpoint
      const endpoint = new URL('https://l8zsjwdvg4.execute-api.ap-southeast-2.amazonaws.com/dev');
      const path = "original" + "/" + input.name;
      const size = input.type 
      console.log("path is ", path);
      console.log("size is ", size);
      const body = {
        path: path,
        size: size
      }
      //endpoint.searchParams.append('path', path);
      //endpoint.searchParams.append('size', input.type);
      const cred = {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
      }
      const interceptor = aws4Interceptor({
        options: {
          region: "ap-southeast-2",
          service: "execute-api",
        },
        credentials: cred
      });
      const client = axios.create();
      client.interceptors.request.use(interceptor);
      console.log("endpoint string", decodeURIComponent(endpoint.toString()));
      const url = await client.post(endpoint.toString(), body).then( async () => {
        console.log("AXIOS AWS4 RESPONSE");
        // Now get signed url from s3
        const getObjectCommand = new GetObjectCommand(params); 

        return await getSignedUrl(s3, getObjectCommand)
        
        
      });
      console.log("The newly updated url is ", url);
      return url;
      

    }

    

    
  }),

  getUnassignedPhotosForJob: privateProcedure
  .input(z.object({ jobId: z.string()}))
  .query(async ({ ctx, input }) => {
    const photos = ctx.prisma.photo.findMany({
      where: {
        jobId: input.jobId,
        roomId: null
      }
  })
  return photos;
  }),
  getPhotosForJobAndRoom: privateProcedure
  .input(z.object({ jobId: z.string(), roomId: z.string()}))
  .query(async ({ ctx, input }) => {
    const photos = ctx.prisma.photo.findMany({
      where: {
        jobId: input.jobId,
        roomId: input.roomId
      }
  })
  return photos;
  }),
  movePhotoToRoom: privateProcedure
  .input(z.object({ photoId: z.string(), roomId: z.string()}))
  .mutation( async ({ ctx, input }) => {
    const newPhoto = ctx.prisma.photo.update({
      where: {
        id: input.photoId
      },
      data: {
        roomId: input.roomId
      }
    });
    return newPhoto;
  })
  
});