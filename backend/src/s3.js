const {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const BUCKET = process.env.RUSTFS_BUCKET || "meal-images";

const s3 = new S3Client({
  endpoint: process.env.RUSTFS_ENDPOINT || "http://rustfs:9000",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.RUSTFS_ACCESS_KEY || "tholth_admin",
    secretAccessKey: process.env.RUSTFS_SECRET_KEY || "tholth_rustfs_2024",
  },
  forcePathStyle: true,
});

/**
 * Create the bucket if it doesn't already exist.
 */
async function ensureBucket() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
    console.log(`Bucket "${BUCKET}" created.`);
  }
}

/**
 * Upload a file buffer to the bucket.
 */
async function uploadFile(key, buffer, mimetype) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    })
  );
}

/**
 * Generate a presigned GET URL (1-hour expiry).
 * Returns null if no key is provided.
 */
async function getPresignedUrl(key) {
  if (!key) return null;

  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: 3600 }
  );
}

module.exports = { s3, ensureBucket, uploadFile, getPresignedUrl };
