import sharp from 'sharp';
import path from 'node:path';

export const iconSizes = [48, 72, 96, 144, 192, 256, 384, 512];

export async function iconResponse(size: number) {
  const image = await sharp(path.resolve('src/images/my-profile-image.png'))
    .resize({
      width: size,
      height: size,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer();
  return new Response(new Uint8Array(image), {
    headers: { 'Content-Type': 'image/png' },
  });
}
