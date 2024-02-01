import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import {  getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AbortMultipartUploadCommand, CompleteMultipartUploadCommand, CreateMultipartUploadCommand, GetObjectAclCommand, GetObjectCommand, PutObjectCommand, UploadPartCommand } from "@aws-sdk/client-s3";
import { env } from "../../../env.mjs";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { aws4Interceptor } from "aws4-axios";
import { TRPCError } from "@trpc/server";

const MAX_FILE_SIZE = 10000000;
function checkFileType(file: File) {
    if (file?.name) {
        const fileType = file.name.split(".").pop();
        console.log("file type is ", fileType);
        if (fileType === "mp4" ) return true;
    }
    return false;
}
/**
 * Router for handling photo-related API requests.
 * @remarks
 * This router contains methods for uploading, creating records, and retrieving photos.
 * @packageDocumentation
 */
export const guideRouter = createTRPCRouter({
  
  getUploadPresignedUrl: privateProcedure
  .input(z.object({ key: z.string(), guideId: z.string(), multimediaType: z.enum(["IMAGE", "VIDEO"] as const)}))
  .mutation(async ({ ctx, input}) => {
    // Create a record of the photo
    console.log("GETTING SIGNED URL FOR UPLOAD")
    // try change name here
    const filenameArray = input.key.split(".");
    const fileExtension = filenameArray.pop()
    if (!fileExtension) throw new TRPCError({code: "BAD_REQUEST"});
    const uuidName = uuidv4();
    const newFilename = input.guideId + "/" + uuidName + "." + fileExtension;
    console.log("new filename ", newFilename);
    const key =  newFilename;
    
    const { s3 } = ctx

    const putObjectCommand = new PutObjectCommand({
        Bucket: input.multimediaType ==="IMAGE" ? env.GUIDE_PHOTOS_BUCKET_NAME : env.GUIDE_VIDEOS_BUCKET_NAME,
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
    console.log("     USER           ", ctx.currentUser)
    /* Need to update storage
    const user =  await ctx.prisma.homeownerUser.findFirst({
      where: {
        id: ctx.currentUser
      },
     
    }) */
    
    return photo;

  }),
  uploadVideo: privateProcedure
  .input(z.object({ 
    guideId: z.string(), 
    file: z.any()
      .refine((file: File) => file?.length !== 0, "File is required")
      /*.refine((file) => file.size < MAX_FILE_SIZE, "Max size is 5MB.")
      .refine((file) => checkFileType(file), "Only .pdf, .docx formats are supported."),*/
 }))
  .mutation(async ({ ctx, input}) => {
    // Create a record of the phot
    console.log("file", input.file);
    const fileExtension = input.file.name.split(".").pop();
    console.log("file", input.file);
       
    
    const uuidName = uuidv4();
    const newFilename = input.guideId + "/" + uuidName + "." + fileExtension;
    console.log("new filename ", newFilename);
    const key = newFilename;
    
    const { s3 } = ctx

  

   
  const bucketName = "property-maintenance-app-guide-videos";
  

  const buffer = Buffer.from(input.file, "utf8");

  let uploadId;

  try {
    const multipartUpload = await s3.send(
      new CreateMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );

    uploadId = multipartUpload.UploadId;

    const uploadPromises = [];
    // Multipart uploads require a minimum size of 5 MB per part.
    const partSize = Math.ceil(buffer.length / 5);

    // Upload each part.
    for (let i = 0; i < 5; i++) {
      const start = i * partSize;
      const end = start + partSize;
      uploadPromises.push(
        s3
          .send(
            new UploadPartCommand({
              Bucket: bucketName,
              Key: key,
              UploadId: uploadId,
              Body: buffer.subarray(start, end),
              PartNumber: i + 1,
            }),
          )
          .then((d) => {
            console.log("Part", i + 1, "uploaded");
            return d;
          }),
      );
    }

    const uploadResults = await Promise.all(uploadPromises);

    return await s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: uploadResults.map(({ ETag }, i) => ({
            ETag,
            PartNumber: i + 1,
          })),
        },
      }),
    );

    // Verify the output by downloading the file from the Amazon Simple Storage Service (Amazon S3) console.
    // Because the output is a 25 MB string, text editors might struggle to open the file.
  } catch (err) {
    console.error(err);

    if (uploadId) {
      const abortCommand = new AbortMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        UploadId: uploadId,
      });

      await s3.send(abortCommand);
    }
  }


  }),
  getVideo: privateProcedure
  .input(z.object({ name: z.string()}))
  .query( async ({ ctx, input }) => {
    // Get presigned url
    const { s3 } = ctx
    const params = {
      Bucket: env.GUIDE_VIDEOS_BUCKET_NAME,
      Key: input.name, 
    }
    const getObjectCommand = new GetObjectCommand(params); 
    const url = await getSignedUrl(s3, getObjectCommand); 
      
      console.log("url is ", url)

      return url;
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
      Bucket: env.GUIDE_PHOTOS_BUCKET_NAME,
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
      console.log("Photo Found, now getting signed url to return", metaUrl);
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
  createGuideForProduct: privateProcedure
    .input(z.object({ productId: z.string(), contractorId: z.string(), label: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const guide = await ctx.prisma.guide.create({
        data: {
          productId: input.productId,
          contractorId: input.contractorId,
          label: input.label ?? "New Guide"
        }
      });
      return guide;
    }),
    getGuide: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const guide = await ctx.prisma.guide.findUniqueOrThrow({
        where: {
          id: input.id
        },
        include: {
          steps: {
            orderBy: {
              order: "asc"
            },
            include: {
              multimedia: true
            }
          }
          
        }
      });
      return guide;
    }),
    updateGuide: privateProcedure
    .input(z.object({ id: z.string(), label: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const guide = await ctx.prisma.guide.update({
        where: {
          id: input.id
        },
        data: {
          label: input.label
        }
      });
      return guide;
    }),
    updateStep: privateProcedure
    .input(z.object({ id: z.string(), text: z.string().optional()}))
    .mutation(async ({ ctx, input }) => {
      const step = await ctx.prisma.step.update({
        where: {
          id: input.id
        },
        data: {
          text: input.text,
        }
      });
      return step;
    }),
    createStepMultimedia: privateProcedure
    .input(z.object({ stepId: z.string(), type: z.enum(["IMAGE", "VIDEO"] as const), filename: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log("creating multimedia", input.filename, input.type, input.stepId);
      const multimedia = await ctx.prisma.stepMultimedia.create({
        data: {
          stepId: input.stepId,
          type: input.type,
          filename: input.filename
        }
      });
      return multimedia;
    }),

});

 
  
 