import { Readable } from 'stream';
import mongoose from 'mongoose';
import { getGridFSBucket } from '../config/db.js';

const urlCache = new Map<string, string>();

export function mediaUrl(fileId: string, baseUrl = ''): string {
  const prefix = baseUrl || '';
  return `${prefix}/api/media/${fileId}`;
}

export async function uploadBuffer(
  buffer: Buffer,
  filename: string,
  contentType: string,
  metadata: Record<string, unknown> = {},
): Promise<string> {
  const bucket = getGridFSBucket();
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: { ...metadata, contentType },
    });
    Readable.from(buffer)
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => resolve(uploadStream.id.toString()));
  });
}

export async function uploadFromUrl(
  url: string,
  filename: string,
  metadata: Record<string, unknown> = {},
): Promise<string> {
  if (urlCache.has(url)) return urlCache.get(url)!;
  if (url.startsWith('/api/media/')) {
    const id = url.replace('/api/media/', '');
    urlCache.set(url, id);
    return id;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const contentType = res.headers.get('content-type') || 'application/octet-stream';
  const buffer = Buffer.from(await res.arrayBuffer());
  const fileId = await uploadBuffer(buffer, filename, contentType, { ...metadata, originalUrl: url });
  urlCache.set(url, fileId);
  return fileId;
}

export async function uploadUrls(urls: string[], prefix: string): Promise<string[]> {
  const results: string[] = [];
  for (let i = 0; i < urls.length; i++) {
    try {
      const ext = urls[i].includes('.mp4') ? 'mp4' : 'jpg';
      const fileId = await uploadFromUrl(urls[i], `${prefix}-${i}.${ext}`, { kind: ext === 'mp4' ? 'video' : 'image' });
      results.push(mediaUrl(fileId));
    } catch (err) {
      console.warn(`GridFS upload skipped for ${urls[i]}:`, err);
      results.push(urls[i]);
    }
  }
  return results;
}

export async function streamFile(fileId: string): Promise<{
  stream: mongoose.mongo.GridFSBucketReadStream;
  contentType: string;
}> {
  const bucket = getGridFSBucket();
  const _id = new mongoose.Types.ObjectId(fileId);
  const files = await bucket.find({ _id }).toArray();
  if (!files.length) throw new Error('File not found');
  const file = files[0];
  const contentType =
    (file.contentType as string) ||
    (file.metadata?.contentType as string) ||
    'application/octet-stream';
  return { stream: bucket.openDownloadStream(_id), contentType };
}

export async function deleteFile(fileId: string): Promise<void> {
  const bucket = getGridFSBucket();
  await bucket.delete(new mongoose.Types.ObjectId(fileId));
}

export function clearUrlCache() {
  urlCache.clear();
}
