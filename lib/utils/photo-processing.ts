import { Api } from "grammy";

// Get the largest photo from an array of photo sizes
// The photo array is sorted by size, with the largest last
export function getLargestPhoto(photos: Array<{ file_id: string }>): { file_id: string } {
  return photos[photos.length - 1];
}

// Download photo from Telegram and convert to base64
export async function downloadPhotoFromTelegram(
  fileId: string,
  api: Api
): Promise<{ base64: string; mimeType: string }> {
  const file = await api.getFile(fileId);
  const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

  console.log("📥 Downloading image from:", fileUrl);
  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();
  const base64Image = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = file.file_path?.endsWith(".png") ? "image/png" : "image/jpeg";
  
  console.log("✅ Image downloaded, size:", arrayBuffer.byteLength, "bytes, type:", mimeType);
  
  return { base64: base64Image, mimeType };
}
