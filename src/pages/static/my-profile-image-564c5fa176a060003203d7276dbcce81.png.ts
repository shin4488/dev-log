import { readFile } from 'node:fs/promises';

// Existing social previews and bookmarks refer to this published asset URL.
export async function GET() {
  return new Response(
    new Uint8Array(await readFile('src/images/my-profile-image.png')),
    {
      headers: { 'Content-Type': 'image/png' },
    },
  );
}
