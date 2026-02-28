export function minioConfig() {
  const raw = process.env.MINIO_HOST ?? process.env.MINIO_URL ?? ""
  let endPoint: string
  let port: number
  let useSSL: boolean
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const url = new URL(raw)
      endPoint = url.hostname
      port = url.port ? Number(url.port) : url.protocol === "https:" ? 443 : 80
      useSSL = url.protocol === "https:"
    } catch {
      endPoint = raw.replace(/^https?:\/\//, "").split("/")[0].split(":")[0]
      port = Number(process.env.MINIO_PORT || "443")
      useSSL = process.env.MINIO_USE_SSL !== "false"
    }
  } else {
    endPoint = raw.split("/")[0].split(":")[0]
    port = Number(process.env.MINIO_PORT || "443")
    useSSL = process.env.MINIO_USE_SSL !== "false"
  }
  return {
    endPoint,
    port,
    useSSL,
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
  }
}