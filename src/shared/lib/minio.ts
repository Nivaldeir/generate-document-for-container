import { Client } from "minio";
import { Readable } from "stream";
import { minioConfig } from "../config/minio-config";

export interface MinioUploadParams {
  fileName: string
  buffer: Buffer
  contentType?: string
  prefix?: string
}

export interface MinioUploadResult {
  objectName: string
  url: string
}

export class MinioS3 {
  private static readonly BUCKET = process.env.MINIO_BUCKET_DOCUMENTS ?? process.env.MINIO_BUCKET_NAME!
  private static readonly client = new Client(minioConfig())

  static async ensureBucket(): Promise<void> {
    const exists = await this.client.bucketExists(this.BUCKET)
    if (!exists) await this.client.makeBucket(this.BUCKET, "us-east-1")
  }

  static async upload(params: MinioUploadParams) {
    await this.ensureBucket()
    return this.client.putObject(
      this.BUCKET,
      params.fileName,
      params.buffer,
      params.buffer.length,
      { "Content-Type": params.contentType || "application/octet-stream" }
    )
  }

  static buildAssetUrl(objectName: string): string {
    return `/api/asset?key=${encodeURIComponent(objectName)}`
  }

  static async uploadWithFixedKey(params: {
    key: string
    buffer: Buffer
    contentType: string
  }): Promise<MinioUploadResult> {
    await this.ensureBucket()
    const objectName = params.key.replace(/^\/+/, "")
    await this.client.putObject(
      this.BUCKET,
      objectName,
      params.buffer,
      params.buffer.length,
      { "Content-Type": params.contentType }
    )
    return { objectName, url: this.buildAssetUrl(objectName) }
  }

  static async uploadWithUniqueName(params: MinioUploadParams): Promise<MinioUploadResult> {
    await this.ensureBucket()
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const baseName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
    const objectNameBase = `${timestamp}-${randomStr}-${baseName}`
    const objectName = params.prefix
      ? `${params.prefix.replace(/\/+$/, "")}/${objectNameBase}`
      : objectNameBase

    await this.client.putObject(
      this.BUCKET,
      objectName,
      params.buffer,
      params.buffer.length,
      { "Content-Type": params.contentType || "application/octet-stream" }
    )

    return { objectName, url: this.buildAssetUrl(objectName) }
  }

  static async statObject(objectName: string) {
    return this.client.statObject(this.BUCKET, objectName)
  }

  static async getObjectBuffer(objectName: string): Promise<{ buffer: Buffer; contentType: string }> {
    const stat = await this.statObject(objectName)
    const stream = (await this.client.getObject(this.BUCKET, objectName)) as Readable
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
    }
    return {
      buffer: Buffer.concat(chunks),
      contentType: stat.metaData?.["content-type"] ?? "application/octet-stream",
    }
  }

  static parseUrl(url: string): { bucket: string; objectName: string } | null {
    try {
      const u = new URL(url)
      const parts = u.pathname.replace(/^\/+/, "").split("/")
      if (parts.length < 2) return null
      return { bucket: parts[0], objectName: parts.slice(1).join("/") }
    } catch {
      return null
    }
  }

  static async getObject(objectName: string): Promise<ReadableStream> {
    const stream = await this.client.getObject(this.BUCKET, objectName)
    return Readable.toWeb(stream as Readable) as ReadableStream
  }
}
