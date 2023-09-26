import { S3 } from "@aws-sdk/client-s3";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { env } from "../../env.mjs";

export const s3 = new S3({
  region: env.REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const signer = new SignatureV4({
  service: 'execute-api',
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  },
  sha256: Sha256,
  applyChecksum: false,
  uriEscapePath: false,
})