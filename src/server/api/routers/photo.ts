import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { S3RequestPresigner, getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectAclCommand, GetObjectAttributesCommand, GetObjectCommand, HeadBucketCommand, HeadObjectCommand, PutObjectCommand,  } from "@aws-sdk/client-s3";
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
    const getMetadataCommand = new GetObjectAttributesCommand({
      Bucket: env.PHOTO_BUCKET_NAME,
      Key: key,
      ObjectAttributes: ["ObjectSize"],
    });
    const aclObjectCommand = new GetObjectAclCommand(params);
    const headObjectCommand = new HeadObjectCommand(params);

    const headBucketCommand = new HeadBucketCommand({
      Bucket: env.PHOTO_BUCKET_NAME
    })

    const signer = new S3RequestPresigner({
      ...s3.config,
    });

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
      console.log("Photo not found, must trigger a resize");
      // Make API call to function endpoint
      const endpoint = 'https://2xhggqz6rawdiukdnivka7taqm0rjoyz.lambda-url.ap-southeast-2.on.aws/'
      const result = await fetch(endpoint);
      console.log("RESULT", result);
    }

    

    
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