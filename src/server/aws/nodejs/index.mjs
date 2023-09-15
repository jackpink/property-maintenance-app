// dependencies
import { S3, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import {Response} from 'node-fetch';
//const util = require('util');
//const sharp = require('sharp');

export const handler = async (event) => {

    // Read options from the event parameter.
    //console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    // Object key may have spaces or unicode non-ASCII characters.
    let path, size;
    try {
        [path, size] = getBodyParameters(event);
    }
    catch (error) {
        console.log(error);
        let response = {
            statusCode: 400,
            body: JSON.stringify(error)
        };
        return response;

    }
    const [user, category, file] = path.split("/");
   
    

    // Download the image from the S3 source bucket.
    const s3 = new S3({
        region: process.env.REGION,
        credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
    }); 
    let originalImage;
    try {
        originalImage = await getImageFroms3(path, s3);
    } catch (error) {
        console.log(error);
        let response = {
            statusCode: 400,
            body: JSON.stringify(error)
        };
        return response;
    }
    console.log(originalImage);
    let resizedImage
    if (size === "full") {
        resizedImage = await convertImage(originalImage);
    } else {
        resizedImage = await convertAndResizeImage(originalImage, size);
    }
    
    const destPath = getNewPath(size, path);

    console.log(resizedImage);

    const uploadImageResponse = await uploadImageToNewPath(destPath, resizedImage, s3);

    console.log(uploadImageResponse);

    let response = {
        statusCode: 200,
        body: JSON.stringify("Got image")
    };
    return response;
};

const getQueryStringParameters = (event) => {
    try {
        console.log(event.queryStringParameters);
        const path = decodeURIComponent(event.queryStringParameters.path);
        const size = event.queryStringParameters.size;
        return [path, size];
    } catch ( error) {
        throw "Error with query string parameters, path and size required";
    }
}

const getBodyParameters = (event) => {
    try{
        console.log(event.body);
        const body = JSON.parse(event.body);
        const path = body.path;
        const size = body.size;
        return [path, size];
    } catch (error) {
        throw "Error with request Body, path and string JSON required";
    }
}

const checkImageType = (file) => {
    const typeMatch = file.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.log("Could not determine the image type.");
        throw "Could Not Determine Image Type";
    }

    // Check that the image type is supported
    const imageType = typeMatch[1].toLowerCase();
    if (imageType != "jpg" && imageType != "png" && imageType != "jpeg" && imageType != "tiff") {
        console.log(`Unsupported image type: ${imageType}`);
        throw "Unsupported Iamge type, jpg png jpeg and tiff only supported currently";
    }
};

const getImageFroms3 = async (path, s3) => {
    // get reference to S3 client
    
    try {
        const params = {
            Bucket: "property-maintenance-app-photos",
            Key:  path
        };
        console.log("params ", params);
        const command = new GetObjectCommand(params);
        const response = await s3.send(command);
        console.log("Got original image");
        const res = new Response(response.Body);
        const arrayBuf = await res.arrayBuffer();
        //const buffer = Buffer.concat(await response.Body.toArray());
        return arrayBuf;
  
    } catch (error) {
        console.log(error);
        throw "Could not get Image from S3"
        return;
    }
}

const convertAndResizeImage = async (originalImage, size) => {
    // set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
    let width;
    if (size === "sm") width = 300;
    if (size === "md") width = 450;

    // Use the sharp module to resize the image and save in a buffer.
    try {
        console.log("Attempting to resize image");
        var buffer = await sharp(originalImage)
            .toFormat('jpg')
            .resize(width, width)
            .withMetadata()
            .toBuffer();
        console.log("Image resized, returning buffer")
        return buffer;

    } catch (error) {
        console.log(error);
        return;
    }
}

const convertImage = async (originalImage) => {

    try {
        console.log("Attempting to converted image");
        var buffer = await sharp(originalImage)
            .toFormat('jpg')
            .withMetadata()
            .toBuffer();
        console.log("Image converted, returning buffer")
        return buffer;

    } catch (error) {
        console.log(error);
        return;
    }
}

const getNewPath = (size, path) => {
    const [user, category, file] = path.split("/");
    const [filename, extension] = file.split(".");
    const newPath = user + "/" + size + "/" + filename + ".jpg";
    console.log("new destination path is ", newPath);
    return newPath;
}

const uploadImageToNewPath = async (path, buffer, s3) => {
    // Upload the thumbnail image to the destination bucket
    try {
        console.log("Attemptign to upload resized image to new path")
        const destParams = {
            Bucket: "property-maintenance-app-photos",
            Key: path,
            Body: buffer,
            ContentType: "image"
        };

        console.log("destparams ", destParams);
        const command = new PutObjectCommand(destParams);
        const response = await s3.send(command);
        return response;

    } catch (error) {
        console.log(error);
        return;
    }
}
