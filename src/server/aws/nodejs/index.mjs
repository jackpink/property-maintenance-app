// dependencies
import { S3, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
//const util = require('util');
//const sharp = require('sharp');

export const handler = async (event) => {

    // Read options from the event parameter.
    //console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    // Object key may have spaces or unicode non-ASCII characters.
    try {
        const [path, size] = getQueryStringParameters(event);
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

    // Infer the image type from the file suffix.
    try {
        checkImageType(file);
        console.log("Image type Accepted");
    } catch (error) {
        console.log("Problem checking image type");
        console.log(error);
    }
    

    // Download the image from the S3 source bucket.
    const s3 = new S3({
        region: process.env.REGION,
        credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
    }); 

    const orignalImage = await getImageFroms3(path, s3);
    let resizedImage
    if (size === "full") {
        resizedImage = await convertImage(orignalImage);
    } else {
        resizedImage = await convertAndResizeImage(orignalImage, size);
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
        const path = decodeURIComponent(event.queryStringParameters.path);
        const size = event.queryStringParameters.size;
    } catch ( error) {
        throw "Error with query string parameters, path and size required";
    }
    return [path, size]
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
        const buffer = Buffer.concat(await response.Body.toArray());
        return buffer;
  
    } catch (error) {
        console.log(error);
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
        var buffer = await sharp(originalImage)
            .toFormat('jpg')
            .resize(width, width)
            .withMetadata()
            .toBuffer();
        return buffer;

    } catch (error) {
        console.log(error);
        return;
    }
}

const convertImage = async (originalImage) => {
    try {
        var buffer = await sharp(originalImage)
            .toFormat('jpg')
            .withMetadata()
            .toBuffer();
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
