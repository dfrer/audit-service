// Storage adapter -- for storing reports, PDFs, and delivery artifacts.
// Supports local filesystem (dev) and S3-compatible (production).

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const STORAGE_DIR = process.env.STORAGE_DIR || "./storage/deliveries";

export async function storeArtifact(orderId: string, filename: string, content: Buffer | string): Promise<string> {
  const orderDir = join(STORAGE_DIR, orderId);
  await mkdir(orderDir, { recursive: true });
  const filepath = join(orderDir, filename);

  if (typeof content === "string") {
    await writeFile(filepath, content, "utf-8");
  } else {
    await writeFile(filepath, content);
  }

  return filepath;
}

export async function getArtifactPath(orderId: string, filename: string): Promise<string> {
  return join(STORAGE_DIR, orderId, filename);
}

// PLACEHOLDER: S3 adapter for production use.
// npm install @aws-sdk/client-s3
/*
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function storeArtifactS3(_orderId: string, _filename: string, _content: Buffer): Promise<string> {
  const key = `deliveries/${_orderId}/${_filename}`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: _content,
  }));
  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
*/
