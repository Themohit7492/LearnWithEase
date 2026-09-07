import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const requiredEnv = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
];

let r2Client = null;

const getR2Config = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing Cloudflare R2 environment variables: ${missing.join(", ")}`
    );
  }

  return {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
    publicUrl: process.env.R2_PUBLIC_URL.replace(/\/$/, ""),
  };
};

const getR2Client = () => {
  if (!r2Client) {
    const { accountId, accessKeyId, secretAccessKey } = getR2Config();

    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return r2Client;
};

const normalizeKey = (key) => {
  if (!key) {
    throw new Error("R2 object key is required");
  }

  return String(key)
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/")
    .replace(/\s+/g, "-")
    .trim();
};

const getFileBuffer = async (file) => {
  if (file?.buffer) {
    return file.buffer;
  }

  if (file?.data) {
    return Buffer.from(file.data);
  }

  if (typeof file?.arrayBuffer === "function") {
    return Buffer.from(await file.arrayBuffer());
  }

  throw new Error("File buffer is missing");
};

const getContentType = (file, key) => {
  if (file?.mimetype) {
    return file.mimetype;
  }

  const lowerKey = String(key).toLowerCase();

  if (lowerKey.endsWith(".html")) return "text/html";
  if (lowerKey.endsWith(".css")) return "text/css";
  if (lowerKey.endsWith(".js")) return "application/javascript";
  if (lowerKey.endsWith(".json")) return "application/json";
  if (lowerKey.endsWith(".mp4")) return "video/mp4";
  if (lowerKey.endsWith(".webm")) return "video/webm";
  if (lowerKey.endsWith(".png")) return "image/png";
  if (lowerKey.endsWith(".jpg") || lowerKey.endsWith(".jpeg")) return "image/jpeg";
  if (lowerKey.endsWith(".webp")) return "image/webp";
  if (lowerKey.endsWith(".svg")) return "image/svg+xml";

  return "application/octet-stream";
};

export const uploadToR2 = async (file, key) => {
  const { bucketName, publicUrl } = getR2Config();
  const normalizedKey = normalizeKey(key);
  const buffer = await getFileBuffer(file);

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: normalizedKey,
      Body: buffer,
      ContentLength: buffer.length,
      ContentType: getContentType(file, normalizedKey),
    })
  );

  return `${publicUrl}/${normalizedKey}`;
};